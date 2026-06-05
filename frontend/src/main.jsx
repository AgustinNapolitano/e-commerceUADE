import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createRoot} from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { CartProvider } from './context/CartContext'
import { FavoriteProvider } from './context/FavoriteContext'

// Importamos Bootstrap (CSS y JS)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'



createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Provider store={store}>
        <CartProvider>
          <FavoriteProvider>
            <App />
          </FavoriteProvider>
        </CartProvider>
      </Provider>
    </BrowserRouter>
)
