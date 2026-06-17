import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setIsOpen: (isOpen) => set({ isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (newItem, selectOnly = false) => {
        const currentItems = get().items;
        
        let baseItems = selectOnly 
          ? currentItems.map(item => ({ ...item, selected: false }))
          : currentItems;

        const existingItemIndex = baseItems.findIndex(
          (item) => item.id === newItem.id && item.weight === newItem.weight && item.grind === newItem.grind
        );

        let updatedItems;
        if (existingItemIndex > -1) {
          updatedItems = [...baseItems];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          updatedItems[existingItemIndex].selected = true; 
        } else {
          updatedItems = [...baseItems, { 
            ...newItem, 
            lineItemId: crypto.randomUUID(), 
            selected: true 
          }];
        }
        
        set({ items: updatedItems, isOpen: !selectOnly }); 
        get().syncWithServer();
      },

      removeItem: (lineItemId) => {
        const updatedItems = get().items.filter(
          (item) => item.lineItemId !== lineItemId
        );
        set({ items: updatedItems });
        get().syncWithServer();
      },

      removeItems: (lineItemIdsToRemove) => {
        const currentItems = get().items;
        const updatedItems = currentItems.filter(
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

      setItems: (items) => set({ items }),

      getTotal: (onlySelected = false) => {
        const targetItems = onlySelected 
          ? get().items.filter(item => item.selected !== false) 
          : get().items;
        return targetItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      syncWithServer: async () => {
        // Placeholder for server sync
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
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
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
