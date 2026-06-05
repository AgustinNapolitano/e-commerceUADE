import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorite } from '../context/FavoriteContext';
import { Heart } from 'lucide-react';
import './ProductList.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { favoriteItems, addToFavorite, removeFromFavorite } = useFavorite();
  const [products, setProducts] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    location.state?.category || "Todas"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await fetch('http://localhost:8080/api/productos');

        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }

        const data = await response.json();

        setProducts(data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }
    };

    fetchProducts();

  }, []);

  if (loading) return <div>Cargando productos...</div>;

  if (error) return <div>Error: {error}</div>;

  const items = Array.isArray(products)
    ? products
    : products?.productos || products?.data || products?.items || [];

  const categorias = [
    "Todas",
    ...new Set(
      items
        .map(product => product.categoriaNombre)
        .filter(Boolean)
    )
  ];

  const productosFiltrados = items.filter(product => {

    const name =
      product.nombre ??
      product.title ??
      product.name ??
      "";

    const categoria =
      product.categoriaNombre ??
      "";

    const coincideBusqueda = name
      .toLowerCase()
      .includes(textoBusqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      categoria === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="product-list-container">

      <h1 className="titulo">Lista de Productos</h1>

      <div className="filters-container">

        <input
          type="text"
          placeholder="Buscar producto..."
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          className="search-input"
        />

        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="category-select"
        >
          {categorias.map(categoria => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>

      </div>

      <div className="products-grid">

        {productosFiltrados.length === 0 && (
          <div>No hay productos.</div>
        )}

        {productosFiltrados.map(product => {

          const id =
            product.id ??
            product._id ??
            product.codigo;

          const name =
            product.nombre ??
            product.title ??
            product.name ??
            'Sin nombre';

          const desc =
            product.descripcion ??
            product.description ??
            '';

          const price =
            product.precio ??
            product.price ??
            0;

          const img =
            product.imagen ??
            product.image ??
            '';

          return (
            <div
              key={id}
              className="product-card"
            >

              <Link
                to={`/productos/${id}`}
                className="product-link"
              >

                {img && (
                  <img
                    src={img}
                    alt={name}
                    className="product-image"
                  />
                )}

                <h3 className="product-title">
                  {name}
                </h3>

                <p className="product-price">
                  ${Number(price).toLocaleString('es-AR')}
                </p>

                <p className="product-description">
                  {desc}
                </p>

                <span className="product-detail">
                  Ver detalle →
                </span>

              </Link>

              
                <div className="product-actions">

                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                        return;
                      }

                      dispatch(addToCart(product));

                    }}
                    className="add-cart-button"
                  >
                    Agregar al carrito
                  </button>

                  {(() => {
                    const isFav = favoriteItems.some(
                      f => (f.id ?? f._id ?? f.codigo) === id
                    );

                    return (
                      <button
                        onClick={() => {
                          isFav
                            ? removeFromFavorite(id)
                            : addToFavorite(product);
                        }}
                        title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: isFav ? '#e53e3e' : '#999',
                        }}
                      >
                        <Heart
                          size={20}
                          fill={isFav ? '#e53e3e' : 'none'}
                        />
                      </button>
                    );
                  })()}

                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;