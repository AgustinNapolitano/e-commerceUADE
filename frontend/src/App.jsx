import ProductList from './components/ProductList'
import CategoryList from './components/CategoryList'
import NavBar from './components/NavBar'
import ProductDetail from './components/ProductDetail'
import Pedido from './components/Pedido'
import Home from './components/Home'
import Auth from './components/Auth'
import AdminPanel from './components/AdminPanel'
import Carrito from './components/Carrito'
import Favorite from './components/Favorite'
import Perfil from './components/Perfil'
import { Toaster } from 'sileo'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchCartItems, syncCart } from './store/slices/cartSlice'
import { fetchFavorites } from './store/slices/favoritesSlice'

// Componente para proteger la ruta de administrador
const ProtectedAdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Componente para proteger rutas de usuarios logueados (clientes y admins)
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para proteger rutas exclusivas de clientes (compras y favoritos)
const ProtectedUserRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'USER') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  // 1. Cargar el carrito y favoritos desde el backend al iniciar sesión
  useEffect(() => {
    if (user) {
      dispatch(fetchCartItems());
      dispatch(fetchFavorites());
    }
  }, [user, dispatch]);

  // 2. Sincronizar cambios locales del carrito con el backend
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        dispatch(syncCart(cartItems));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, user, dispatch]);

  return (
    <div className={`app ${theme}`}>
      <Toaster position="top-center" offset={90} options={{ duration: 3000 }} />
      <NavBar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/categorias" element={<CategoryList />} />
          
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <Pedido />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/carrito"
            element={
              <ProtectedUserRoute>
                <Carrito />
              </ProtectedUserRoute>
            }
          />
          
          <Route
            path="/favoritos"
            element={
              <ProtectedUserRoute>
                <Favorite />
              </ProtectedUserRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          
          <Route path="/login" element={<Auth initialMode="login" />} />
          <Route path="/registro" element={<Auth initialMode="register" />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            }
            />
         </Routes>
      </div>
    </div>
  )
}

export default App;
