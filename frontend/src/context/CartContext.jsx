import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, userRole) => {
    if (userRole === 'ADMIN') return;

    setCartItems((prevItems) => {
      // Find item regardless of id format (support both String and Number matching)
      const productId = product.id ?? product._id ?? product.codigo;
      const existingItem = prevItems.find(
        (item) => (item.id ?? item._id ?? item.codigo) === productId
      );

      if (existingItem) {
        return prevItems.map((item) =>
          (item.id ?? item._id ?? item.codigo) === productId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      
      // Store consistent product keys
      return [
        ...prevItems,
        {
          id: productId,
          nombre: product.nombre ?? product.title ?? product.name ?? 'Producto',
          precio: product.precio ?? product.price ?? 0,
          imagen: product.imagen ?? product.image ?? '',
          cantidad: 1
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.id ?? item._id ?? item.codigo) !== productId)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.id ?? item._id ?? item.codigo) === productId
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};
