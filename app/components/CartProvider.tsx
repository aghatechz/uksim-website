"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import CartDrawer, { CartItem } from "./CartDrawer";
import WishlistDrawer, { WishlistItem } from "./WishlistDrawer";

const CART_STORAGE_KEY = "vsh-cart";
const WISHLIST_STORAGE_KEY = "vsh-wishlist";

export interface AddToCartPayload {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  carrier: string;
}

export interface AddToWishlistPayload {
  id: string;
  name: string;
  price: number;
  image: string;
  carrier: string;
}

interface CartContextValue {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  cartCount: number;
  cartOpen: boolean;
  wishlistOpen: boolean;
  addToCart: (item: AddToCartPayload) => void;
  updateQty: (id: string, newQty: number) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (item: AddToWishlistPayload) => void;
  removeFromWishlist: (id: string) => void;
  moveWishlistToCart: (item: WishlistItem) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

function loadFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate cart & wishlist from localStorage on first mount
  useEffect(() => {
    const storedCart = loadFromStorage<CartItem[]>(CART_STORAGE_KEY);
    const storedWishlist = loadFromStorage<WishlistItem[]>(WISHLIST_STORAGE_KEY);
    if (storedCart) setCartItems(storedCart);
    if (storedWishlist) setWishlistItems(storedWishlist);
    setHydrated(true);
  }, []);

  // Persist cart to localStorage whenever it changes (skip until hydrated to avoid wiping stored data)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      /* storage unavailable */
    }
  }, [cartItems, hydrated]);

  // Persist wishlist to localStorage whenever it changes (skip until hydrated)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      /* storage unavailable */
    }
  }, [wishlistItems, hydrated]);

  const addToCart = useCallback((item: AddToCartPayload) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
    setCartOpen(true);
  }, []);

  const updateQty = useCallback((id: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleWishlist = useCallback(
    (item: AddToWishlistPayload) => {
      const exists = wishlistItems.some((i) => i.id === item.id);
      setWishlistItems((prev) =>
        exists ? prev.filter((i) => i.id !== item.id) : [...prev, item]
      );
      if (!exists) setWishlistOpen(true);
    },
    [wishlistItems]
  );

  const removeFromWishlist = useCallback((id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const moveWishlistToCart = useCallback((item: WishlistItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openWishlist = useCallback(() => setWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setWishlistOpen(false), []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleCartCheckout = useCallback(
    (_pkgName?: string, _price?: number) => {
      closeCart();
      if (cartItems.length > 0) {
        const params = new URLSearchParams();
        params.set("items", JSON.stringify(cartItems));
        window.location.href = `/checkout?${params.toString()}`;
      } else {
        window.location.href = "/checkout";
      }
    },
    [cartItems, closeCart]
  );

  const value = useMemo(
    () => ({
      cartItems,
      wishlistItems,
      cartCount,
      cartOpen,
      wishlistOpen,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      removeFromWishlist,
      moveWishlistToCart,
      clearCart,
      openCart,
      closeCart,
      openWishlist,
      closeWishlist,
    }),
    [
      cartItems,
      wishlistItems,
      cartCount,
      cartOpen,
      wishlistOpen,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      removeFromWishlist,
      moveWishlistToCart,
      clearCart,
      openCart,
      closeCart,
      openWishlist,
      closeWishlist,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}

      <CartDrawer
        isOpen={cartOpen}
        onClose={closeCart}
        items={cartItems}
        onUpdateQty={updateQty}
        onRemoveItem={removeFromCart}
        onCheckout={handleCartCheckout}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={closeWishlist}
        items={wishlistItems}
        onRemoveItem={removeFromWishlist}
        onMoveToCart={moveWishlistToCart}
      />
    </CartContext.Provider>
  );
}
