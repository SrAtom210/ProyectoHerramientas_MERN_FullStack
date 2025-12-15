import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaIdCard } from 'react-icons/fa';

function Perfil() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px', textAlign: 'left' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <FaUserCircle size={80} color="#fca311" />
            <h1 style={{ marginTop: '15px', fontSize: '2rem' }}>Mi Perfil</h1>
        </div>

        <div className="form-group">
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', color: '#fca311'}}>
                <FaIdCard /> Nombre de Usuario
            </label>
            <div className="form-control" style={{ background: 'rgba(255,255,255,0.05)', border: 'none' }}>
                {user.nombre}
            </div>
        </div>

        <div className="form-group">
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', color: '#fca311'}}>
                <FaEnvelope /> Correo Electrónico
            </label>
            <div className="form-control" style={{ background: 'rgba(255,255,255,0.05)', border: 'none' }}>
                {user.email}
            </div>
        </div>

        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', textAlign: 'center' }}>
                ID de Usuario: <span style={{ fontFamily: 'monospace' }}>{user._id}</span>
            </p>
        </div>

      </div>
    </div>
  );
}

export default Perfil;