import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useAuth();
  
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/productos/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo obtener el detalle del producto');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  if (loading) return <div className="product-detail-center">Cargando detalle del producto...</div>;
  if (error) return <div className="product-detail-center">Error: {error}</div>;
  if (!product) return <div className="product-detail-center">Producto no encontrado.</div>;

  const name = product.nombre ?? product.title ?? product.name ?? 'Sin nombre';
  const desc = product.descripcion ?? product.description ?? '';
  const price = product.precio ?? product.price ?? 0;
  const img = product.imagen ?? product.image ?? '';
  const categoria = product.categoriaNombre ?? product.category ?? '';

  return (
    <div className="product-detail-container">
      <Link to="/productos" className="product-detail-back-button">← Volver a productos</Link>

      <div className="product-detail-card">
        {img && (
          <img src={img} alt={name} className="product-detail-image" />
        )}
        <div className="product-detail-info">
          {categoria && <span className="product-detail-category">{categoria}</span>}
          <h1 className="product-detail-title">{name}</h1>
          <p className="product-detail-price">${Number(price).toLocaleString('es-AR')}</p>
          <p className="product-detail-description">{desc}</p>
          
          {(!user || user.role === 'USER') && (
            user ? (
              <button
                onClick={() => {
                  addToCart(product);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1200);
                }}
                className={`product-detail-buy-button ${added ? 'added' : ''}`}
                disabled={added}
              >
                {added ? '¡Agregado al Carrito! ✓' : 'Agregar al Carrito'}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="product-detail-buy-button login-to-buy-detail-btn"
              >
                Iniciá sesión para comprar
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
