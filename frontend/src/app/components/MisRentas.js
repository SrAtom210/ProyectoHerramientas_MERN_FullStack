import { useEffect, useState } from 'react'; // ✅ Importamos useState
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { obtenerMisRentas, cancelarRenta, reset } from '../features/rentaSlice';
import Spinner from './Spinner';
import { 
    FaCalendarAlt, 
    FaUndo, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaHammer, 
    FaExclamationTriangle//,
    //FaInfoCircle
} from 'react-icons/fa';

function MisRentas() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Estado para controlar el Popup de consecuencias
  const [mostrarAviso, setMostrarAviso] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { rentas, isLoading, isError, message } = useSelector(
    (state) => state.rentas
  );

  useEffect(() => {
    if (isError) { console.log(message); }
    if (!user) { navigate('/login'); } 
    else { dispatch(obtenerMisRentas()); }
    return () => { dispatch(reset()); };
  }, [user, navigate, isError, message, dispatch]);

  const handleDevolver = (id) => {
      if(window.confirm('¿Confirmas que deseas devolver el equipo y finalizar la renta?')) {
          dispatch(cancelarRenta(id));
      }
  };

  const getImagenUrl = (herramienta) => {
      if (!herramienta || !herramienta.imagen) return null;
      let src = herramienta.imagen;
      if (!src.startsWith('http')) {
          src = src.replace(/\\/g, '/');
          src = `http://penrose512.jcarlos19.com:8000/${src}`;
      }
      return src;
  };

  // ✅ Componente del Popup (Modal)
  const ModalConsecuencias = () => (
      <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(5px)'
      }}>
          <div style={{
              background: '#1a1a1a', padding: '30px', borderRadius: '15px',
              border: '1px solid #fca311', maxWidth: '500px', width: '90%',
              boxShadow: '0 0 20px rgba(252, 163, 17, 0.3)', textAlign: 'center'
          }}>
              <FaExclamationTriangle size={50} color="#fca311" style={{marginBottom: '15px'}}/>
              <h2 style={{color: '#fff', marginBottom: '15px'}}>¡Atención! Evita sanciones</h2>
              <p style={{color: '#ccc', marginBottom: '20px'}}>
                  Tienes rentas próximas a vencer. Si no devuelves la herramienta a tiempo:
              </p>
              <ul style={{textAlign: 'left', color: '#a1a1aa', marginBottom: '25px', listStyle: 'none', padding: 0}}>
                  <li style={{marginBottom: '10px'}}>• Se te <b>cobrará</b> el <b>doble</b> <b>por</b> cada <b>día de retraso.</b></li>
                  <li style={{marginBottom: '10px'}}>• Tu <b>cuenta</b> podría ser <b>bloqueada temporalmente.</b></li>
                  <li style={{marginBottom: '10px'}}>• Se te <b>retendra</b> el <b>ingreso</b> de tus <b>rentas.</b></li>
              </ul>
              <button 
                  className="btn" 
                  onClick={() => setMostrarAviso(false)}
                  style={{background: '#fca311', color: '#000', width: '100%', fontWeight: 'bold'}}
              >
                  Entendido, devolveré a tiempo
              </button>
          </div>
      </div>
  );

  if (isLoading) { return <Spinner />; }

  return (
    <div className='dashboard-container'>
      <div className='container'>
        <div className='dashboard-heading'>
            <h1 className='dashboard-title'>Mis Rentas <span style={{color: '#fca311'}}>.</span></h1>
            <p className='dashboard-subtitle'>Historial y estado de tus alquileres</p>
        </div>

        {/* ✅ Renderizar el Modal si está activo */}
        {mostrarAviso && <ModalConsecuencias />}

        {rentas.length > 0 ? (
          <div className="rentas-stack" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {rentas.map((renta) => {
                const fechaInicio = new Date(renta.fechaInicio || renta.createdAt);
                
                let fechaFin;
                if (renta.fechaFin) {
                    fechaFin = new Date(renta.fechaFin);
                } else {
                    const diasDuracion = renta.dias || renta.diasRenta || 1; 
                    fechaFin = new Date(fechaInicio.getTime());
                    fechaFin.setDate(fechaFin.getDate() + parseInt(diasDuracion));
                }

                const hoy = new Date();
                const esActiva = hoy < fechaFin; 
                const herramientaExiste = !!renta.herramienta;

                // ✅ CÁLCULO DE DÍAS RESTANTES
                // Convertimos milisegundos a días
                const diferenciaTiempo = fechaFin.getTime() - hoy.getTime();
                const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
                
                // Es urgente si es activa y queda 1 día o menos (pero no negativo, porque eso ya venció)
                const esUrgente = esActiva && diasRestantes <= 1 && diasRestantes >= 0;

                return (
                  <div key={renta._id} className="renta-ticket" 
                       style={{ 
                           display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
                           background: 'rgba(255, 255, 255, 0.03)',
                           // Si es urgente, ponemos un borde amarillo sutil
                           border: `1px solid ${esUrgente ? '#fca311' : (esActiva ? '#34d399' : 'rgba(255, 255, 255, 0.1)')}`,
                           borderRadius: '12px', padding: '20px', gap: '20px', position: 'relative'
                       }}
                  >
                    {/* FOTO */}
                    <div style={{ flexShrink: 0 }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {herramientaExiste ? (
                                <img src={getImagenUrl(renta.herramienta)} alt="Tool" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : <FaExclamationTriangle color="#cf3e3e" size={24}/>}
                        </div>
                    </div>

                    {/* INFORMACIÓN */}
                    <div style={{ flexGrow: 1, minWidth: '200px' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: herramientaExiste ? '#fff' : '#aaa' }}>
                            {herramientaExiste ? renta.herramienta.nombre : 'Herramienta Eliminada'}
                        </h3>
                        
                        {/* ✅ AVISO DE URGENCIA CLICKEABLE */}
                        {esUrgente && (
                            <div 
                                onClick={() => setMostrarAviso(true)}
                                style={{ 
                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                    color: '#fca311', background: 'rgba(252, 163, 17, 0.15)',
                                    padding: '4px 10px', borderRadius: '5px', fontSize: '0.85rem',
                                    marginBottom: '8px', cursor: 'pointer', border: '1px solid rgba(252, 163, 17, 0.3)'
                                }}
                                title="Ver consecuencias"
                            >
                                <FaExclamationTriangle /> ¡Vence pronto! Ver detalles
                            </div>
                        )}

                        <p style={{ margin: '0 0 10px 0', color: '#a1a1aa', fontSize: '0.9rem' }}>
                            {herramientaExiste ? renta.herramienta.marca : 'Retirado'}
                        </p>

                        <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#ccc' }}>
                             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                 <FaCalendarAlt color="#fca311"/> 
                                 Inicio: {fechaInicio.toLocaleDateString('es-MX')}
                             </span>
                             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                 <FaCalendarAlt color={esActiva ? '#fca311' : '#666'}/> 
                                 Fin: {fechaFin.toLocaleDateString('es-MX')}
                             </span>
                        </div>
                    </div>

                    {/* ESTADO Y BOTONES */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{
                            padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                            background: esActiva ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                            color: esActiva ? '#34d399' : '#71717a',
                            display: 'inline-flex', alignItems: 'center', gap: '6px'
                        }}>
                            {esActiva ? <><FaCheckCircle/> Activa</> : <><FaTimesCircle/> Finalizada</>}
                        </div>

                        {esActiva && (
                            <button 
                                onClick={() => handleDevolver(renta._id)}
                                className="btn"
                                style={{ 
                                    padding: '8px 16px', fontSize: '0.9rem',
                                    background: 'transparent', border: '1px solid #ee251a', color: '#ee251a', marginTop: '5px'
                                }}
                            >
                                <FaUndo /> Devolver
                            </button>
                        )}
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                            Total: <span style={{ color: '#fff', fontWeight: 'bold' }}>${renta.precioTotal || renta.monto || '0.00'}</span>
                        </div>
                    </div>
                  </div>
                );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '60px', color: '#a1a1aa' }}>
            <FaHammer size={50} style={{ marginBottom: '20px', opacity: 0.3 }} />
            <h3>No tienes rentas activas</h3>
            <p>Ve al catálogo para rentar tu primera herramienta.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MisRentas;