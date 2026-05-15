import React, { useEffect, useState } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // `useEffect` se ejecuta una sola vez al montar el componente.
  // Aquí iniciamos la carga de productos desde la API.
  // pasar `[]` como segundo argumento hace que el efecto se ejecute sólo al montar
  useEffect(() => {
    // `fetchProducts` es una función `async` que realiza la petición HTTP.
    // - `async/await` permite escribir código asíncrono secuencialmente.
    // - `try` intenta la petición y parseo JSON; `catch` maneja errores de red/CORS.
    // - `finally` garantiza que la UI deje de mostrar el estado de carga.
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/productos');
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        // Mostrar el error (o usar datos locales como fallback en ejercicios)
        setError(err.message);
      } finally {
        // Siempre desactivar el loading, haya ocurrido error o no.
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  // Normalizar posibles formas de respuesta: array directo o { productos: [...] } u objetos comunes
  const items = Array.isArray(products)
    ? products
    : products?.productos || products?.data || products?.items || [];

  return (
    <div>
      <h1>Lista de Productos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
        {items.length === 0 && <div>No hay productos.</div>}
        {items.map(product => {
          const id = product.id ?? product._id ?? product.codigo;
          const name = product.nombre ?? product.title ?? product.name ?? 'Sin nombre';
          const desc = product.descripcion ?? product.description ?? '';
          const price = product.precio ?? product.price ?? 0;
          const img = product.imagen ?? product.image ?? '';
          return (
            <a
              href={`/products/${id}`}
              key={id || Math.random()}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
              }}>
                {img && (
                  <img
                    src={img}
                    alt={name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                )}
                <h3 style={{ margin: '0.5rem 0' }}>{name}</h3>
                <p style={{ color: '#2D3277', fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>
                  ${Number(price).toLocaleString('es-AR')}
                </p>
                <p style={{ color: '#666', margin: '0' }}>{desc}</p>
                <span style={{ marginTop: '0.5rem', color: '#0a58ca' }}>Ver detalle →</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;