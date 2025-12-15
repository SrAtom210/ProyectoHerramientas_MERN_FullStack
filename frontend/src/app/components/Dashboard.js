import { useEffect, useState } from 'react'; // ✅ Importamos useState
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

  // ✅ ESTADO PARA EL BUSCADOR
  const [busqueda, setBusqueda] = useState('');

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

  // ✅ FILTRO MEJORADO: Propiedad ajena + Coincidencia de búsqueda
  const catalogoDisponible = herramientas.filter(h => {
      // 1. Verificamos dueño (Safety check con ?.)
      const ownerId = h.user?._id || h.user; 
      const esAjeno = ownerId !== user?._id;

      // 2. Verificamos texto de búsqueda (Nombre o Marca)
      const textoBusqueda = busqueda.toLowerCase();
      const coincideNombre = h.nombre?.toLowerCase().includes(textoBusqueda);
      const coincideMarca = h.marca?.toLowerCase().includes(textoBusqueda);

      return esAjeno && (coincideNombre || coincideMarca);
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

        {/* ✅ BARRA DE BÚSQUEDA */}
        <div style={{ maxWidth: '500px', margin: '0 auto 30px auto', position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', top: '15px', left: '15px', color: '#666' }} />
            <input 
                type="text"
                placeholder="Buscar por nombre o marca (ej. Taladro, Bosch)..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '40px' }} // Espacio para el icono
            />
        </div>

        {catalogoDisponible.length > 0 ? (
            <div className="herramientas-grid">
                {catalogoDisponible.map((herramienta) => (
                    <HerramientaItem 
                        key={herramienta._id} 
                        herramienta={herramienta}
                    />
                ))}
            </div>
        ) : (
            <div style={{textAlign: 'center', marginTop: '50px', color: '#a1a1aa'}}>
                <FaSearch size={50} style={{marginBottom: '20px', opacity: 0.5}}/>
                {busqueda ? (
                    <>
                        <h3>No se encontraron resultados para "{busqueda}"</h3>
                        <p>Intenta con otra palabra clave.</p>
                    </>
                ) : (
                    <>
                        <h3>No hay herramientas disponibles para rentar.</h3>
                        <p>Sé el primero en publicar una.</p>
                    </>
                )}
            </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;