import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/data/products";

type CartItem = { product: Product; size: string; qty: number };

type Ctx = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (p: Product, size?: string) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQty: (id: string, size: string, qty: number) => void;
  toggleWishlist: (id: string) => void;
  cartCount: number;
  cartTotal: number;
};

const ShopCtx = createContext<Ctx | null>(null);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("ws_cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("ws_wish") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("ws_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("ws_wish", JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = (p: Product, size = "M") => {
    setCart((c) => {
      const i = c.findIndex((x) => x.product.id === p.id && x.size === size);
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...c, { product: p, size, qty: 1 }];
    });
  };
  const removeFromCart = (id: string, size: string) =>
    setCart((c) => c.filter((x) => !(x.product.id === id && x.size === size)));
  const updateQty = (id: string, size: string, qty: number) =>
    setCart((c) => c.map((x) => (x.product.id === id && x.size === size ? { ...x, qty: Math.max(1, qty) } : x)));
  const toggleWishlist = (id: string) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const cartTotal = cart.reduce((s, x) => s + x.qty * x.product.price, 0);

  return (
    <ShopCtx.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQty, toggleWishlist, cartCount, cartTotal }}>
      {children}
    </ShopCtx.Provider>
  );
};

export const useShop = () => {
  const c = useContext(ShopCtx);
  if (!c) throw new Error("useShop must be used inside ShopProvider");
  return c;
};
