"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  /** False until localStorage has been read, to avoid SSR/hydration mismatch. */
  ready: boolean;
  items: CartItem[];
  count: number;
  subtotalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "handcrafted-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load the persisted cart once on mount. This deliberately sets state in an
  // effect: localStorage is client-only, so the server and first client render
  // must both start empty (gated by `ready`) to avoid a hydration mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe initial load, see above
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Ignore corrupt/unavailable storage; start with an empty cart.
    }
    setReady(true);
  }, []);

  // Persist on every change, but only after the initial load.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be full or unavailable; the in-memory cart still works.
    }
  }, [items, ready]);

  const addItem = useCallback<CartContextValue["addItem"]>((item, quantity = 1) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>(
    (productId, quantity) => {
      setItems((prev) =>
        quantity < 1
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
    return { ready, items, count, subtotalCents, addItem, removeItem, updateQuantity, clear };
  }, [ready, items, addItem, removeItem, updateQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
