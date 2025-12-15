import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HerramientaForm from './HerramientaForm';
import Spinner from './Spinner'; // ✅ Importamos el Spinner
import { obtenerHerramientas } from '../features/herramientasSlice'; // ✅ Necesario para recargar datos
import { FaArrowLeft } from 'react-icons/fa';

function EditarHerramienta() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // 1. Obtenemos todo el estado, incluyendo isLoading
  const { herramientas, isLoading } = useSelector((state) => state.herramientas);

  // 2. Intentamos buscar la herramienta
  const herramientaAEditar = herramientas.find((h) => h._id === id);

  useEffect(() => {
    // 3. Lógica de recarga:
    // Si NO estamos cargando y la lista de herramientas está vacía (o no encontramos la nuestra),
    // disparamos la acción para traerlas del backend.
    if (!herramientaAEditar && !isLoading) {
        dispatch(obtenerHerramientas());
    }
  }, [herramientaAEditar, isLoading, dispatch]);

  const alTerminar = () => {
      navigate('/mis-herramientas');
  };

  // 4. Si está cargando, mostramos Spinner
  if (isLoading) {
      return <Spinner />;
  }

  // 5. Si ya terminó de cargar y AÚN ASÍ no existe la herramienta, redirigimos o mostramos error
  // (Esto pasa si el ID de la URL es falso)
  if (!herramientaAEditar && !isLoading && herramientas.length > 0) {
      return (
        <div className="container" style={{textAlign: 'center', marginTop: '50px'}}>
            <h2>Herramienta no encontrada</h2>
            <button className="btn" onClick={() => navigate('/mis-herramientas')}>Volver</button>
        </div>
      );
  }

  // Si no hay herramienta y la lista está vacía (carga inicial), retornamos null mientras el useEffect dispara la carga
  if (!herramientaAEditar) return <Spinner />; 

  return (
    <div className="dashboard-container">
        <div className="container">
            <button 
                className='btn-ghost' 
                onClick={() => navigate('/mis-herramientas')}
                style={{ marginBottom: '20px' }}
            >
                <FaArrowLeft /> Cancelar y Volver
            </button>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 className="dashboard-title">Editar Equipo</h1>
                    <p className="dashboard-subtitle">Modificando: <span style={{color: '#fca311'}}>{herramientaAEditar.nombre}</span></p>
                </div>

                {/* Pasamos la herramienta encontrada al formulario */}
                <HerramientaForm 
                    herramientaEditar={herramientaAEditar} 
                    alTerminar={alTerminar} 
                />
            </div>
        </div>
    </div>
  );
}

export default EditarHerramienta;