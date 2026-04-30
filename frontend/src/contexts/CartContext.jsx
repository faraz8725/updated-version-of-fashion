import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);
const KEY = "halal-fashions:cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add = (item) => setItems((prev) => {
    const i = prev.findIndex((p) => p.productId === item.productId && p.size === item.size);
    if (i >= 0) {
      const next = [...prev];
      next[i] = { ...next[i], quantity: next[i].quantity + item.quantity };
      return next;
    }
    return [...prev, item];
  });

  const remove = (productId, size) =>
    setItems((prev) => prev.filter((p) => !(p.productId === productId && p.size === size)));

  const setQty = (productId, size, qty) =>
    setItems((prev) => prev.map((p) => p.productId === productId && p.size === size ? { ...p, quantity: Math.max(1, qty) } : p));

  const clear = () => setItems([]);

  const value = useMemo(() => ({
    items, add, remove, setQty, clear,
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.quantity * i.price, 0),
  }), [items]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};
