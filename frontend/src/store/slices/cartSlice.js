import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// createAsyncThunk crear acciones asincrónicas, genera las acciones pending, fulfilled y rejected para manejar el estado de la petición
export const fetchCartItems = createAsyncThunk(
  // 'cart/fetchCartItems' es el tipo de acción que se genera automáticamente para identificar esta acción asincrónica en los reducers
  'cart/fetchCartItems',
  async () => {
    const token = localStorage.getItem('token');
    const authHeader = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '';
    const response = await fetch('http://localhost:8080/api/carrito', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      credentials: 'include',
      mode: 'cors'
    });
    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }
    const data = await response.json();
    return data;
  }
);

// Thunk para sincronizar el estado local con la API en el backend
export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (items, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const authHeader = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '';
      const response = await fetch('http://localhost:8080/api/carrito', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productoId: item.id,
            cantidad: item.cantidad
          }))
        }),
        credentials: 'include',
        mode: 'cors'
      });
      if (!response.ok) {
        throw new Error('Error al sincronizar el carrito');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// cartSlice cumple la función del CartProvider en useContext
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // listado de productos en el carrito
    items: JSON.parse(localStorage.getItem('cart')) || [],
    total: 0,
    // se agregan los estados de carga y error para manejar la obtención de los items del carrito desde la API
    loading: false,
    error: null
  },

  // acciones internas (síncronas) para agregar, eliminar, actualizar cantidad y limpiar el carrito
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      // find busca en items si ya existe un producto con el mismo id. 
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        // si no encuentra el producto en el array items
        // agrega dicho producto al array items del carrito
        state.items.push({
          id: product.id,
          nombre: product.nombre ?? product.title ?? product.name ?? 'Producto',
          precio: product.precio ?? product.price ?? 0,
          imagen: product.imagen ?? product.image ?? '',
          cantidad: 1
        });
      } else {
        // si existe, incrementar la cantidad del producto
        existingItem.cantidad += 1;
      }

      state.total = state.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      // filter crea un nuevo array sin el producto que queremos eliminar
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateQuantity: (state, action) => {
      const { id, cantidad } = action.payload;
      if (cantidad <= 0) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        const item = state.items.find(item => item.id === id);
        if (item) {
          item.cantidad = cantidad;
        }
      }
      state.total = state.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart');
    }
  },

  // extraReducers maneja las acciones generadas por createAsyncThunk (fetchCartItems, syncCart)
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = state.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        state.loading = false;
        state.error = null;
        localStorage.setItem('cart', JSON.stringify(state.items));
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = state.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        localStorage.setItem('cart', JSON.stringify(state.items));
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;