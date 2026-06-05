import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { User, LogOut, LogIn, ShoppingCart, Heart } from 'lucide-react';
import './NavBar.css';

function Navbar() {
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const favoriteItems = useSelector((state) => state.favorites.favoriteItems);

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

          {user && user.role === 'USER' && (
            <li>
              <Link to="/carrito" className={isActive('/carrito') ? 'nav-link active' : 'nav-link'} style={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCart size={16} className="me-1" />
                Carrito
                {cartCount > 0 && (
                  <span className="badge bg-primary rounded-pill ms-1" style={{ fontSize: '0.75rem', padding: '0.25em 0.6em' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          )}

          {user && user.role === 'USER' && (
            <li>
              <Link to="/favoritos" className={isActive('/favoritos') ? 'nav-link active' : 'nav-link'} style={{ display: 'flex', alignItems: 'center' }}>
                <Heart size={16} className="me-1" />
                Favoritos
                {favoriteItems.length > 0 && (
                  <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '0.75rem', padding: '0.25em 0.6em' }}>
                    {favoriteItems.length}
                  </span>
                )}
              </Link>
            </li>
          )}

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
              <button onClick={() => dispatch(logout())} className="nav-logout-btn" title="Cerrar Sesión">
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
