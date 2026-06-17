import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
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
  addItem: (item: CartItem, selectOnly?: boolean) => void;
  removeItem: (lineItemId: string) => void;
  removeItems: (lineItemIdsToRemove: string[]) => void;
  updateQuantity: (id: string | number, weight: string, grind: string, quantity: number) => void;
  toggleSelection: (id: string | number, weight: string, grind: string) => void;
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
        
        // If selectOnly is true (Buy It Now), unselect everything first
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
          updatedItems = [...baseItems, { ...newItem, selected: true }];
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

      updateQuantity: (id, weight, grind, quantity) => {
        const updatedItems = get().items.map((item) =>
          (item.id === id && item.weight === weight && item.grind === grind) 
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        );
        set({ items: updatedItems });
        get().syncWithServer();
      },

      toggleSelection: (id, weight, grind) => {
        const updatedItems = get().items.map((item) => {
          if (item.id === id && item.weight === weight && item.grind === grind) {
            // If selected is undefined, it was implicitly true, so toggle to false
            const currentSelected = item.selected === undefined ? true : item.selected;
            return { ...item, selected: !currentSelected };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
        get().syncWithServer();
      },

      setItems: (items) => set({ items }),

      getTotal: (onlySelected = false) => {
        const targetItems = onlySelected 
          ? get().items.filter(item => item.selected !== false) // Implicitly true if undefined
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
