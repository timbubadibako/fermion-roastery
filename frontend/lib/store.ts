import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from "@/lib/api";
import { supabase } from "./supabase";

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

export interface CartItem {
  lineItemId: string; // Unique identifier for this cart line
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight: string;
  grind: string;
  selected?: boolean;
  priceType?: string;
  original_price?: number;
  isB2B?: boolean;
  b2b_discount_enabled?: boolean;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'lineItemId'>, selectOnly?: boolean) => void;
  removeItem: (lineItemId: string) => void;
  removeItems: (lineItemIdsToRemove: string[]) => void;
  updateQuantity: (lineItemId: string, quantity: number) => void;
  toggleSelection: (lineItemId: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  getTotal: (onlySelected?: boolean) => number;
  syncWithServer: () => Promise<void>;
  // Migration helper
  ensureIds: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setIsOpen: (isOpen) => set({ isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      ensureIds: () => {
        const currentItems = get().items;
        const needsFix = currentItems.some(item => !item.lineItemId);
        if (needsFix) {
          const fixedItems = currentItems.map(item => ({
            ...item,
            lineItemId: item.lineItemId || generateId()
          }));
          set({ items: fixedItems });
        }
      },

      addItem: (newItem, selectOnly = false) => {
        const currentItems = get().items;

        let baseItems = selectOnly
          ? currentItems.map(item => ({ ...item, selected: false }))
          : currentItems;

        // Try to merge if item is exactly same (product + options + isB2B)
        const existingItemIndex = baseItems.findIndex(
          (item) => item.id === newItem.id && item.weight === newItem.weight && item.grind === newItem.grind && item.isB2B === newItem.isB2B
        );

        let updatedItems;
        if (existingItemIndex > -1) {
          updatedItems = [...baseItems];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          updatedItems[existingItemIndex].selected = true;
        } else {
          updatedItems = [...baseItems, {
            ...newItem,
            lineItemId: generateId(),
            selected: true
          }];
        }

        set({ items: updatedItems, isOpen: !selectOnly });
        get().syncWithServer();
      },

      removeItem: (lineItemId) => {
        set({ items: get().items.filter((item) => item.lineItemId !== lineItemId) });
        get().syncWithServer();
      },

      removeItems: (lineItemIdsToRemove) => {
        if (!lineItemIdsToRemove || lineItemIdsToRemove.length === 0) return;

        const updatedItems = get().items.filter(
          (item) => !lineItemIdsToRemove.includes(item.lineItemId)
        );
        set({ items: updatedItems });
        get().syncWithServer();
      },

      updateQuantity: (lineItemId, quantity) => {
        const updatedItems = get().items.map((item) =>
          (item.lineItemId === lineItemId)
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        );
        set({ items: updatedItems });
        get().syncWithServer();
      },

      toggleSelection: (lineItemId) => {
        const updatedItems = get().items.map((item) => {
          if (item.lineItemId === lineItemId) {
            const currentSelected = item.selected === undefined ? true : item.selected;
            return { ...item, selected: !currentSelected };
          }
          return item;
        });
        set({ items: updatedItems });
        get().syncWithServer();
      },

      clearCart: () => {
        set({ items: [] });
        get().syncWithServer();
      },

      setItems: (items) => {
        // Ensure incoming items have IDs
        const itemsWithIds = items.map(i => ({ ...i, lineItemId: i.lineItemId || generateId() }));
        set({ items: itemsWithIds });
      },

      getTotal: (onlySelected = false) => {
        const targetItems = onlySelected
          ? get().items.filter(item => item.selected !== false)
          : get().items;
        return targetItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      syncWithServer: async () => {
        // Future sync logic
      }
    }),
    {
      name: 'fermion-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// --- Auth Store ---
interface AuthStore {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      refreshSession: async () => {
        const { user } = get();
        if (!user || !user.id) return;
        try {
          // FORCE nunggu inisialisasi session Supabase kelar dulu sebelum nembak apiFetch
          await supabase.auth.getSession();

          // Use our next.js proxy routing with cache busting
          const res = await apiFetch(`/api/auth/profile/${user.id}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          });

          if (res.ok) {
            const freshUser = await res.json();
            // preserve any local auth tokens if necessary, or just merge
            set({ user: { ...user, ...freshUser } });
          }
        } catch (e) {
          console.error("Failed to refresh session", e);
        }
      },
      logout: () => {
        document.cookie = "fermion_profile_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null });
        useCartStore.getState().setItems([]);
      },
    }),
    {
      name: 'fermion-auth-storage',
    }
  )
);

// --- Spotlight Store ---
interface SpotlightStore {
  hasSeenTour: boolean;
  isTourActive: boolean;
  currentStep: number;
  setHasSeenTour: (seen: boolean) => void;
  startTour: () => void;
  endTour: () => void;
  setStep: (step: number) => void;
  nextStep: () => void;
}

export const useSpotlightStore = create<SpotlightStore>()(
  persist(
    (set, get) => ({
      hasSeenTour: false,
      isTourActive: false,
      currentStep: 0,
      setHasSeenTour: (seen) => set({ hasSeenTour: seen }),
      startTour: () => set({ isTourActive: true, currentStep: 0 }),
      endTour: () => set({ isTourActive: false, hasSeenTour: true }),
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set({ currentStep: get().currentStep + 1 }),
    }),
    {
      name: 'fermion-spotlight-storage',
      partialize: (state) => ({ hasSeenTour: state.hasSeenTour }),
    }
  )
);

// --- Language Store ---
interface LangStore {
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  toggleLanguage: () => void;
}

export const useLangStore = create<LangStore>()(
  persist(
    (set, get) => ({
      language: 'en', // Default to English given the scrapbook vibes
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set({ language: get().language === 'id' ? 'en' : 'id' }),
    }),
    {
      name: 'fermion-lang-storage',
    }
  )
);
