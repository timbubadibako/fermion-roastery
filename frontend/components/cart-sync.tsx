"use client";

import { useEffect } from 'react';
import { useAuthStore, useCartStore } from '@/lib/store';
import { apiFetch } from '@/lib/api';
import { debugError } from '@/lib/debug';

export function CartSync() {
  const { user } = useAuthStore();
  const { items, setItems, ensureIds, removeItems } = useCartStore();

  // 1. Fetch cart from DB on login or refresh
  useEffect(() => {
    ensureIds();
  }, [ensureIds, items.length]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      
      try {
        const res = await apiFetch(`/api/cart?profileId=${user.id}`);
        if (res.ok) {
          const dbItems = await res.json();
          // Merge or override? We'll override with DB state for security and consistency
          if (dbItems.length > 0) {
            setItems(dbItems);
          }
        } else {
          debugError("Cart Fetch HTTP Error:", await res.text());
        }
      } catch (error) {
        debugError("Cart Fetch Error:", error);
      }
    };

    fetchCart();
  }, [user?.id, setItems]);

  // 2. Sync cart to DB whenever items change and user is logged in
  useEffect(() => {
    const syncCart = async () => {
      if (!user) return;
      ensureIds();

      try {
        const sanitizedItems = items.map((item) => ({
          lineItemId: item.lineItemId,
          id: item.id,
          weight: item.weight,
          grind: item.grind,
          quantity: item.quantity,
          selected: item.selected,
        }));

        const res = await apiFetch('/api/cart/sync', {
          method: 'POST',
          body: JSON.stringify({ profileId: user.id, items: sanitizedItems }),
        });

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (Array.isArray(data?.removedItemIds) && data.removedItemIds.length > 0) {
            const invalidLineItemIds = items
              .filter((item) => data.removedItemIds.includes(item.id))
              .map((item) => item.lineItemId);

            if (invalidLineItemIds.length > 0) {
              removeItems(invalidLineItemIds);
            }
          }
        } else {
          debugError("Cart Sync HTTP Error:", await res.text());
        }
      } catch (error) {
        debugError("Cart Sync Error:", error);
      }
    };

    // Debounce or just sync
    const timeout = setTimeout(syncCart, 1000);
    return () => clearTimeout(timeout);
  }, [items, user?.id, ensureIds, removeItems]);

  return null; // Renderless component
}
