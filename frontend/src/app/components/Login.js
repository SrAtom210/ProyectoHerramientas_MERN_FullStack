import { useState, useEffect } from 'react';
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/authSlice';
import Spinner from './Spinner';
import logoImg from '../../assets/LogoSinFondo.png';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    dispatch(login({ email, password }));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Encabezado */}
        <div className="auth-icon-circle" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <img src={logoImg} alt="Logo" style={{ width: '100px' }} />
          </div>
        <h1 className="auth-title">TaLadrando</h1>
        <p className="auth-subtitle">Accede a tu panel de herramientas</p>

        <form onSubmit={onSubmit}>
          
          {/* GRUPO 1: EMAIL */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            
            {/* CORRECCIÓN: El wrapper solo envuelve al input y al icono */}
            <div className="input-wrapper">
              <input
                type="email"
                className="form-input"
                id="email"
                name="email"
                value={email}
                placeholder="nombre@ejemplo.com"
                onChange={onChange}
                required
              />
              <FaEnvelope className="input-icon" />
            </div>
          </div>

          {/* GRUPO 2: PASSWORD */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                id="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={onChange}
                required
              />
              <FaLock className="input-icon" />
              
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Ingresar <FaSignInAlt />
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;