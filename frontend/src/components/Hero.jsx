import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-5 mb-5 overflow-hidden position-relative">
      {/* Fondo decorativo con gradiente */}
      <div 
        className="position-absolute w-100 h-100 top-0 start-0 z-n1"
        style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)'
        }}
      ></div>

      <div className="container">
        <div className="row align-items-center py-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-bold">
              NUEVA COLECCIÓN 2026
            </span>
            <h1 className="display-3 fw-bold mb-4">
              Tecnología que redefine <br />
              <span className="text-primary text-gradient">tu estilo de vida.</span>
            </h1>
            <p className="lead text-muted mb-5 pe-lg-5">
              Descubre nuestra selección exclusiva de productos premium con envío gratis y cuotas sin interés. Calidad garantizada para tu día a día.
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-primary d-flex align-items-center gap-2">
                Ver Ofertas <ArrowRight size={20} />
              </button>
              <button className="btn btn-outline-dark rounded-4 px-4">
                Explorar Categorías
              </button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="position-relative">
              <div 
                className="position-absolute bg-primary rounded-circle blur-3xl opacity-10" 
                style={{ width: '400px', height: '400px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'blur(80px)' }}
              ></div>
              <img 
                src="/images/laptop.png" 
                alt="Featured Product" 
                className="img-fluid rounded-5 shadow-2xl position-relative z-1 hover-scale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
