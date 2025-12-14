import { FaSignInAlt, FaSignOutAlt, FaUser, FaClipboardList, FaHammer } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
//import { logout, reset } from '../features/authSlice'; // Asegúrate que la ruta sea correcta (features/merkmale)
import { logout, reset } from '../features/authSlice';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    // Ocultar Header en Login y Registro
    if (location.pathname === '/login' || location.pathname === '/registro') {
        return null;
    }

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <header className='header'>
            <div className='logo'>
                <Link to='/'>
                    {/* Icono del Martillo y Texto */}
                    <FaHammer size={24} /> RentaTools
                </Link>
            </div>
            <ul>
                {user ? (
                    <>
                        <li>
                            <Link to='/mis-rentas'>
                                <FaClipboardList /> Mis Rentas
                            </Link>
                        </li>
                        <li>
                            {/* CAMBIO CLAVE: Usamos 'btn' para que el CSS (.header .btn) lo detecte */}
                            <button className='btn' onClick={onLogout}>
                                <FaSignOutAlt /> Salir
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to='/login'>
                                <FaSignInAlt /> Ingresar
                            </Link>
                        </li>
                        <li>
                            <Link to='/registro'>
                                <FaUser /> Registrarse
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </header>
    );
}

export default Header;