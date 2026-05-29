import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import './Carrito.css';

const Carrito = () => {
  const { user } = useAuth();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal 
  } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCheckout = async () => {
    // 1. Si no está logueado, redirigir a Login con redirección de regreso
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // 2. Si es ADMIN, no permitir comprar (bloqueo extra de seguridad)
    if (user.role === 'ADMIN') {
      setErrorMsg('Los administradores no pueden realizar compras');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 3. Obtener el ID del usuario actual consultando la lista de usuarios
      const usersResponse = await fetch('http://localhost:8080/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!usersResponse.ok) {
        throw new Error('No se pudo verificar la información del usuario');
      }

      const usersList = await usersResponse.json();
      const currentUser = usersList.find(u => u.email === user.email);

      if (!currentUser) {
        throw new Error('Usuario actual no encontrado en la base de datos');
      }

      const usuarioId = currentUser.id;

      // 4. Formatear los ítems del pedido según el DTO (productoId y cantidad)
      const pedidoItems = cartItems.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad
      }));

      // 5. Crear el pedido por POST
      const pedidoResponse = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          usuarioId,
          items: pedidoItems
        })
      });

      if (!pedidoResponse.ok) {
        throw new Error('Error al registrar el pedido en el servidor');
      }

      // 6. Éxito: Vaciar carrito, mostrar mensaje y redirigir
      clearCart();
      setSuccessMsg('¡Compra realizada con éxito! Redirigiendo a tus pedidos...');
      
      setTimeout(() => {
        navigate('/pedidos');
      }, 2000);

    } catch (err) {
      setErrorMsg(err.message || 'Hubo un problema al procesar tu compra. Por favor reintenta.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-container text-center py-5">
        <ShoppingBag size={64} className="text-muted mb-3" />
        <h2>Tu Carrito está vacío</h2>
        <p className="text-muted">Explora nuestro catálogo y agrega excelentes artículos a tu carrito.</p>
        <Link to="/productos" className="btn btn-primary-custom mt-3">
          <ArrowLeft size={16} className="me-2" />
          Ver Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container container my-5">
      <div className="cart-header mb-4">
        <h1 className="cart-title">Tu Carrito de Compras</h1>
        <p className="cart-subtitle text-muted">Revisa tus artículos antes de completar tu pedido seguro.</p>
      </div>

      {errorMsg && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <AlertCircle size={20} className="me-2" />
          <div>{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
          <CheckCircle2 size={20} className="me-2" />
          <div>{successMsg}</div>
        </div>
      )}

      <div className="row g-4">
        {/* Lista de Productos */}
        <div className="col-lg-8">
          <div className="cart-card shadow-sm p-4">
            <div className="table-responsive">
              <table className="cart-table w-100">
                <thead>
                  <tr className="text-muted border-bottom pb-2">
                    <th>Producto</th>
                    <th className="text-center">Precio</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-bottom py-3">
                      <td className="py-3">
                        <div className="product-cell d-flex align-items-center">
                          {item.imagen && (
                            <img 
                              src={item.imagen} 
                              alt={item.nombre} 
                              className="product-img-thumbnail rounded me-3" 
                            />
                          )}
                          <div>
                            <h5 className="product-name mb-0">{item.nombre}</h5>
                            <span className="product-id-label text-muted" style={{ fontSize: '0.8rem' }}>
                              ID: {item.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        ${Number(item.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3">
                        <div className="quantity-control-wrapper d-flex align-items-center justify-content-center">
                          <button 
                            className="quantity-btn btn-sm btn-light border"
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            disabled={loading}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="quantity-value mx-3 fw-bold">{item.cantidad}</span>
                          <button 
                            className="quantity-btn btn-sm btn-light border"
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            disabled={loading}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-bold py-3">
                        ${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-center py-3">
                        <button 
                          className="btn-remove-item text-danger border-0 bg-transparent"
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                          title="Eliminar del carrito"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-actions-footer d-flex justify-content-between align-items-center mt-4">
              <Link to="/productos" className="btn btn-outline-secondary">
                <ArrowLeft size={16} className="me-2" />
                Continuar comprando
              </Link>
              <button 
                className="btn btn-outline-danger" 
                onClick={clearCart}
                disabled={loading}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>

        {/* Resumen del Pedido */}
        <div className="col-lg-4">
          <div className="cart-card summary-card shadow-sm p-4">
            <h4 className="summary-title mb-4 border-bottom pb-2">Resumen de Pedido</h4>
            
            <div className="summary-row d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal de artículos</span>
              <span>${cartTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="summary-row d-flex justify-content-between mb-3">
              <span className="text-muted">Envío</span>
              <span className="text-success fw-bold">Gratis</span>
            </div>

            <div className="summary-divider border-bottom mb-3"></div>

            <div className="summary-row d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold">Total</h5>
              <h4 className="mb-0 fw-bold text-primary">
                ${cartTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </h4>
            </div>

            <button 
              className="btn btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="me-2 spinner-loading" />
                  Procesando Pedido...
                </>
              ) : (
                <>
                  <CreditCard size={18} className="me-2" />
                  {user ? 'Finalizar Compra' : 'Iniciar Sesión para Comprar'}
                </>
              )}
            </button>

            {!user && (
              <p className="text-muted text-center mt-2" style={{ fontSize: '0.85rem' }}>
                Te redirigiremos temporalmente para iniciar sesión de forma segura.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
