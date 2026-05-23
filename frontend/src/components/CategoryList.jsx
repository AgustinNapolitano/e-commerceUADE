import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Car, Shirt, Folder, AlertTriangle } from 'lucide-react';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categorias');
        if (!response.ok) {
          throw new Error('Error al cargar las categorías');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper to map category name to a premium Lucide icon and soft theme colors
  const getCategoryIconAndColor = (name = "") => {
    const cleanName = name.toLowerCase();
    if (cleanName.includes('electr') || cleanName.includes('tecn') || cleanName.includes('comput')) {
      return {
        icon: <Laptop size={32} />,
        bg: '#EBF3FE',
        color: '#1A73E8'
      };
    }
    if (cleanName.includes('vehic') || cleanName.includes('auto') || cleanName.includes('coche')) {
      return {
        icon: <Car size={32} />,
        bg: '#E6F4EA',
        color: '#137333'
      };
    }
    if (cleanName.includes('ropa') || cleanName.includes('indumentaria') || cleanName.includes('vest')) {
      return {
        icon: <Shirt size={32} />,
        bg: '#F3E8FD',
        color: '#9333EA'
      };
    }
    return {
      icon: <Folder size={32} />,
      bg: '#F1F3F4',
      color: '#5F6368'
    };
  };

  if (loading) {
    return (
      <div className="category-loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando categorías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-error-container">
        <AlertTriangle className="error-icon text-danger mb-3" size={48} />
        <h3>Ups! Algo salió mal</h3>
        <p className="text-muted">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-outline-primary mt-2">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="category-list-container">
      <div className="category-header text-center">
        <h1 className="titulo-seccion">Categorías</h1>
        <p className="subtitulo-seccion">Explora nuestros productos filtrados por categorías especializadas</p>
      </div>

      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="no-categories text-center py-5">
            <Folder size={64} className="text-muted mb-3" />
            <p className="text-muted">No se encontraron categorías.</p>
          </div>
        ) : (
          categories.map(category => {
            const { icon, bg, color } = getCategoryIconAndColor(category.nombre);
            return (
              <Link
                key={category.id || Math.random()}
                to="/productos"
                state={{ category: category.nombre }}
                className="category-link"
              >
                <div className="category-card">
                  <div className="category-icon-wrapper" style={{ backgroundColor: bg, color: color }}>
                    {icon}
                  </div>
                  <h3 className="category-title">{category.nombre}</h3>
                  <p className="category-description">
                    {category.descripcion || 'Explora una amplia selección de artículos de calidad en esta sección.'}
                  </p>
                  <span className="category-action" style={{ color: color }}>
                    Ver productos →
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryList;
