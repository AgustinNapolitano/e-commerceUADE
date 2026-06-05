import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ShoppingBag, Sliders, ArrowRight, CreditCard, Truck, RotateCcw, Headphones, Sparkles, Package, ListFilter, CheckCircle } from 'lucide-react';
import './Home.css';

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="home-container">
      {/* Background gradient elements */}
      <div className="hero-bg-glows">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
        <div className="glow glow-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={14} className="badge-icon" /> Experiencia de Compra Inteligente
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tu Destino Digital de Compras
            <span>UADE E-COMMERCE</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Encuentra la mejor selección de productos con un diseño elegante, navegación ágil y transacciones seguras. Explora nuestro catálogo y lleva tus compras online al siguiente nivel.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/productos" className="btn-primary-custom">
              Ver Catálogo <ShoppingBag size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Promotion banner */}
      {user && user.role === 'ADMIN' && (
        <section className="promo-banner">
          <div className="promo-content">
            <div className="promo-text">
              <span className="promo-tag">Panel Administrativo</span>
              <h2>¿Deseas gestionar el catálogo de productos?</h2>
              <p>Accede al panel de administración para agregar, actualizar stock, editar especificaciones o eliminar productos en tiempo real.</p>
            </div>
            <Link to="/admin" className="promo-btn">
              Administrar Catálogo <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* Benefits Grid Section */}
      <section className="benefits-section">
        <div className="section-header">
          <h2>Beneficios de Nuestra Plataforma</h2>
          <p>Ofrecemos un servicio premium pensado en tu comodidad, rapidez y total seguridad durante toda tu experiencia.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Truck size={24} />
            </div>
            <h3>Envíos Rápidos</h3>
            <p>Recibe tus pedidos en tiempo récord y con la máxima seguridad garantizada hasta la puerta de tu hogar.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Sparkles size={24} />
            </div>
            <h3>Mejores Productos</h3>
            <p>Explora una selección curada de artículos de alta calidad y de las marcas más destacadas del mercado.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <ShoppingBag size={24} />
            </div>
            <h3>Experiencia de Compra</h3>
            <p>Disfruta de una navegación fluida, filtros inteligentes y un proceso de compra simple y sin fricciones.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <RotateCcw size={24} />
            </div>
            <h3>Soporte y Garantía</h3>
            <p>Estamos aquí para asistirte en todo momento con políticas de devolución flexibles y soporte dedicado.</p>
          </div>
        </div>
      </section>

      {/* Interactive Showcase section (Small description & visual blocks) */}
      <section className="showcase-section">
        <div className="info-showcase">
          <div className="showcase-text">
            <span className="showcase-tag">Navegación Optimizada</span>
            <h2>Explora productos, categorías y haz tu pedido al instante</h2>
            <p>
              Nuestra interfaz te permite buscar artículos de manera fluida gracias al filtro dinámico por categorías.
              Puedes consultar información detallada de cada producto y agregar ítems a tu flujo de compras con clics ágiles y sencillos.
            </p>
            <div className="showcase-features-list">
              <div className="showcase-item">
                <CheckCircle size={20} className="showcase-item-icon" />
                <div className="showcase-item-content">
                  <h4>Exploración Instantánea</h4>
                  <p>Búsqueda intuitiva de productos con información detallada.</p>
                </div>
              </div>
              <div className="showcase-item">
                <CheckCircle size={20} className="showcase-item-icon" />
                <div className="showcase-item-content">
                  <h4>Filtros por Categoría</h4>
                  <p>Agrupación de artículos para una experiencia de usuario focalizada.</p>
                </div>
              </div>
              <div className="showcase-item">
                <CheckCircle size={20} className="showcase-item-icon" />
                <div className="showcase-item-content">
                  <h4>Pedidos y Control</h4>
                  <p>Acceso rápido a tu panel para chequear y administrar los pedidos realizados.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-visual">
            <div className="visual-card">
              <div className="visual-card-icon">
                <Package size={22} />
              </div>
              <h4>Ficha de Artículos</h4>
              <p>Descripciones completas con precios actualizados y control de stock.</p>
            </div>
            <div className="visual-card offset">
              <div className="visual-card-icon">
                <ListFilter size={22} />
              </div>
              <h4>Filtros Activos</h4>
              <p>Navega a través de categorías con transiciones suaves en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
