import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Importamos hooks de Redux
import { FaHammer, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

// Importamos la acción que acabamos de crear
import { obtenerUnaHerramienta, reset } from '../../features/herramientasSlice';
// (Descomenta cuando tengas el slice de rentas)
// import { crearRenta } from '../features/rentas/rentaSlice';

function HerramientaDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Obtenemos el estado desde Redux
  const { herramientaActiva, isLoading, isError, message } = useSelector(
    (state) => state.herramientas // Asegúrate que en tu store se llame 'herramientas' o 'herramienta'
  );

  const [fechas, setFechas] = useState({ fechaInicio: '', fechaFin: '' });
  const [total, setTotal] = useState(0);
  const [dias, setDias] = useState(0);

  // 2. Pedimos los datos al cargar la página
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(obtenerUnaHerramienta(id));

    // Limpieza al salir
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, id]);


  // 3. Calcular precio (Solo si existe herramientaActiva)
  useEffect(() => {
    if (herramientaActiva && fechas.fechaInicio && fechas.fechaFin) {
      const inicio = new Date(fechas.fechaInicio);
      const fin = new Date(fechas.fechaFin);
      const diffTime = Math.abs(fin - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if(diffDays > 0) {
        setDias(diffDays);
        setTotal(diffDays * herramientaActiva.precio);
      } else {
        setDias(0); setTotal(0);
      }
    }
  }, [fechas, herramientaActiva]);

  const onChange = (e) => {
    setFechas((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (total <= 0) {
      toast.error('Selecciona un rango de fechas válido');
      return;
    }
    // dispatch(crearRenta({ herramientaId: id, ...fechas }));
    toast.success('¡Renta procesada con éxito!');
    navigate('/mis-rentas');
  };

  if (isLoading) return <Spinner />;
  
  // Si no cargó nada aún, no mostramos el error feo, retornamos null o mensaje
  if (!herramientaActiva) return <div className='container' style={{color:'white', marginTop:'50px'}}>Herramienta no encontrada...</div>;

  return (
    <div className="dashboard-container">
      <div className="container">
        
        <button className="btn-back" onClick={() => navigate('/')}>
          <FaArrowLeft /> Regresar al Catálogo
        </button>

        <div className="detail-layout">
          
          {/* COLUMNA 1: VISUAL (Imagen Real) */}
          <div className="detail-visual">
            <div className="visual-glow"></div> 
            {herramientaActiva.imagen ? (
                <img src={herramientaActiva.imagen} alt={herramientaActiva.nombre} className="detail-image" />
            ) : (
                <FaHammer size={100} color="rgba(255,255,255,0.2)" />
            )}
            <div className="visual-badges">
                <span className="badge-tech">{herramientaActiva.marca || 'Genérica'}</span>
                <span className="badge-status available"><FaCheckCircle/> Disponible</span>
            </div>
          </div>

          {/* COLUMNA 2: PANEL DE CONTROL */}
          <div className="detail-panel">
            <div className="panel-header">
                <h1 className="detail-title">{herramientaActiva.nombre}</h1>
                <div className="detail-price">
                    ${herramientaActiva.precio} <small>/día</small>
                </div>
            </div>
            
            <p className="detail-desc">{herramientaActiva.descripcion}</p>

            <form onSubmit={onSubmit} className="rent-calculator">
                <h3 className="calc-title"><FaCalendarAlt /> Configurar Renta</h3>
                
                <div className="date-grid">
                    <div className="form-group">
                        <label className="form-label">Desde</label>
                        <input 
                            type="date" name="fechaInicio" 
                            className="form-input dark-input" 
                            onChange={onChange} required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Hasta</label>
                        <input 
                            type="date" name="fechaFin" 
                            className="form-input dark-input" 
                            onChange={onChange} required 
                        />
                    </div>
                </div>

                <div className="cost-summary">
                    <div className="row">
                        <span>Duración:</span>
                        <span>{dias} días</span>
                    </div>
                    <div className="row total">
                        <span>Total estimado:</span>
                        <span className="neon-text">${total} MXN</span>
                    </div>
                </div>

                <button type="submit" className="btn-block btn-neon">
                    Confirmar Renta <FaMoneyBillWave />
                </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HerramientaDetalles;