import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../store/slices/cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer
  }
})