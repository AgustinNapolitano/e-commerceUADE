import React from 'react';
import { Plus } from 'lucide-react';

/**
 * ProductCard Component
 * Representa una "Card de Producto" como se mencionó en la Clase 04.
 * Es un componente funcional que recibe datos mediante props.
 */
const ProductCard = ({ producto, onAddToCart }) => {
  return (
    <div className="col-12 col-md-6 col-lg-3 mb-4">
      <div className="card glass hover-scale h-100">
        {/* Imagen del producto */}
        <div className="overflow-hidden">
          <img 
            src={producto.imagen} 
            className="card-img-top" 
            alt={producto.nombre} 
          />
        </div>
        
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-bold mb-0">{producto.nombre}</h5>
            <span className="badge bg-light text-dark border">Nuevo</span>
          </div>
          
          <p className="card-text text-muted small flex-grow-1">
            {producto.descripcion}
          </p>
          
          <div className="mt-3 d-flex justify-content-between align-items-center">
            <div>
              <span className="text-primary fw-bold fs-4">${producto.precio}</span>
              <div className="text-muted small">En 12x sin interés</div>
            </div>
            
            {/* Botón de acción - Usa una prop recibida (función) */}
            <button 
              className="btn btn-primary" 
              onClick={() => onAddToCart(producto)}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
