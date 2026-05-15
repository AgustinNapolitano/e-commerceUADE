import React from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

/**
 * Navbar Component
 * @param {Object} props - Las props son para pasar datos del padre al hijo.
 * @param {number} props.cartCount - Cantidad de productos en el carrito.
 * @param {Function} props.onCartClick - Función para abrir el carrito.
 */
const Navbar = ({ cartCount, onCartClick }) => {
  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-3">
      <div className="container">
        {/* Logo del E-commerce */}
        <a className="navbar-brand fw-bold fs-3 text-primary" href="#">
          UADE<span className="text-dark">Store</span>
        </a>

        {/* Botón para móviles */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <Menu />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Barra de búsqueda - Ejemplo de UI declarativa */}
          <div className="mx-auto my-3 my-lg-0 d-flex position-relative">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Buscar productos, marcas y más..." 
            />
            <Search className="position-absolute end-0 me-3 top-50 translate-middle-y text-muted" size={18} />
          </div>

          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <a className="nav-link px-3" href="#">Ofertas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3" href="#">Historial</a>
            </li>
            
            {/* Iconos de usuario y carrito */}
            <li className="nav-item ms-lg-4">
              <button className="btn btn-link text-dark p-2 position-relative" onClick={onCartClick}>
                <ShoppingCart size={24} />
                {/* Renderizado condicional: solo muestra el badge si hay items */}
                {cartCount > 0 && (
                  <span className="badge rounded-pill badge-cart">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>
            <li className="nav-item ms-2">
              <button className="btn btn-link text-dark p-2">
                <User size={24} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
