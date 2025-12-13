import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  // Simulación: Luego conectaremos esto con el estado real de Auth
  const user = null; 

  const onLogout = () => {
    console.log('Logout');
    navigate('/login');
  };

  return (
    <header style={estilos.header}>
      <div className="logo">
        <Link to="/" style={estilos.logoLink}>🛠️ RentaTools</Link>
      </div>
      <ul>
        {user ? (
          <li>
            <Link to="/mis-rentas" style={{ ...estilos.link, marginRight: '20px' }}>Mis Rentas</Link>
          </li>
          <li>
            <button onClick={onLogout} style={estilos.btn}>Logout</button>
          </li>
        ) : (
          <>
            <li style={estilos.li}>
              <Link to="/login" style={estilos.link}>Login</Link>
            </li>
            <li style={estilos.li}>
              <Link to="/register" style={estilos.link}>Registrar</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

// Estilos rápidos en línea para no perder tiempo en CSS ahora
const estilos = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#333', color: '#fff' },
  logoLink: { color: '#fff', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' },
  li: { display: 'inline', marginLeft: '20px' },
  link: { color: '#fff', textDecoration: 'none' },
  btn: { cursor: 'pointer', background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }
}

export default Header;