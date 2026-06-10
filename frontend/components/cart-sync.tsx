"use client";

import { useEffect } from 'react';
import { useAuthStore, useCartStore } from '@/lib/store';

export function CartSync() {
  const { user } = useAuthStore();
  const { items, setItems } = useCartStore();

  // 1. Fetch cart from DB on login or refresh
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      
      try {
        const res = await fetch(`/api/cart?profileId=${user.id}`);
        if (res.ok) {
          const dbItems = await res.json();
          // Merge or override? We'll override with DB state for security and consistency
          if (dbItems.length > 0) {
            setItems(dbItems);
          }
        }
      } catch (error) {
        console.error("Cart Fetch Error:", error);
      }
    };

    fetchCart();
  }, [user?.id]);

  // 2. Sync cart to DB whenever items change and user is logged in
  useEffect(() => {
    const syncCart = async () => {
      if (!user) return;

      try {
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: user.id, items }),
        });
      } catch (error) {
        console.error("Cart Sync Error:", error);
      }
    };

    // Debounce or just sync
    const timeout = setTimeout(syncCart, 1000);
    return () => clearTimeout(timeout);
  }, [items, user?.id]);

  return null; // Renderless component
}
