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
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchCartItems, syncCart } from './store/slices/cartSlice'

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

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  // 1. Cargar el carrito desde el backend al iniciar sesión
  useEffect(() => {
    if (user) {
      dispatch(fetchCartItems());
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
    
      <NavBar />

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
        
        <Route path="/carrito-redux" element={<Carrito />} />
        
        <Route
          path="/favoritos-redux"
          element={
            <ProtectedRoute>
              <Favorite />
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
  )
}

export default App;
