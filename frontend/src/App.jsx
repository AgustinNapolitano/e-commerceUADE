import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';

function App() {
  const [productos, setProductos] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/productos")
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }

        return response.json();
      })
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(error => {
        setError(error.message);
        setCargando(false);
      });
  }, []);

  const categorias = [
    "Todas",
    ...new Set(productos.map(producto => producto.categoriaNombre))
  ];

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(textoBusqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      producto.categoriaNombre === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  const addToCart = (producto) => {
    setCart([...cart, producto]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(producto => producto.id !== id));
  };

  return (
    <div>
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <Hero />

      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold mb-0">Productos</h2>
            <p className="text-muted">
              Catálogo obtenido desde el backend
            </p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar producto..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-2">
            <select
              className="form-select"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {cargando && <p>Cargando productos...</p>}

        {error && <p className="text-danger">{error}</p>}

        <div className="row">
          {productosFiltrados.map(producto => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemove={removeFromCart}
      />

      <footer className="container mt-5 pt-5 border-top text-center">
        <p className="text-muted small">
          © 2026 UADE Store. Desarrollado con React + Vite.
        </p>
      </footer>
    </div>
  );
}

export default App;