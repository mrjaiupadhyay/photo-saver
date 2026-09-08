import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    if (!user) return setCart({ items: [] });
    api.get("/cart").then(({ data }) => setCart(data)).catch(() => setCart({ items: [] }));
  }, [user]);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart", { productId, quantity });
    setCart(data);
  };

  const updateQty = async (productId, quantity) => {
    const { data } = await api.patch("/cart", { productId, quantity });
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clear = async () => {
    const { data } = await api.delete("/cart");
    setCart(data);
  };

  const total = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0),
    [cart]
  );

  return (
    <CartContext.Provider value={{ cart, setCart, addItem, updateQty, removeItem, clear, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
