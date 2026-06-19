import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import './ProductDetail.css';
import { useSelector } from 'react-redux';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const user = useSelector((state) => state.auth.user);

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

  const handleAddToCart = () => {
    if (user?.role === 'ADMIN') {
      return; // Bloqueo de seguridad explícito
    }
    dispatch(addToCart(product));
    const productName = product?.nombre || product?.title || product?.name || 'Producto';
    setSuccessMsg(`¡${productName} agregado al carrito!`);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  if (loading) return <div className="product-detail-center">Cargando detalle del producto...</div>;
  if (error) return <div className="product-detail-center">Error: {error}</div>;
  if (!product) return <div className="product-detail-center">Producto no encontrado.</div>;

  const name = product.nombre ?? product.title ?? product.name ?? 'Sin nombre';
  const desc = product.descripcion ?? product.description ?? '';
  const price = product.precio ?? product.price ?? 0;
  const img = product.imagen ?? product.image ?? '';
  const categoria = product.categoriaNombre ?? product.category ?? '';
  const stock = product.stock ?? 0;

  const isAdmin = user?.role === 'ADMIN';

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
          
          <div className="product-detail-stock-container" style={{ margin: '15px 0' }}>
            <span className="product-detail-stock-label" style={{ fontWeight: '500', color: '#666' }}>Stock disponible: </span>
            <span 
              className={`product-detail-stock-value ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}
              style={{
                fontWeight: 'bold',
                color: stock > 0 ? '#10B981' : '#EF4444',
                backgroundColor: stock > 0 ? '#ECFDF5' : '#FEF2F2',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}
            >
              {stock > 0 ? `${stock} unidades` : 'Agotado'}
            </span>
          </div>

          <p className="product-detail-description">{desc}</p>
          
          {user && user.role === 'USER' && (
            <button 
              className="product-detail-buy-button"
              onClick={handleAddToCart}
              disabled={stock <= 0}
              style={stock <= 0 ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}
            >
              {stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
            </button>
          )}

          {isAdmin && (
            <div className="admin-warning-alert">
              <AlertTriangle size={18} />
              <span>Los administradores no pueden realizar compras</span>
            </div>
          )}

          {successMsg && (
            <div className="success-alert">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
