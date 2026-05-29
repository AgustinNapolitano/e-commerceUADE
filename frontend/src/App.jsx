import ProductList from './components/ProductList'
import CategoryList from './components/CategoryList'
import NavBar from './components/NavBar'
import ProductDetail from './components/ProductDetail'
import Pedido from './components/Pedido'
import Home from './components/Home'
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'
import Register from './components/Register'
import Carrito from './components/Carrito'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Componente para proteger la ruta de administrador
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Componente para proteger rutas que requieren autenticación del Cliente (USER)
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'USER') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Componente para proteger rutas que requieren inicio de sesión básico (cualquier rol autenticado)
const ProtectedAuthRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/categorias" element={<CategoryList />} />
        <Route
          path="/pedidos"
          element={
            <ProtectedAuthRoute>
              <Pedido />
            </ProtectedAuthRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App;
