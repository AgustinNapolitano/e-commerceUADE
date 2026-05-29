import ProductList from './components/ProductList'
import CategoryList from './components/CategoryList'
import NavBar from './components/NavBar'
import ProductDetail from './components/ProductDetail'
import Pedido from './components/Pedido'
import Home from './components/Home'
import Auth from './components/Auth'
import AdminPanel from './components/AdminPanel'
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
    </>
  )
}

export default App;
