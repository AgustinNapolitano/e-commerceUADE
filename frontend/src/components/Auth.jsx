import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  User,
  UserCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import './Auth.css';

const Auth = ({ initialMode = 'login' }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar si hay alguna ruta a la que redirigir tras loguear
  const from = location.state?.from?.pathname || '/';

  // Sincronizar el modo cuando cambia la prop inicial
  const [mode, setMode] = useState(initialMode);
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

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

  // Datos del formulario de Registro
  const [registerData, setRegisterData] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    sexo: '',
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
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

  // Envío del Registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse. Por favor, verifica los campos.');
      }

      // Login automático usando el AuthContext tras registro exitoso
      login(data.token, data.role, data.nombre);
      
      setSuccessMsg('¡Cuenta creada con éxito! Iniciando sesión...');
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    // Actualizar la URL de forma sutil sin recargar
    navigate(newMode === 'login' ? '/login' : '/registro', { replace: true });
  };

  return (
    <div className="auth-page-wrapper">
      <div className="radial-background-glow"></div>
      
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="auth-card-container"
      >
        {/* Encabezado del Card */}
        <div className="auth-card-header">
          <div className="brand-logo-container">
            <span className="logo-emoji">🛒</span>
            <span className="logo-text">UADE E-Commerce</span>
          </div>
          <p className="card-subtitle">
            {mode === 'login' ? '¡Qué bueno verte de nuevo!' : 'Comienza tu viaje de compras con nosotros'}
          </p>
        </div>

        {/* Pestañas de Navegación del Formulario */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            {mode === 'login' && (
              <motion.div 
                layoutId="active-tab-indicator" 
                className="active-tab-pill" 
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="tab-label">Iniciar Sesión</span>
          </button>
          
          <button 
            type="button" 
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            {mode === 'register' && (
              <motion.div 
                layoutId="active-tab-indicator" 
                className="active-tab-pill" 
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="tab-label">Registrarse</span>
          </button>
        </div>

        {/* Mensajes de feedback con altura animada */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="feedback-alert alert-danger-custom"
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="feedback-alert alert-success-custom"
            >
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido de Formulario Animado */}
        <div className="auth-form-content">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
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
              </motion.form>
            ) : (
              <motion.form 
                key="register-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleRegisterSubmit}
                className="auth-form"
              >
                <div className="form-row-grid">
                  <div className="input-group-custom">
                    <label htmlFor="reg-nombre">Nombre</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input 
                        type="text" 
                        id="reg-nombre"
                        name="nombre"
                        placeholder="Tu nombre"
                        value={registerData.nombre}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="input-group-custom">
                    <label htmlFor="reg-apellido">Apellido</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input 
                        type="text" 
                        id="reg-apellido"
                        name="apellido"
                        placeholder="Tu apellido"
                        value={registerData.apellido}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group-custom">
                  <label htmlFor="reg-username">Nombre de Usuario</label>
                  <div className="input-with-icon">
                    <UserCheck size={18} className="input-icon" />
                    <input 
                      type="text" 
                      id="reg-username"
                      name="nombreUsuario"
                      placeholder="Ej: juanperez123"
                      value={registerData.nombreUsuario}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group-custom">
                  <label htmlFor="reg-email">Correo Electrónico</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input 
                      type="email" 
                      id="reg-email"
                      name="email"
                      placeholder="ejemplo@email.com"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group-custom">
                  <label htmlFor="reg-password">Contraseña</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="reg-password"
                      name="password"
                      placeholder="Mínimo 6 caracteres"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      minLength={6}
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

                <div className="form-row-grid">
                  <div className="input-group-custom">
                    <label htmlFor="reg-birth">Fecha de Nacimiento</label>
                    <div className="input-with-icon">
                      <Calendar size={18} className="input-icon" />
                      <input 
                        type="date" 
                        id="reg-birth"
                        name="fechaNacimiento"
                        value={registerData.fechaNacimiento}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="input-group-custom">
                    <label htmlFor="reg-sexo">Sexo</label>
                    <div className="select-with-icon-wrapper">
                      <select 
                        id="reg-sexo"
                        name="sexo" 
                        value={registerData.sexo} 
                        onChange={handleRegisterChange} 
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </select>
                    </div>
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
                      Crear Cuenta
                      <Sparkles size={18} className="btn-arrow" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
