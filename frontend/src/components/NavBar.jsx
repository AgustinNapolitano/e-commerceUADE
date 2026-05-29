import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, LogIn } from 'lucide-react';
import './NavBar.css';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🛒 E-Commerce UADE
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
              Inicio
            </Link>
          </li>

          <li>
            <Link to="/productos" className={isActive('/productos') ? 'nav-link active' : 'nav-link'}>
              Productos
            </Link>
          </li>

          <li>
            <Link to="/categorias" className={isActive('/categorias') ? 'nav-link active' : 'nav-link'}>
              Categorías
            </Link>
          </li>

          {user && (
            <li>
              <Link to="/pedidos" className={isActive('/pedidos') ? 'nav-link active' : 'nav-link'}>
                Pedidos
              </Link>
            </li>
          )}

          {user && user.role === 'ADMIN' && (
            <li>
              <Link to="/admin" className={isActive('/admin') ? 'nav-link active' : 'nav-link'}>
                Panel Admin
              </Link>
            </li>
          )}


          {user ? (
            <li className="nav-user-section">
              <div className="nav-user-badge">
                <User size={16} className="nav-user-icon" />
                <span className="nav-user-greeting">¡Hola, {user.nombre}!</span>
              </div>
              <button onClick={logout} className="nav-logout-btn" title="Cerrar Sesión">
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="nav-login-btn">
                <LogIn size={16} />
                <span>Ingresar</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
