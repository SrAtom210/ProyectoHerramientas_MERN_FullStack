import { useState, useEffect } from 'react';
import { FaSignInAlt, FaHammer, FaEnvelope, FaLock } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
//import { login, reset } from '../features/authSlice';
import { login, reset } from '../features/authSlice';
import Spinner from './Spinner';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
        {/* Encabezado con Icono Gradiente */}
        <div className="auth-icon">
          <FaHammer />
        </div>
        
        <h1 className="auth-title">TaLadrando</h1>
        <p className="auth-subtitle">¿Necesitas una herramienta? Estás en el lugar correcto.</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <input
                type="email"
                className="form-input"
                id="email"
                name="email"
                value={email}
                placeholder="usuario@ejemplo.com"
                onChange={onChange}
                required
              />
              <FaEnvelope className="input-icon" size={18} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <input
                type="password"
                className="form-input"
                id="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={onChange}
                required
              />
              <FaLock className="input-icon" size={18} />
            </div>
          </div>

          <button type="submit" className="btn-block">
            Ingresar <FaSignInAlt />
          </button>
        </form>

        <div className="auth-footer">
          ¿Nuevo usuario? <Link to="/registro">Crear cuenta gratis</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;