import {Link} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './NavBar.css';



function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

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

          <li>
            <Link to="/pedidos" className={isActive('/pedidos') ? 'nav-link active' : 'nav-link'}>
              Pedidos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar