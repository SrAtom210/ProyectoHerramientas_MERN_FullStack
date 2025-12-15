import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HerramientaItem from './HerramientaItem';
import Spinner from './Spinner';
import { reset, obtenerHerramientas } from '../features/herramientasSlice';
import { FaSearch } from 'react-icons/fa';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { herramientas, isLoading, isError, message } = useSelector(
    (state) => state.herramientas
  );

  useEffect(() => {
    if (isError) console.log(message);

    if (!user) {
      navigate('/login');
    } else {
      dispatch(obtenerHerramientas());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  // ✅ FILTRO: Mostrar solo herramientas que NO son mías
  const catalogoDisponible = herramientas.filter(h => {
      const ownerId = h.user._id || h.user; // Manejo por si viene populado o solo ID
      return ownerId !== user?._id;
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="dashboard-container">
      <section className="container">
        
        <div className="dashboard-heading">
            <h1 className="dashboard-title">
                Catálogo Disponible <span style={{color: '#fca311'}}>.</span>
            </h1>
            <p className="dashboard-subtitle">
                Explora y renta equipos de otros usuarios cercanos a ti.
            </p>
        </div>

        {/* YA NO ESTÁ EL FORMULARIO AQUÍ */}

        {catalogoDisponible.length > 0 ? (
            <div className="herramientas-grid">
                {catalogoDisponible.map((herramienta) => (
                    <HerramientaItem 
                        key={herramienta._id} 
                        herramienta={herramienta}
                        // activarEdicion={activarEdicion} // Ya no editamos desde el catálogo público
                    />
                ))}
            </div>
        ) : (
            <div style={{textAlign: 'center', marginTop: '50px', color: '#a1a1aa'}}>
                <FaSearch size={50} style={{marginBottom: '20px', opacity: 0.5}}/>
                <h3>No hay herramientas disponibles para rentar.</h3>
                <p>Sé el primero en publicar una.</p>
            </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;