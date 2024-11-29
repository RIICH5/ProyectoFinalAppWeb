import React, { createContext, useState, useEffect } from "react";

// Crear el contexto para el carrito
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Intentamos obtener el carrito desde localStorage al iniciar
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [total, setTotal] = useState(0); // Total del carrito

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Calcular el total del carrito en tiempo real
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);

    // Guardar el carrito en localStorage cada vez que cambie
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]); // Solo se ejecuta cuando cambia el carrito

  return (
    <OrderContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        clearCart, // Función para vaciar el carrito
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
