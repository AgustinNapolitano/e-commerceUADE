import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CreditCard, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import './Carrito.css';

const Carrito = () => {
  const { user, cart, updateCartQuantity, removeFromCart, clearCart } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const envio = subtotal > 15000 ? 0 : 990;
  const total = subtotal + envio;

  // Obtener el ID del usuario al cargar el componente
  useEffect(() => {
    const fetchUsuarioId = async () => {
      if (!user || !user.token) return;

      try {
        setLoading(true);
        // Decodificar el email del JWT token payload
        const parts = user.token.split('.');
        if (parts.length !== 3) {
          throw new Error('Token JWT inválido');
        }
        
        const payload = JSON.parse(atob(parts[1]));
        const email = payload.sub;

        // Obtener la lista completa de usuarios para matchear por email
        const response = await fetch('http://localhost:8080/api/usuarios', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al validar credenciales de usuario');
        }

        const usuarios = await response.json();
        const loggedUser = usuarios.find(u => u.email === email);

        if (loggedUser) {
          setUsuarioId(loggedUser.id);
        } else {
          throw new Error('No se encontró el usuario en la base de datos');
        }
      } catch (err) {
        console.error('Error al resolver usuario:', err);
        setError('No se pudo verificar tu sesión. Por favor, vuelve a iniciar sesión.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioId();
  }, [user]);

  // Manejar el checkout / compra
  const handleCheckout = async () => {
    if (!usuarioId) {
      setError('Error de sesión: No se identificó el ID de usuario.');
      return;
    }

    if (cart.length === 0) {
      setError('El carrito está vacío.');
      return;
    }

    setCheckingOut(true);
    setError(null);

    const pedidoRequest = {
      usuarioId: usuarioId,
      items: cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(pedidoRequest)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al procesar la compra. Inténtalo de nuevo.');
      }

      setSuccess(true);
      clearCart();
      
      setTimeout(() => {
        navigate('/pedidos');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-loading-container">
        <Loader2 className="spinner" size={48} />
        <p>Cargando información del carrito...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="cart-success-container">
        <CheckCircle2 className="success-icon" size={64} />
        <h2>¡Compra realizada con éxito!</h2>
        <p>Tu pedido ha sido registrado. Redirigiéndote a tus pedidos...</p>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h1>Mi Carrito</h1>
        <p>Gestiona los artículos de tu compra actual</p>
      </div>

      {error && (
        <div className="cart-error-alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="cart-empty-card">
          <div className="empty-icon-wrapper">
            <ShoppingBag size={48} />
          </div>
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestro catálogo y agrega los productos que más te gusten.</p>
          <Link to="/productos" className="btn-browse">
            Ver Productos
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Listado de items */}
          <div className="cart-items-section">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                {item.imagen && (
                  <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
                )}
                
                <div className="cart-item-details">
                  <span className="cart-item-title">{item.nombre}</span>
                  <span className="cart-item-desc">{item.descripcion}</span>
                  <span className="cart-item-unit-price">
                    Precio unitario: ${Number(item.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="cart-item-quantity-actions">
                  <div className="quantity-selector">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.cantidad - 1)}
                      className="quantity-btn"
                      title="Disminuir"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="quantity-value">{item.cantidad}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.cantidad + 1)}
                      className="quantity-btn"
                      title="Aumentar"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="cart-item-subtotal">
                    <span>${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="btn-delete-item"
                    title="Eliminar artículo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-actions-row">
              <button onClick={clearCart} className="btn-clear-cart">
                Vaciar Carrito
              </button>
              <Link to="/productos" className="btn-continue-shopping">
                Seguir Comprando
              </Link>
            </div>
          </div>

          {/* Resumen de la compra */}
          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Resumen de Compra</h3>
              
              <div className="summary-row">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.cantidad, 0)} prod.)</span>
                <span>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="summary-row">
                <span>Costo de envío</span>
                {envio === 0 ? (
                  <span className="shipping-free">Gratis</span>
                ) : (
                  <span>${envio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                )}
              </div>

              {subtotal < 15000 && (
                <div className="shipping-incentive">
                  💡 Agrega <strong>${(15000 - subtotal).toLocaleString('es-AR')}</strong> más para tener <strong>Envío Gratis</strong>.
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Total</span>
                <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <button 
                onClick={handleCheckout} 
                className="btn-checkout"
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="spinner" size={18} />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Confirmar Compra
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
