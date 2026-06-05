import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteItems: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorite: (state, action) => {
      const product = action.payload;
      const productId = product.id ?? product._id ?? product.codigo;
      const already = state.favoriteItems.find(
        (item) => (item.id ?? item._id ?? item.codigo) === productId
      );
      if (already) return; // Evitar duplicados

      state.favoriteItems.push({
        id: productId,
        nombre: product.nombre ?? product.title ?? product.name ?? 'Producto',
        precio: product.precio ?? product.price ?? 0,
        imagen: product.imagen ?? product.image ?? '',
      });
    },
    removeFromFavorite: (state, action) => {
      const productId = action.payload;
      state.favoriteItems = state.favoriteItems.filter(
        (item) => (item.id ?? item._id ?? item.codigo) !== productId
      );
    },
  },
});

export const { addToFavorite, removeFromFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
