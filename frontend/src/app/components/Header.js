import { FaSignInAlt, FaSignOutAlt, FaUser, FaTools, FaHome, FaClipboardList, FaHammer } from 'react-icons/fa'; // Agregamos FaHammer
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
              {/* 1. Dashboard Principal */}
              <li>
                  <Link to='/' className="btn-ghost" title="Ir al catálogo">
                      <FaHome /> <span className="nav-text">Catálogo</span>
                  </Link>
              </li>

              {/* 2. NUEVO: Mis Herramientas (Gestión) */}
              <li>
                  <Link to='/mis-herramientas' className="btn-ghost" title="Gestionar mis equipos">
                      <FaHammer /> <span className="nav-text">Mis Herramientas</span>
                  </Link>
              </li>

              {/* 3. Mis Rentas (Consumidor) */}
              <li>
                  <Link to='/mis-rentas' className="btn-ghost" title="Ver mis rentas">
                      <FaClipboardList /> <span className="nav-text">Mis Rentas</span>
                  </Link>
              </li>

              {/* 4. Mi Perfil */}
              <li>
                  <Link to='/mi-perfil' className="btn-ghost" title="Editar perfil">
                      <FaUser /> <span className="nav-text">Perfil</span>
                  </Link>
              </li>

              {/* 5. Salir */}
              <li>
                <button 
                  className='btn' 
                  onClick={onLogout} 
                  style={{
                    background: '#cf3e3e',
                    color: 'white', 
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
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