import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinar si hay alguna ruta a la que redirigir tras loguear
  const from = location.state?.from?.pathname || '/';

  // Control de visualización de contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Estados de carga y mensajes
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Datos del formulario de Login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Envío del Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales inválidas. Por favor, verifica tus datos.');
      }

      // Guardar sesión en contexto
      login(data.token, data.role, data.nombre);
      
      setSuccessMsg('¡Sesión iniciada con éxito! Redirigiendo...');
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="radial-background-glow"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-card-container"
      >
        {/* Encabezado del Card */}
        <div className="login-card-header">
          <div className="brand-logo-container">
            <span className="logo-emoji">🛒</span>
            <span className="logo-text">UADE E-Commerce</span>
          </div>
          <p className="card-subtitle">
            ¡Qué bueno verte de nuevo!
          </p>
        </div>

        {/* Mensajes de feedback */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="feedback-alert alert-danger-custom"
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="feedback-alert alert-success-custom"
            >
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido de Formulario */}
        <div className="auth-form-container">
          <form 
            onSubmit={handleLoginSubmit}
            className="auth-form"
          >
            <div className="input-group-custom">
              <label htmlFor="login-email">Correo Electrónico</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="login-email"
                  name="email"
                  placeholder="nombre@correo.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
            </div>

            <div className="input-group-custom">
              <label htmlFor="login-password">Contraseña</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="login-password"
                  name="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  Ingresar
                  <ArrowRight size={18} className="btn-arrow" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
