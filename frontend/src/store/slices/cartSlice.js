import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cart')) || []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload

      const productId = product.id ?? product._id ?? product.codigo

      const existingItem = state.cartItems.find(
        item => item.id === productId
      )

      if (existingItem) {
        existingItem.cantidad += 1
      } else {
        state.cartItems.push({
          id: productId,
          nombre: product.nombre ?? product.title ?? product.name ?? 'Producto',
          precio: product.precio ?? product.price ?? 0,
          imagen: product.imagen ?? product.image ?? '',
          cantidad: 1
        })
      }

      localStorage.setItem('cart', JSON.stringify(state.cartItems))
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        item => item.id !== action.payload
      )

      localStorage.setItem('cart', JSON.stringify(state.cartItems))
    },

    updateQuantity: (state, action) => {
      const { id, cantidad } = action.payload

      if (cantidad <= 0) {
        state.cartItems = state.cartItems.filter(
          item => item.id !== id
        )
      } else {
        const item = state.cartItems.find(
          item => item.id === id
        )

        if (item) {
          item.cantidad = cantidad
        }
      }

      localStorage.setItem('cart', JSON.stringify(state.cartItems))
    },

    clearCart: (state) => {
      state.cartItems = []
      localStorage.removeItem('cart')
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions

export default cartSlice.reducer