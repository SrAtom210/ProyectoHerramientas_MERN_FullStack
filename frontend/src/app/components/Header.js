import { 
    FaSignInAlt, 
    FaSignOutAlt, 
    FaUser, 
    FaTools, 
    FaHome, 
    FaClipboardList, 
    FaHammer, 
    FaUsers // ✅ Nuevo icono para Clientes
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  if (!user) {
    return null; 
  }

  return (
    <header className='header'>
      <div className="logo">
        <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <FaTools size={24} style={{color: '#fca311'}}/> 
            TaLadrando
        </Link>
      </div>

      <nav>
        <ul style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            // === MENÚ DE USUARIO LOGUEADO ===
            <>
              {/* 1. Dashboard Principal (Catálogo) */}
              <li>
                  <Link to='/' className="btn-ghost" title="Ir al catálogo">
                      <FaHome /> <span className="nav-text">Catálogo</span>
                  </Link>
              </li>

              {/* 2. Mis Herramientas (Gestión de Inventario) */}
              <li>
                  <Link to='/mis-herramientas' className="btn-ghost" title="Gestionar mis equipos">
                      <FaHammer /> <span className="nav-text">Mis Equipos</span>
                  </Link>
              </li>

              {/* 3. ✅ NUEVO: Mis Clientes (Marketplace - Quién me renta) */}
              <li>
                  <Link to='/clientes' className="btn-ghost" title="Ver quién tiene mis herramientas">
                      <FaUsers /> <span className="nav-text">Clientes</span>
                  </Link>
              </li>

              {/* 4. Mis Rentas (Consumidor - Lo que yo debo) */}
              <li>
                  <Link to='/mis-rentas' className="btn-ghost" title="Ver mis rentas activas">
                      <FaClipboardList /> <span className="nav-text">Mis Rentas</span>
                  </Link>
              </li>

              {/* 5. Mi Perfil */}
              <li>
                  <Link to='/mi-perfil' className="btn-ghost" title="Ver mi perfil">
                      <FaUser /> <span className="nav-text">Perfil</span>
                  </Link>
              </li>

              {/* 6. Salir */}
              <li>
                <button 
                  className='btn' 
                  onClick={onLogout} 
                  title="Cerrar Sesión"
                  style={{
                    background: 'rgba(238, 37, 26, 0.15)',
                    color: '#ee251a', 
                    border: '1px solid rgba(238, 37, 26, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px', // Hacemos el botón cuadrado y compacto
                    padding: '0'
                  }}
                >
                  <FaSignOutAlt />
                </button>
              </li>
            </>
          ) : (
            // === MENÚ DE VISITANTE ===
            <>
              <li>
                <Link to='/login' className="btn-ghost">
                  <FaSignInAlt /> Ingresar
                </Link>
              </li>
              <li>
                <Link to='/register' className="btn" style={{background: '#fca311', color: '#000'}}>
                  <FaUser /> Registrar
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;