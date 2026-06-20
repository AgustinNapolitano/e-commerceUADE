import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { sileo } from 'sileo';
import './AdminPanel.css';

const AdminPanel = () => {
  const user = useSelector((state) => state.auth.user);
  const token = user?.token;
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [activeTab, setActiveTab] = useState('articulos');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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

  // Estado para el formulario CRUD Categorías
  const [catFormData, setCatFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [editCatId, setEditCatId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const resProd = await fetch('http://localhost:8080/api/productos', { headers });
      const resCat = await fetch('http://localhost:8080/api/categorias', { headers });
      const resPed = await fetch('http://localhost:8080/api/pedidos', { headers });

      if (resProd.ok) setProductos(await resProd.json());
      if (resCat.ok) setCategorias(await resCat.json());
      if (resPed.ok) {
        const pedData = await resPed.json();
        setPedidos(pedData.sort((a, b) => b.id - a.id));
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (pedidoId, nuevoEstado) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      
      const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}/estado?nuevoEstado=${nuevoEstado}`, {
        method: 'PUT',
        headers
      });

      if (response.ok) {
        setPedidos(prevPedidos =>
          prevPedidos.map(p => p.id === pedidoId ? { ...p, estado: nuevoEstado } : p)
        );
        sileo.success({ title: 'Estado actualizado', description: 'El pedido fue actualizado correctamente.' });
      } else {
        sileo.error({ title: 'Error', description: 'No se pudo actualizar el estado del pedido.' });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      sileo.error({ title: 'Error de conexión', description: 'No se pudo conectar al servidor.' });
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
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: '', stock: '', imageUrl: '', categoriaId: '' });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
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
        sileo.success({ title: isEditing ? 'Producto actualizado' : 'Producto creado', description: isEditing ? 'Los cambios fueron guardados correctamente.' : 'El nuevo producto fue agregado al catálogo.' });
        resetForm();
        fetchData();
      } else {
        sileo.error({ title: 'Error al guardar', description: 'Verificá que tengas permisos de ADMIN.' });
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
          method: 'DELETE',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.ok) {
          fetchData();
        } else {
          sileo.error({ title: 'Error al eliminar', description: 'Verificá que tengas permisos de ADMIN.' });
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleCatChange = (e) => {
    setCatFormData({ ...catFormData, [e.target.name]: e.target.value });
  };

  const handleCatEdit = (cat) => {
    setCatFormData({
      nombre: cat.nombre,
      descripcion: cat.descripcion || ''
    });
    setIsEditingCat(true);
    setEditCatId(cat.id);
  };

  const resetCatForm = () => {
    setCatFormData({ nombre: '', descripcion: '' });
    setIsEditingCat(false);
    setEditCatId(null);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: catFormData.nombre,
        descripcion: catFormData.descripcion
      };

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const url = isEditingCat
        ? `http://localhost:8080/api/categorias/${editCatId}`
        : 'http://localhost:8080/api/categorias';
      const method = isEditingCat ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        sileo.success({ title: isEditingCat ? 'Categoría actualizada' : 'Categoría creada', description: isEditingCat ? 'Los cambios fueron guardados correctamente.' : 'La nueva categoría fue creada con éxito.' });
        resetCatForm();
        fetchData();
      } else {
        sileo.error({ title: 'Error al guardar', description: 'No se pudo guardar la categoría.' });
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleCatDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/categorias/${id}`, {
          method: 'DELETE',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.ok) {
          fetchData();
        } else {
          sileo.error({ title: 'Error al eliminar', description: 'Es posible que la categoría tenga artículos asociados.' });
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h2>Panel de Administración</h2>
          <p className="text-muted">Gestioná el catálogo de artículos, categorías, stock y pedidos en tiempo real.</p>
        </div>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('articulos')}
          className={`admin-tab-btn ${activeTab === 'articulos' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            fontWeight: 'bold',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'articulos' ? '3px solid #1A73E8' : 'none',
            color: activeTab === 'articulos' ? '#1A73E8' : '#666',
            cursor: 'pointer'
          }}
        >
          Artículos
        </button>
        <button 
          onClick={() => setActiveTab('pedidos')}
          className={`admin-tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            fontWeight: 'bold',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'pedidos' ? '3px solid #1A73E8' : 'none',
            color: activeTab === 'pedidos' ? '#1A73E8' : '#666',
            cursor: 'pointer'
          }}
        >
          Pedidos de Clientes
        </button>
        <button 
          onClick={() => setActiveTab('categorias')}
          className={`admin-tab-btn ${activeTab === 'categorias' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            fontWeight: 'bold',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'categorias' ? '3px solid #1A73E8' : 'none',
            color: activeTab === 'categorias' ? '#1A73E8' : '#666',
            cursor: 'pointer'
          }}
        >
          Categorías
        </button>
      </div>

      {activeTab === 'articulos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          <div className="admin-actions-bar" style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button 
              onClick={() => {
                if (showForm) {
                  resetForm();
                } else {
                  setShowForm(true);
                }
              }} 
              className="btn-primary-custom"
              style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', fontWeight: 'bold' }}
            >
              {showForm ? 'Ocultar Formulario' : 'Crear Nuevo Artículo'}
            </button>
          </div>

          {showForm && (
            <div className="admin-card form-card" style={{ width: '100%' }}>
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
                  <button type="button" onClick={resetForm} className="btn-cancel">
                    {isEditing ? 'Cancelar' : 'Cerrar'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Productos */}
          <div className="admin-card list-card" style={{ width: '100%' }}>
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
                            {prod.stock > 0 ? prod.stock : 'Agotado'}
                          </span>
                        </td>
                        <td className="col-actions text-center">
                          <button onClick={() => handleEdit(prod)} className="btn-action-edit btn-icon" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => handleDelete(prod.id)} className="btn-action-delete btn-icon" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
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
      )}

      {activeTab === 'pedidos' && (
        <div className="admin-card list-card" style={{ width: '100%' }}>
          <h3>Listado de Pedidos de Clientes</h3>
          {loading ? (
            <div className="admin-loading">Cargando pedidos...</div>
          ) : pedidos.length === 0 ? (
            <div className="admin-empty">No hay pedidos registrados en el sistema.</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones / Cambiar Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map(ped => (
                    <tr key={ped.id}>
                      <td className="col-id">#PED-{ped.id}</td>
                      <td>
                        <strong>{ped.emailUsuario}</strong>
                        <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>ID Cliente: {ped.usuarioId}</p>
                      </td>
                      <td>{new Date(ped.fecha).toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td style={{ fontWeight: 'bold' }}>
                        ${Number(ped.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span 
                          className={`badge-stock`}
                          style={{
                            backgroundColor: 
                              ped.estado === 'PENDIENTE' ? '#FEF3C7' :
                              ped.estado === 'CONFIRMADO' ? '#DBEAFE' :
                              ped.estado === 'ENVIADO' ? '#F3E8FD' :
                              ped.estado === 'ENTREGADO' ? '#DCFCE7' : '#FEE2E2',
                            color: 
                              ped.estado === 'PENDIENTE' ? '#D97706' :
                              ped.estado === 'CONFIRMADO' ? '#2563EB' :
                              ped.estado === 'ENVIADO' ? '#7C3AED' :
                              ped.estado === 'ENTREGADO' ? '#16A34A' : '#DC2626',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {ped.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        <select 
                          value={ped.estado} 
                          onChange={(e) => handleStatusChange(ped.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="CONFIRMADO">Confirmado</option>
                          <option value="ENVIADO">Enviado</option>
                          <option value="ENTREGADO">Entregado</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categorias' && (
        <div className="admin-grid">
          {/* Formulario CRUD Categorías */}
          <div className="admin-card form-card">
            <h3>{isEditingCat ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <form onSubmit={handleCatSubmit} className="admin-form">
              <div className="form-group">
                <label>Nombre de la Categoría *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej. Componentes"
                  value={catFormData.nombre}
                  onChange={handleCatChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  placeholder="Detalles sobre la categoría..."
                  value={catFormData.descripcion}
                  onChange={handleCatChange}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  {isEditingCat ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
                {isEditingCat && (
                  <button type="button" onClick={resetCatForm} className="btn-cancel">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de Categorías */}
          <div className="admin-card list-card">
            <h3>Listado de Categorías</h3>
            {loading ? (
              <div className="admin-loading">Cargando categorías...</div>
            ) : categorias.length === 0 ? (
              <div className="admin-empty">No hay categorías cargadas en el sistema.</div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map(cat => (
                      <tr key={cat.id}>
                        <td className="col-id">#{cat.id}</td>
                        <td>
                          <strong>{cat.nombre}</strong>
                        </td>
                        <td>
                          <p className="prod-desc-text" style={{ margin: 0 }}>{cat.descripcion || 'Sin descripción'}</p>
                        </td>
                        <td className="col-actions text-center">
                          <button onClick={() => handleCatEdit(cat)} className="btn-action-edit btn-icon" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => handleCatDelete(cat.id)} className="btn-action-delete btn-icon" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
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
      )}
    </div>
  );
};

export default AdminPanel;
