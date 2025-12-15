import { useState, useEffect } from 'react';
import { FaSignInAlt, FaHammer, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/authSlice';
import Spinner from './Spinner';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  // Estado local para ver contraseña (mejora de UX)
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;
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
    const userData = { email, password };
    dispatch(login(userData));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Icono Principal con efecto de brillo */}
        <div className="auth-header">
            <div className="auth-icon-circle">
                <FaHammer />
            </div>
            <h1 className="auth-title">TaLadrando</h1>
            <p className="auth-subtitle">Acceso a herramientas profesionales</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon left" />
              <input
                type="email"
                className="form-input with-icon"
                id="email"
                name="email"
                value={email}
                placeholder="usuario@ejemplo.com"
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <FaLock className="input-icon left" />
              <input
                type={showPassword ? "text" : "password"}
                className="form-input with-icon with-toggle"
                id="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={onChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-block btn-primary">
            Ingresar <FaSignInAlt />
          </button>
        </form>

        <div className="auth-footer">
          ¿Nuevo aquí? <Link to="/registro">Crear cuenta gratis</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;