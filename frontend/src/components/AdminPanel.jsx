import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const { logout } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el formulario CRUD
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imageUrl: '',
    categoriaId: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const resProd = await fetch('http://localhost:8080/api/productos', { headers });
      const resCat = await fetch('http://localhost:8080/api/categorias', { headers });

      if (resProd.ok) setProductos(await resProd.json());
      if (resCat.ok) setCategorias(await resCat.json());

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      imageUrl: producto.imageUrl || '',
      categoriaId: producto.categoriaId ?? ''
    });
    setIsEditing(true);
    setEditId(producto.id);
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: '', stock: '', imageUrl: '', categoriaId: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl,
        categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : null
      };

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const url = isEditing
        ? `http://localhost:8080/api/productos/${editId}`
        : 'http://localhost:8080/api/productos';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(isEditing ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
        resetForm();
        fetchData();
      } else {
        alert('Error al guardar el producto (¿tienes permisos de ADMIN?)');
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
          method: 'DELETE',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.ok) {
          fetchData();
        } else {
          alert('Error al eliminar (¿tienes permisos de ADMIN?)');
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h2>Panel de Administración</h2>
          <p className="text-muted">Gestioná el catálogo de artículos, categorías y stock en tiempo real.</p>
        </div>
      </div>

      <div className="admin-grid">
        {/* Formulario CRUD */}
        <div className="admin-card form-card">
          <h3>{isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Nombre del Producto *</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Teclado Mecánico RGB"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                placeholder="Detalles sobre el producto..."
                value={formData.descripcion}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label>Precio *</label>
                <input
                  type="number"
                  name="precio"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-half">
                <label>Stock disponible *</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select name="categoriaId" value={formData.categoriaId} onChange={handleChange}>
                <option value="">Sin Categoría</option>
                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>URL de Imagen</label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Productos */}
        <div className="admin-card list-card">
          <h3>Listado de Artículos</h3>
          {loading ? (
            <div className="admin-loading">Cargando productos del servidor...</div>
          ) : productos.length === 0 ? (
            <div className="admin-empty">No hay productos cargados en el sistema.</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(prod => (
                    <tr key={prod.id}>
                      <td className="col-id">#{prod.id}</td>
                      <td className="col-img">
                        {prod.imageUrl ? (
                          <img src={prod.imageUrl} alt={prod.nombre} className="table-img" />
                        ) : (
                          <span className="no-img">Sin imagen</span>
                        )}
                      </td>
                      <td className="col-name">
                        <strong className="prod-title">{prod.nombre}</strong>
                        <p className="prod-desc-text">{prod.descripcion || 'Sin descripción'}</p>
                      </td>
                      <td className="col-category">
                        <span className="badge-cat">{prod.categoriaNombre || 'Sin Categoría'}</span>
                      </td>
                      <td className="col-price">${Number(prod.precio).toLocaleString('es-AR')}</td>
                      <td className="col-stock">
                        <span className={`badge-stock ${prod.stock > 0 ? 'in-stock' : 'no-stock'}`}>
                          {prod.stock > 0 ? `${prod.stock} disp.` : 'Agotado'}
                        </span>
                      </td>
                      <td className="col-actions text-center">
                        <button onClick={() => handleEdit(prod)} className="btn-action-edit">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(prod.id)} className="btn-action-delete">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
