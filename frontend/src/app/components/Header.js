import { 
    FaSignInAlt, 
    FaSignOutAlt, 
    FaUser, 
    FaHome, 
    FaClipboardList, 
    FaHammer, 
    FaUsers 
} from 'react-icons/fa';
// ✅ 1. Importamos useLocation para detectar la ruta
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/authSlice';
import logoImg from '../../assets/LogoSinFondo.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // ✅ 2. Iniciamos el hook de ubicación

  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  // ✅ 3. LÓGICA DE OCULTAMIENTO
  // Si estamos en login o registro, no mostramos nada (return null)
  const rutasOcultas = ['/login', '/register', '/registro'];
  if (rutasOcultas.includes(location.pathname)) {
      return null;
  }

  return (
    <header className='header'>
      <div className="logo">
        <Link to='/' style={{ display: 'flex', alignItems: 'center' }}>
            {/* LOGO IMAGEN */}
            <img 
                src={logoImg} 
                alt="Logo TaLadrando" 
                style={{ 
                    height: '60px', 
                    width: 'auto',
                    objectFit: 'contain' 
                }} 
            />
        </Link>
      </div>

      <nav>
        <ul style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            // === MENÚ DE USUARIO LOGUEADO ===
            <>
              {/* 1. Catálogo */}
              <li>
                  <Link to='/' className="btn-ghost" title="Ir al catálogo">
                      <FaHome /> <span className="nav-text">Catálogo</span>
                  </Link>
              </li>

              {/* 2. Mis Equipos */}
              <li>
                  <Link to='/mis-herramientas' className="btn-ghost" title="Gestionar mis equipos">
                      <FaHammer /> <span className="nav-text">Mis Equipos</span>
                  </Link>
              </li>

              {/* 3. Clientes */}
              <li>
                  <Link to='/clientes' className="btn-ghost" title="Ver quién tiene mis herramientas">
                      <FaUsers /> <span className="nav-text">Clientes</span>
                  </Link>
              </li>

              {/* 4. Mis Rentas */}
              <li>
                  <Link to='/mis-rentas' className="btn-ghost" title="Ver mis rentas activas">
                      <FaClipboardList /> <span className="nav-text">Mis Rentas</span>
                  </Link>
              </li>

              {/* 5. Perfil */}
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
                    width: '40px',
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