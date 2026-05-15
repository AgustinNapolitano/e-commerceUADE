import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';

// Datos de ejemplo (Mock Data)
const initialProducts = [
  {
    id: 1,
    name: "MacBook Pro M3",
    price: 2499,
    description: "La laptop más potente con el chip M3 Pro. Ideal para desarrolladores y creativos.",
    image: "/images/laptop.png"
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    price: 399,
    description: "Cancelación de ruido líder en la industria y sonido excepcional. 30 horas de batería.",
    image: "/images/headphones.png"
  },
  {
    id: 3,
    name: "Apple Watch Ultra",
    price: 799,
    description: "Resistencia extrema para deportistas. Caja de titanio y GPS de doble frecuencia.",
    image: "/images/watch.png"
  },
  {
    id: 4,
    name: "Nike Air Max Pulse",
    price: 150,
    description: "Estilo urbano con amortiguación premium. Diseñadas para durar y destacar.",
    image: "/images/sneaker.png"
  }
];

function App() {
  /**
   * Estados de React (Manejo del Estado mencionado en Clase 04)
   * - cart: Almacena los productos seleccionados.
   * - isCartOpen: Controla si el sidebar del carrito es visible.
   */
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Función para agregar al carrito
  const addToCart = (product) => {
    // Actualiza el estado usando el setter
    setCart([...cart, product]);
    // Abrir el carrito automáticamente para mostrar el feedback (HMR y Reactividad)
    setIsCartOpen(true);
  };

  // Función para eliminar del carrito
  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  return (
    <div className="min-vh-100 pb-5">
      {/* Navbar con Props: pasamos la cantidad de items y la función para abrir */}
      <Navbar 
        cartCount={cart.length} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      {/* Hero Section */}
      <Hero />

      {/* Listado de Productos (Grid de Bootstrap) */}
      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold mb-0">Productos Destacados</h2>
            <p className="text-muted">Basado en tus búsquedas recientes</p>
          </div>
          <button className="btn btn-link text-primary fw-bold text-decoration-none">
            Ver todos los productos
          </button>
        </div>

        <div className="row">
          {/* Mapeo de componentes (Renderizado de listas mencionado en clase) */}
          {initialProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart} 
            />
          ))}
        </div>
      </main>

      {/* Sidebar del Carrito - Inversión de Control */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onRemove={removeFromCart}
      />

      {/* Footer minimalista */}
      <footer className="container mt-5 pt-5 border-top text-center">
        <p className="text-muted small">
          © 2026 UADE Store. Desarrollado con React + Vite para la Clase 04.
        </p>
      </footer>
    </div>
  );
}

export default App;
