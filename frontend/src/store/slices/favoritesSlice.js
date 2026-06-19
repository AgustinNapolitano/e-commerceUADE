import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
      const authHeader = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '';
      const response = await fetch('http://localhost:8080/api/favoritos', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader
        }
      });
      if (!response.ok) {
        throw new Error('Error al obtener los favoritos');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addFavoriteServer = createAsyncThunk(
  'favorites/addFavoriteServer',
  async (productId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
      const authHeader = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '';
      const response = await fetch(`http://localhost:8080/api/favoritos?productoId=${productId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader
        }
      });
      if (!response.ok) {
        throw new Error('Error al agregar a favoritos');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeFavoriteServer = createAsyncThunk(
  'favorites/removeFavoriteServer',
  async (productId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
      const authHeader = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '';
      const response = await fetch(`http://localhost:8080/api/favoritos/${productId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar de favoritos');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  favoriteItems: [],
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Reducers síncronos por compatibilidad
    addToFavorite: (state, action) => {
      const product = action.payload;
      const productId = product.id ?? product._id ?? product.codigo;
      const already = state.favoriteItems.find(
        (item) => (item.id ?? item._id ?? item.codigo) === productId
      );
      if (already) return;

      state.favoriteItems.push({
        id: productId,
        nombre: product.nombre ?? product.title ?? product.name ?? 'Producto',
        precio: product.precio ?? product.price ?? 0,
        imagen: product.imagen ?? product.image ?? product.imageUrl ?? '',
      });
    },
    removeFromFavorite: (state, action) => {
      const productId = action.payload;
      state.favoriteItems = state.favoriteItems.filter(
        (item) => (item.id ?? item._id ?? item.codigo) !== productId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favoriteItems = action.payload.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imageUrl || item.imagen || ''
        }));
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavoriteServer.fulfilled, (state, action) => {
        state.favoriteItems = action.payload.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imageUrl || item.imagen || ''
        }));
      })
      .addCase(removeFavoriteServer.fulfilled, (state, action) => {
        state.favoriteItems = action.payload.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imageUrl || item.imagen || ''
        }));
      });
  }
});

export const { addToFavorite, removeFromFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
