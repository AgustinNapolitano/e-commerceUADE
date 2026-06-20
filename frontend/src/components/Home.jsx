import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBag, ArrowRight, Truck, Sparkles, Package, ListFilter, RotateCcw, CheckCircle } from 'lucide-react';
import './Home.css';

const HeroHeadline = () => (
  <>
    <span className="hero-line">Los mejores</span>
    <span className="hero-line hero-line--italic">precios</span>
    <span className="hero-line">de la Argentina.</span>
  </>
);

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const heroRef = useRef(null);
  const overlayRef = useRef(null);

  // Scroll-driven dark overlay
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !overlayRef.current) return;
      const heroHeight = heroRef.current.offsetHeight;
      const progress = Math.min(window.scrollY / (heroHeight * 0.75), 1);
      overlayRef.current.style.opacity = progress;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse spotlight: track position as CSS vars on the hero element
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleMouseLeave = () => {
      // Push spotlight far off-screen so blurred layer shows fully
      hero.style.setProperty('--mouse-x', `-9999px`);
      hero.style.setProperty('--mouse-y', `-9999px`);
    };

    // Init off-screen
    hero.style.setProperty('--mouse-x', `-9999px`);
    hero.style.setProperty('--mouse-y', `-9999px`);

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="home-wrapper">

      {/* ─── NEW HERO ─── */}
      <section className="hero-section" ref={heroRef}>

        {/* Scroll-driven dark overlay */}
        <div className="hero-scroll-overlay" ref={overlayRef} />

        {/* Bottom fade — blends hero into page background */}
        <div className="hero-bottom-fade" />

        {/* Text block: two layers for spotlight effect */}
        <div className="hero-text-block">
          {/* Layer 1: always blurred */}
          <h1 className="hero-headline hero-headline--blurred" aria-hidden="true">
            <HeroHeadline />
          </h1>
          {/* Layer 2: sharp, revealed only under mouse via mask */}
          <h1 className="hero-headline hero-headline--sharp">
            <HeroHeadline />
          </h1>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>


      {/* ─── REST OF PAGE (below hero) ─── */}
      <div className="home-container">

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

        {/* Interactive Showcase section */}
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
    </div>
  );
};

export default Home;
