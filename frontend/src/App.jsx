import ProductList from './components/ProductList'
import CategoryList from './components/CategoryList'
import NavBar from './components/NavBar'
import ProductDetail from './components/ProductDetail'
import Pedido from './components/Pedido'
import Home from './components/Home'
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Componente para proteger la ruta de administrador
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirigir al login si no ha iniciado sesión
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    // Redirigir al inicio si no es administrador
    return <Navigate to="/" replace />;
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
        <Route path="/pedidos" element={<Pedido />} />
        <Route path="/login" element={<Login />} />

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