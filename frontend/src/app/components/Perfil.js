import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaIdCard, FaLock, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { actualizarUsuario, reset } from '../features/authSlice'; // Importamos la nueva acción
import { toast } from 'react-toastify';
import Spinner from './Spinner';

function Perfil() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // Estados locales para el formulario
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [password, setPassword] = useState(''); // Contraseña vacía inicialmente
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    if (isError) {
        toast.error(message);
        dispatch(reset()); // Limpiamos errores después de mostrar
    }

    if (isSuccess && message === 'Perfil actualizado correctamente') {
        toast.success('Perfil actualizado con éxito');
        setPassword(''); // Limpiamos el campo de contraseña
        dispatch(reset());
    }

  }, [user, navigate, isError, isSuccess, message, dispatch]);

  const onSubmit = (e) => {
      e.preventDefault();
      
      const userData = {
          nombre
      };

      // Solo enviamos la contraseña si el usuario escribió algo
      if (password) {
          userData.password = password;
      }

      dispatch(actualizarUsuario(userData));
  };

  if (isLoading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px', textAlign: 'left' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <FaUserCircle size={80} color="#fca311" />
            <h1 style={{ marginTop: '15px', fontSize: '2rem' }}>Mi Perfil</h1>
            <p style={{color: '#aaa', fontSize: '0.9rem'}}>Actualiza tu información personal</p>
        </div>

        <form onSubmit={onSubmit}>
            
            {/* CAMPO NOMBRE (EDITABLE) */}
            <div className="form-group">
                <label className="form-label" style={{color: '#fca311'}}>
                    <FaIdCard style={{marginRight: '8px'}}/> Nombre de Usuario
                </label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
            </div>

            {/* CAMPO CORREO (SOLO LECTURA) */}
            <div className="form-group">
                <label className="form-label" style={{color: '#666'}}> {/* Gris para indicar que no se toca */}
                    <FaEnvelope style={{marginRight: '8px'}}/> Correo Electrónico
                </label>
                <input 
                    type="email" 
                    className="form-control" 
                    value={user.email}
                    disabled // No permitimos cambiar email
                    style={{ background: 'rgba(0,0,0,0.3)', color: '#888', cursor: 'not-allowed', border: '1px solid #333' }}
                />
                <small style={{color: '#555', fontSize: '0.75rem'}}>El correo no se puede modificar.</small>
            </div>

            {/* CAMPO NUEVA CONTRASEÑA (OPCIONAL) */}
            <div className="form-group">
                <label className="form-label" style={{color: '#fca311'}}>
                    <FaLock style={{marginRight: '8px'}}/> Nueva Contraseña
                </label>
                <div style={{position: 'relative'}}>
                    <input 
                        type={showPassword ? "text" : "password"}
                        className="form-control" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Dejar vacío para mantener la actual"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'white', paddingRight: '40px' }}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', color: '#aaa', cursor: 'pointer'
                        }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            {/* BOTÓN GUARDAR */}
            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '20px'}}>
                <FaSave /> Guardar Cambios
            </button>

        </form>

        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <p style={{ color: '#a1a1aa', fontSize: '0.8rem', textAlign: 'center' }}>
                ID de Usuario: <span style={{ fontFamily: 'monospace', color: '#555' }}>{user._id}</span>
            </p>
        </div>

      </div>
    </div>
  );
}

export default Perfil;