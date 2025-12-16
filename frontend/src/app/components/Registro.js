import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// 1. Importamos los iconos del ojo
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
//import { registro, reset } from '../features/authSlice';
import { registro, reset } from '../features/authSlice';
import Spinner from './Spinner';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    password2: '',
  });

  // 2. Estados para controlar la visibilidad de AMBOS campos
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { nombre, email, password, password2 } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) navigate('/');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Las contraseñas no coinciden');
    } else {
      const userData = { nombre, email, password };
      dispatch(registro(userData));
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">
          <FaUserPlus />
        </div>
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-subtitle">Únete para empezar a rentar equipo</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre Completo</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                name="nombre"
                value={nombre}
                placeholder="Tu nombre"
                onChange={onChange}
                required
              />
              <FaUser className="input-icon" size={16} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <input
                type="email"
                className="form-input"
                name="email"
                value={email}
                placeholder="usuario@ejemplo.com"
                onChange={onChange}
                required
              />
              <FaEnvelope className="input-icon" size={16} />
            </div>
          </div>

          {/* CAMPO DE CONTRASEÑA */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={onChange}
                required
              />
              <FaLock className="input-icon" size={16} />
              
              {/* Botón Toggle */}
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* CAMPO DE CONFIRMAR CONTRASEÑA */}
          <div className="form-group">
            <label htmlFor="password2" className="form-label">Confirmar Contraseña</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                name="password2"
                value={password2}
                placeholder="••••••••"
                onChange={onChange}
                required
              />
              <FaLock className="input-icon" size={16} />
              
              {/* Botón Toggle Independiente */}
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-block">
            Registrarme <FaUserPlus />
          </button>
        </form>
        
        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;