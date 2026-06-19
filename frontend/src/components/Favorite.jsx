import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavoriteServer } from '../store/slices/favoritesSlice';
import { Heart, Trash2 } from 'lucide-react';

const Favorite = () => {
  const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
  const dispatch = useDispatch();

  if (favoriteItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Heart size={64} color="#ccc" />
        <h2 style={{ marginTop: '16px' }}>No tenés favoritos aún</h2>
        <p style={{ color: '#888' }}>Explorá los productos y agregá los que más te gusten.</p>
        <Link to="/productos" className="btn btn-primary mt-3">
          Ver Productos
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: '24px' }}>
        <Heart size={28} style={{ marginRight: '8px', color: '#e53e3e' }} />
        Mis Favoritos
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {favoriteItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {item.imagen && (
              <img
                src={item.imagen}
                alt={item.nombre}
                style={{ width: '100%', height: '140px', objectFit: 'contain', borderRadius: '8px' }}
              />
            )}
            <h3 style={{ fontSize: '1rem', margin: 0 }}>{item.nombre}</h3>
            <p style={{ fontWeight: 'bold', color: '#2d3748', margin: 0 }}>
              ${Number(item.precio).toLocaleString('es-AR')}
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                to={`/productos/${item.id}`}
                style={{ flex: 1, textAlign: 'center', padding: '6px', border: '1px solid #007bff', borderRadius: '8px', color: '#007bff', textDecoration: 'none', fontSize: '0.85rem' }}
              >
                Ver detalle
              </Link>
              <button
                onClick={() => dispatch(removeFavoriteServer(item.id))}
                title="Quitar de favoritos"
                style={{ background: 'transparent', border: '1px solid #e53e3e', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#e53e3e' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
