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
      // Obtenemos todas y filtramos en el renderizado
      // (Idealmente el backend tendría un endpoint /mis-herramientas, pero esto funciona)
      dispatch(obtenerHerramientas());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  // Filtramos: Solo las herramientas donde el ID del dueño coincide con el ID del usuario actual
  // Nota: Dependiendo de tu backend, 'h.user' puede ser un ID (string) o un objeto. 
  // Usamos h.user._id || h.user para cubrir ambos casos.
  const misTools = herramientas.filter(h => {
      const toolUserId = h.user._id || h.user; 
      return toolUserId === user?._id;
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="dashboard-container">
        <section className="container">
            <div className="dashboard-heading">
                <h1 className="dashboard-title">
                    Mis Herramientas <span style={{color: '#fca311'}}>.</span>
                </h1>
                <p className="dashboard-subtitle">
                    Gestiona tu inventario
                </p>
            </div>

            {/* ✅ NUEVO BOTÓN DE PUBLICAR */}
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
                            // Aquí podrías pasarle funciones para editar si quieres
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