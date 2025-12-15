import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HerramientaItem from './HerramientaItem';
import Spinner from './Spinner';
import { obtenerHerramientas, reset } from '../features/herramientasSlice';
import { FaPlus, FaHammer } from 'react-icons/fa';

function MisHerramientas() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { herramientas, isLoading, isError, message } = useSelector(
    (state) => state.herramientas
  );

  useEffect(() => {
    if (isError) { console.log(message); }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(obtenerHerramientas());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  // ✅ CORRECCIÓN DE SEGURIDAD AQUÍ:
  // Usamos el operador '?.' (optional chaining)
  // Si h.user es null, 'toolUserId' será undefined y no romperá la página.
  const misTools = herramientas.filter(h => {
      const toolUserId = h.user?._id || h.user; 
      return toolUserId === user?._id;
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="dashboard-container">
        <section className="container">
            <div className="dashboard-heading">
                <h1 className="dashboard-title">
                    Mis Equipos <span style={{color: '#fca311'}}>.</span>
                </h1>
                <p className="dashboard-subtitle">
                    Gestiona tu inventario
                </p>
            </div>

            {/* BOTÓN DE PUBLICAR */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <button 
                    className='btn' 
                    style={{ maxWidth: '300px', background: '#fca311', color: '#000' }}
                    onClick={() => navigate('/crear-herramienta')}
                >
                    <FaPlus /> Publicar nuevo equipo
                </button>
            </div>

            {misTools.length > 0 ? (
                <div className="herramientas-grid">
                    {misTools.map((herramienta) => (
                        <HerramientaItem 
                            key={herramienta._id} 
                            herramienta={herramienta} 
                        />
                    ))}
                </div>
            ) : (
                <div style={{textAlign: 'center', marginTop: '30px', color: '#a1a1aa'}}>
                    <FaHammer size={50} style={{marginBottom: '20px', opacity: 0.5}}/>
                    <h3>No tienes equipos publicados.</h3>
                    <p>¡Dale click al botón de arriba para empezar a ganar dinero!</p>
                </div>
            )}
        </section>
    </div>
  );
}

export default MisHerramientas;