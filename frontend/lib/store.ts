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
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setIsOpen: (isOpen) => set({ isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.id === newItem.id && item.weight === newItem.weight && item.grind === newItem.grind
        );

        let updatedItems;
        if (existingItemIndex > -1) {
          updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          updatedItems = [...currentItems, newItem];
        }
        
        set({ items: updatedItems, isOpen: true });
        get().syncWithServer();
      },

      removeItem: (id) => {
        const updatedItems = get().items.filter((item) => item.id !== id);
        set({ items: updatedItems });
        get().syncWithServer();
      },

      updateQuantity: (id, quantity) => {
        const updatedItems = get().items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        set({ items: updatedItems });
        get().syncWithServer();
      },

      clearCart: () => {
        set({ items: [] });
        get().syncWithServer();
      },

      setItems: (items) => set({ items }),

      getTotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      // Helper to sync with DB if logged in
      syncWithServer: async () => {
        // This will be called from the component/hook level or we could use useAuthStore.getState()
        // But to keep it simple, we'll handle the actual fetch calls in a separate sync hook
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
        // Clear cart items on logout to prevent leakage
        useCartStore.getState().setItems([]);
      },
    }),
    {
      name: 'fermion-auth-storage',
    }
  )
);
