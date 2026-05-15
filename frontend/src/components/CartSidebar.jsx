import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

/**
 * CartSidebar Component
 * Gestiona la visualización del "Carrito de Compras".
 * Recibe el estado del carrito como prop.
 */
const CartSidebar = ({ isOpen, onClose, cartItems, onRemove }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="p-4 d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0 d-flex align-items-center">
            <ShoppingBag className="me-2" /> Mi Carrito
          </h4>
          <button className="btn btn-link text-dark p-0" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow-1 overflow-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">Tu carrito está vacío.</p>
              <button className="btn btn-outline-primary" onClick={onClose}>
                Seguir comprando
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-3 p-3 glass rounded-4">
                <img src={item.image} alt={item.name} className="rounded-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                <div className="ms-3 flex-grow-1">
                  <h6 className="mb-0 fw-bold">{item.name}</h6>
                  <span className="text-primary fw-bold">${item.price}</span>
                </div>
                <button className="btn btn-link text-danger" onClick={() => onRemove(index)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-auto pt-4 border-top">
            <div className="d-flex justify-content-between mb-3">
              <span className="fs-5 fw-bold">Total:</span>
              <span className="fs-5 fw-bold text-primary">${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary w-100 py-3 fs-5">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
