import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider proporciona el estado global de autenticación (sesión del usuario)
 * y el estado global del carrito de compras para reactividad instantánea en todo el frontend.
 */
export const AuthProvider = ({ children }) => {
  // ==========================================
  // 1. ESTADO DE AUTENTICACIÓN (Sesión)
  // ==========================================
  const [user, setUser] = useState(() => {
    // Intentar recuperar la sesión guardada en localStorage al iniciar la app
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const nombre = localStorage.getItem('nombre');
    
    if (token && role && nombre) {
      return { token, role, nombre };
    }
    return null;
  });

  // ==========================================
  // 2. ESTADO DEL CARRITO DE COMPRAS
  // ==========================================
  const [cart, setCart] = useState(() => {
    // Intentar recuperar el carrito guardado del localStorage al iniciar la app
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persistir cambios del carrito en localStorage para que no se pierdan al recargar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ==========================================
  // 3. MÉTODOS DE AUTENTICACIÓN
  // ==========================================
  
  /**
   * Guarda las credenciales de la sesión activa tanto en localStorage como en el estado de React.
   */
  const login = (token, role, nombre) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('nombre', nombre);
    setUser({ token, role, nombre });
  };

  /**
   * Limpia toda la sesión activa y el carrito del estado global y localStorage.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nombre');
    localStorage.removeItem('cart');
    setCart([]);
    setUser(null);
  };

  // ==========================================
  // 4. MÉTODOS DEL CARRITO DE COMPRAS
  // ==========================================

  /**
   * Agrega un producto al carrito. Si ya existe, incrementa su cantidad.
   */
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          nombre: product.nombre || product.title || product.name,
          precio: product.precio || product.price || 0,
          imagen: product.imagen || product.image || '',
          descripcion: product.descripcion || product.description || '',
          cantidad: quantity,
        },
      ];
    });
  };

  /**
   * Remueve por completo un producto del carrito.
   */
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  /**
   * Actualiza la cantidad de unidades de un producto. Si es 0 o menor, se remueve.
   */
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  /**
   * Vacía todo el contenido del carrito.
   */
  const clearCart = () => {
    setCart([]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para consumir el contexto de autenticación y carrito.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
