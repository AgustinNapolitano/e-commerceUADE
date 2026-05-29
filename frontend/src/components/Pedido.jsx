import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Receipt, 
  Search, 
  Filter, 
  AlertTriangle 
} from 'lucide-react';
import './Pedido.css';
import { useAuth } from '../context/AuthContext';

const Pedido = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedPedidoId, setExpandedPedidoId] = useState(null);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/pedidos');
      if (!response.ok) {
        throw new Error('Error al cargar la lista de pedidos');
      }
      const data = await response.json();
      // Sort orders by date descending (newest first) or by ID descending
      const sortedData = data.sort((a, b) => b.id - a.id);
      setPedidos(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const toggleExpand = (id) => {
    if (expandedPedidoId === id) {
      setExpandedPedidoId(null);
    } else {
      setExpandedPedidoId(id);
    }
  };

  // Helper to format date
  const formatFecha = (fechaString) => {
    try {
      const date = new Date(fechaString);
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return fechaString;
    }
  };

  // Helper to get status badge config
  const getStatusConfig = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return {
          icon: <Clock size={16} />,
          text: 'Pendiente',
          className: 'status-pendiente',
          color: '#D97706',
          bg: '#FEF3C7'
        };
      case 'CONFIRMADO':
        return {
          icon: <CheckCircle2 size={16} />,
          text: 'Confirmado',
          className: 'status-confirmado',
          color: '#2563EB',
          bg: '#DBEAFE'
        };
      case 'ENVIADO':
        return {
          icon: <Truck size={16} />,
          text: 'Enviado',
          className: 'status-enviado',
          color: '#7C3AED',
          bg: '#F3E8FD'
        };
      case 'ENTREGADO':
        return {
          icon: <CheckCircle2 size={16} />,
          text: 'Entregado',
          className: 'status-entregado',
          color: '#16A34A',
          bg: '#DCFCE7'
        };
      case 'CANCELADO':
        return {
          icon: <XCircle size={16} />,
          text: 'Cancelado',
          className: 'status-cancelado',
          color: '#DC2626',
          bg: '#FEE2E2'
        };
      default:
        return {
          icon: <Clock size={16} />,
          text: estado,
          className: 'status-default',
          color: '#4B5563',
          bg: '#F3F4F6'
        };
    }
  };

  // Filter by user role so standard users only see their own orders
  const userPedidos = user?.role === 'ADMIN'
    ? pedidos
    : pedidos.filter(p => p.emailUsuario === user?.email);

  // Calculations for KPI Cards
  const totalPedidos = userPedidos.length;
  const totalFacturado = userPedidos
    .filter(p => p.estado !== 'CANCELADO')
    .reduce((sum, p) => sum + (p.total || 0), 0);
  const pedidosActivos = userPedidos.filter(p => p.estado !== 'CANCELADO' && p.estado !== 'ENTREGADO').length;

  // Filtered orders
  const filteredPedidos = userPedidos.filter(pedido => {
    const matchesSearch = 
      (pedido.emailUsuario && pedido.emailUsuario.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pedido.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'ALL' || pedido.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="orders-loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando pedidos...</span>
        </div>
        <p className="mt-3 text-muted">Cargando pedidos en tiempo real...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error-container">
        <AlertTriangle className="error-icon text-danger mb-3" size={48} />
        <h3>Error al obtener los pedidos</h3>
        <p className="text-muted">{error}</p>
        <button onClick={fetchPedidos} className="btn-retry mt-2">
          Reintentar Carga
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      {/* Title & Subtitle */}
      <div className="orders-header">
        <h1 className="titulo-seccion">Listado de Pedidos</h1>
        <p className="subtitulo-seccion">Visualiza y gestiona las compras realizadas en la plataforma de forma dinámica</p>
      </div>

      {/* Analytics KPI Cards */}
      {user?.role === 'ADMIN' && (
        <div className="orders-kpi-grid">
          <div className="kpi-card shadow-sm">
            <div className="kpi-icon-wrapper kpi-blue">
              <ShoppingBag size={24} />
            </div>
            <div className="kpi-content">
              <span className="kpi-title">Pedidos Totales</span>
              <h3 className="kpi-value">{totalPedidos}</h3>
            </div>
          </div>

          <div className="kpi-card shadow-sm">
            <div className="kpi-icon-wrapper kpi-green">
              <DollarSign size={24} />
            </div>
            <div className="kpi-content">
              <span className="kpi-title">Total Facturado</span>
              <h3 className="kpi-value">${totalFacturado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
          </div>

          <div className="kpi-card shadow-sm">
            <div className="kpi-icon-wrapper kpi-purple">
              <Clock size={24} />
            </div>
            <div className="kpi-content">
              <span className="kpi-title">Pedidos en Curso</span>
              <h3 className="kpi-value">{pedidosActivos}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search controls */}
      <div className="orders-controls-card shadow-sm">
        <div className="search-box-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder={user?.role === 'ADMIN' ? "Buscar por ID de pedido o email del cliente..." : "Buscar por ID de pedido..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-wrapper">
          <span className="filter-label">
            <Filter size={16} /> Filtrar por estado:
          </span>
          <div className="filter-buttons">
            {['ALL', 'PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              >
                {status === 'ALL' ? 'Todos' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List / Grid */}
      <div className="orders-list">
        {filteredPedidos.length === 0 ? (
          <div className="no-orders-container text-center py-5 shadow-sm">
            <Receipt size={64} className="text-muted mb-3" />
            <h3>No se encontraron pedidos</h3>
            <p className="text-muted">Prueba cambiando los filtros de estado o la búsqueda.</p>
          </div>
        ) : (
          filteredPedidos.map((pedido) => {
            const statusInfo = getStatusConfig(pedido.estado);
            const isExpanded = expandedPedidoId === pedido.id;

            return (
              <div 
                key={pedido.id} 
                className={`order-card shadow-sm ${isExpanded ? 'order-card-expanded' : ''}`}
              >
                {/* Order Summary Header */}
                <div className="order-summary-header" onClick={() => toggleExpand(pedido.id)}>
                  <div className="order-main-info">
                    <div className="order-id-badge">
                      <span>#PED-{pedido.id}</span>
                    </div>
                    <div className="order-meta-info">
                      <div className="order-meta-item">
                        <Calendar size={14} className="icon-grey" />
                        <span>{formatFecha(pedido.fecha)}</span>
                      </div>
                      <div className="order-meta-item">
                        <User size={14} className="icon-grey" />
                        <span className="order-email">{pedido.emailUsuario}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-status-payment">
                    <div 
                      className={`status-badge ${statusInfo.className}`}
                      style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                    >
                      {statusInfo.icon}
                      <span>{statusInfo.text}</span>
                    </div>
                    <div className="order-total-amount">
                      <span className="total-label">Total</span>
                      <span className="total-value">
                        ${(pedido.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <button className="btn-expand-toggle">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Details */}
                <div className={`order-details-wrapper ${isExpanded ? 'expanded' : ''}`}>
                  <div className="order-details-divider"></div>
                  <div className="order-details-content">
                    <h4 className="details-title">
                      <Receipt size={16} /> Artículos en este Pedido
                    </h4>
                    
                    <div className="table-responsive">
                      <table className="details-table">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th className="text-center">Cantidad</th>
                            <th className="text-right">Precio Unitario</th>
                            <th className="text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.items && pedido.items.length > 0 ? (
                            pedido.items.map((item, index) => (
                              <tr key={item.productoId || index}>
                                <td className="product-name-cell">{item.nombreProducto || `Producto ID: ${item.productoId}`}</td>
                                <td className="text-center quantity-cell">{item.cantidad}</td>
                                <td className="text-right">${(item.precioUnitario || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                <td className="text-right subtotal-cell">${(item.subtotal || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center py-3 text-muted">
                                No hay artículos cargados para este pedido.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="order-details-footer">
                      <span className="user-id-footer">ID de Cliente: {pedido.usuarioId}</span>
                      <div className="footer-total">
                        <span>Resumen: </span>
                        <strong>
                          ${(pedido.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Pedido;
