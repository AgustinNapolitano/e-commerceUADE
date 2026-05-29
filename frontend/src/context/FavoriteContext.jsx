import React, { createContext, useContext, useState } from 'react';

const FavoriteContext = createContext(null);

export const FavoriteProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);

  const addToFavorite = (product) => {
    const productId = product.id ?? product._id ?? product.codigo;
    const already = favoriteItems.find(
      (item) => (item.id ?? item._id ?? item.codigo) === productId
    );
    if (already) return; // evitar duplicados

    setFavoriteItems((prev) => [
      ...prev,
      {
        id: productId,
        nombre: product.nombre ?? product.title ?? product.name ?? 'Producto',
        precio: product.precio ?? product.price ?? 0,
        imagen: product.imagen ?? product.image ?? '',
      },
    ]);
  };

  const removeFromFavorite = (productId) => {
    setFavoriteItems((prev) =>
      prev.filter((item) => (item.id ?? item._id ?? item.codigo) !== productId)
    );
  };

  return (
    <FavoriteContext.Provider value={{ favoriteItems, addToFavorite, removeFromFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite debe ser utilizado dentro de un FavoriteProvider');
  }
  return context;
};
