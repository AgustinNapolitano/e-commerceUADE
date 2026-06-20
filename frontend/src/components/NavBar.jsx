import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { User, LogOut, LogIn, ShoppingCart, Heart, ChevronDown } from 'lucide-react';
import './NavBar.css';
import { toggleTheme } from '../store/slices/themeSlice';
import { Sun, Moon } from 'lucide-react';


function Navbar() {
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
  const theme = useSelector((state) => state.theme.mode);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;

      // Mostrar si se scrolla para arriba o si se está muy cerca del tope superior
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 80);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.nav-user-section')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${visible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          E-Commerce UADE
        </Link>

        <ul className="nav-menu">
          <li>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="theme-toggle-btn"
              title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'light' ? 'Oscuro' : 'Claro'}</span>
            </button>
          </li>
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
            <li className="nav-user-section" style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`nav-user-badge ${dropdownOpen ? 'active' : ''}`}
                title="Menú de usuario"
              >
                <User size={20} className="nav-user-icon" />
                <span className="nav-user-greeting">¡Hola, {user.nombre}!</span>
                <ChevronDown size={14} className={`nav-chevron-icon ${dropdownOpen ? 'rotated' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="nav-user-dropdown">
                  <Link
                    to="/perfil"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={14} className="me-2" />
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      dispatch(logout());
                    }}
                    className="dropdown-item text-danger"
                  >
                    <LogOut size={14} className="me-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
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
