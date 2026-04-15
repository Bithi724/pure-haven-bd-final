"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  stock?: number;
};

type AddToCartItem = Omit<CartItem, "quantity">;

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: AddToCartItem) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "pure-haven-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setCartItems([]);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (item: AddToCartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        const knownStock =
          typeof item.stock === "number"
            ? item.stock
            : typeof existing.stock === "number"
            ? existing.stock
            : undefined;

        if (typeof knownStock === "number" && existing.quantity >= knownStock) {
          return prev;
        }

        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                stock: typeof knownStock === "number" ? knownStock : p.stock,
                quantity: p.quantity + 1,
              }
            : p
        );
      }

      if (typeof item.stock === "number" && item.stock <= 0) {
        return prev;
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (typeof item.stock === "number" && item.quantity >= item.stock) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}