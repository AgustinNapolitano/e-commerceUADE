import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavoriteServer } from '../store/slices/favoritesSlice';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import './Favorite.css';
import { sileo } from 'sileo';

const Favorite = () => {
  const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
  const dispatch = useDispatch();

  if (favoriteItems.length === 0) {
    return (
      <div className="favorites-empty">
        <Heart size={64} className="text-muted mb-3" />
        <h2>No tenés favoritos aún</h2>
        <p>Explorá los productos y agregá los que más te gusten.</p>
        <Link to="/productos" className="btn btn-primary-custom mt-3">
          <ArrowLeft size={16} className="me-2" />
          Ver Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">
        <Heart size={28} className="favorites-title-icon" />
        Mis Favoritos
      </h1>

      <div className="favorites-grid">
        {favoriteItems.map((item) => (
          <div key={item.id} className="favorite-card">
            {item.imagen && (
              <img
                src={item.imagen}
                alt={item.nombre}
                className="favorite-img"
              />
            )}
            <h3 className="favorite-name">{item.nombre}</h3>
            <p className="favorite-price">
              ${Number(item.precio).toLocaleString('es-AR')}
            </p>

            <div className="favorite-actions">
              <Link
                to={`/productos/${item.id}`}
                className="btn-detail-link"
              >
                Ver detalle
              </Link>
              <button
                onClick={() => {
                  dispatch(removeFavoriteServer(item.id));
                  sileo.info({ 
                    title: 'Favorito eliminado', 
                    description: `${item.nombre} fue quitado de tu lista.` 
                  });
                }}
                title="Quitar de favoritos"
                className="btn-remove-favorite"
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
