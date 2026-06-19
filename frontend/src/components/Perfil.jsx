import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserInState, logout } from '../store/slices/authSlice';
import { 
  User, 
  Mail, 
  Calendar, 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Users
} from 'lucide-react';
import './Perfil.css';

const Perfil = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
    sexo: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/usuarios/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar el perfil del usuario');
        }

        const data = await response.json();
        setFormData({
          nombreUsuario: data.nombreUsuario || '',
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          password: '',
          confirmPassword: '',
          fechaNacimiento: data.fechaNacimiento || '',
          sexo: data.sexo || ''
        });
      } catch (err) {
        setErrorMsg(err.message || 'Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        nombreUsuario: formData.nombreUsuario,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        fechaNacimiento: formData.fechaNacimiento,
        sexo: formData.sexo
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(`http://localhost:8080/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedUser = await response.json();

      // Si el email cambió, el token anterior queda invalidado (el subject cambia en BD).
      // Debemos desloguear al usuario para que se vuelva a autenticar.
      if (formData.email !== user.email) {
        setSuccessMsg('¡Perfil actualizado! Como cambiaste tu email, debes iniciar sesión de nuevo.');
        setTimeout(() => {
          dispatch(logout());
          navigate('/login');
        }, 3000);
      } else {
        // Actualizar el estado local de Redux
        dispatch(updateUserInState({
          nombre: updatedUser.nombre,
          email: updatedUser.email
        }));
        setSuccessMsg('¡Perfil actualizado con éxito!');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (err) {
      setErrorMsg(err.message || 'Hubo un error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="profile-center">
        <Loader2 className="spinner-loading" size={40} />
        <p className="mt-2">Cargando tus datos de perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-container container my-5">
      <div className="profile-card shadow-sm p-4 mx-auto" style={{ maxWidth: '650px' }}>
        <div className="profile-header text-center mb-4">
          <div className="profile-avatar mb-3 mx-auto d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: '80px', height: '80px' }}>
            <User size={40} />
          </div>
          <h2 className="profile-title">Mi Perfil</h2>
          <p className="profile-subtitle text-muted">Administra tu información personal y configuración de cuenta</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <AlertCircle size={20} className="me-2" />
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
            <CheckCircle2 size={20} className="me-2" />
            <div>{successMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="row g-3">
            {/* Nombre de Usuario (Solo lectura o informativo) */}
            <div className="col-12">
              <label className="form-label">Nombre de Usuario (ID de cuenta)</label>
              <div className="input-group">
                <span className="input-group-text"><Users size={18} /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.nombreUsuario} 
                  disabled 
                  title="El nombre de usuario no se puede cambiar"
                />
              </div>
              <small className="text-muted">El nombre de usuario no es modificable.</small>
            </div>

            {/* Nombre */}
            <div className="col-md-6">
              <label className="form-label">Nombre *</label>
              <input 
                type="text" 
                className="form-control" 
                name="nombre"
                value={formData.nombre} 
                onChange={handleChange}
                required
              />
            </div>

            {/* Apellido */}
            <div className="col-md-6">
              <label className="form-label">Apellido *</label>
              <input 
                type="text" 
                className="form-control" 
                name="apellido"
                value={formData.apellido} 
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="col-12">
              <label className="form-label">Correo Electrónico *</label>
              <div className="input-group">
                <span className="input-group-text"><Mail size={18} /></span>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  required
                />
              </div>
              <small className="text-warning">Nota: Si cambias tu correo, deberás volver a iniciar sesión.</small>
            </div>

            {/* Fecha de Nacimiento */}
            <div className="col-md-6">
              <label className="form-label">Fecha de Nacimiento *</label>
              <div className="input-group">
                <span className="input-group-text"><Calendar size={18} /></span>
                <input 
                  type="date" 
                  className="form-control" 
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Sexo / Género */}
            <div className="col-md-6">
              <label className="form-label">Sexo *</label>
              <select 
                className="form-select" 
                name="sexo"
                value={formData.sexo} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <div className="border-bottom my-4"></div>
            <h5 className="mb-3">Cambiar Contraseña (Opcional)</h5>

            {/* Nueva Contraseña */}
            <div className="col-md-6">
              <label className="form-label">Nueva Contraseña</label>
              <div className="input-group">
                <span className="input-group-text"><Lock size={18} /></span>
                <input 
                  type="password" 
                  className="form-control" 
                  name="password"
                  placeholder="Dejar en blanco para no cambiar"
                  value={formData.password} 
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div className="col-md-6">
              <label className="form-label">Confirmar Contraseña</label>
              <div className="input-group">
                <span className="input-group-text"><Lock size={18} /></span>
                <input 
                  type="password" 
                  className="form-control" 
                  name="confirmPassword"
                  placeholder="Dejar en blanco para no cambiar"
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="col-12 mt-4 text-center">
              <button 
                type="submit" 
                className="btn btn-primary-custom px-5 py-3 d-inline-flex align-items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="me-2 spinner-loading" />
                    Guardando Cambios...
                  </>
                ) : (
                  <>
                    <Save size={18} className="me-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
