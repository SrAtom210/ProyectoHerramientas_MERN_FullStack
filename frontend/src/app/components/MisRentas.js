import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { obtenerMisRentas, cancelarRenta, reset } from '../features/rentaSlice';
import Spinner from './Spinner';
import { FaCalendarAlt, FaUndo, FaCheckCircle, FaTimesCircle, FaHammer } from 'react-icons/fa';

function MisRentas() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  if (isLoading) { return <Spinner />; }

  return (
    <div className='dashboard-container'>
      <div className='container'>
        <div className='dashboard-heading'>
            <h1 className='dashboard-title'>Mis Rentas <span style={{color: '#fca311'}}>.</span></h1>
            <p className='dashboard-subtitle'>Historial y estado de tus alquileres</p>
        </div>

        {rentas.length > 0 ? (
          <div className="rentas-stack" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {rentas.map((renta) => {
                // ========================================================
                // ⚠️ LÓGICA DE CÁLCULO DE FECHAS IMPLEMENTADA AQUÍ
                // ========================================================
                
                // 1. Fecha Inicio: Usamos fechaInicio si existe, si no, createdAt
                const fechaInicio = new Date(renta.fechaInicio || renta.createdAt);
                
                let fechaFin;

                // 2. ¿Existe fechaFin explícita en la BD?
                if (renta.fechaFin) {
                    fechaFin = new Date(renta.fechaFin);
                } else {
                    // 3. SI NO EXISTE: La calculamos (Inicio + Días)
                    // Buscamos si guardaste 'dias', 'diasRenta' o asumes 1 día por defecto
                    const diasDuracion = renta.dias || renta.diasRenta || 1; 
                    
                    // Clonamos la fecha de inicio para no modificarla
                    fechaFin = new Date(fechaInicio.getTime());
                    // Sumamos los días
                    fechaFin.setDate(fechaFin.getDate() + parseInt(diasDuracion));
                }

                // 4. Determinar si sigue activa comparando con HOY
                const hoy = new Date();
                const esActiva = hoy < fechaFin; 
                // ========================================================

                return (
                  <div key={renta._id} className="renta-ticket" 
                       style={{ 
                           display: 'flex',
                           flexWrap: 'wrap',
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           background: 'rgba(255, 255, 255, 0.03)',
                           border: `1px solid ${esActiva ? 'rgba(252, 163, 17, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                           borderRadius: '12px',
                           padding: '20px',
                           gap: '20px'
                       }}
                  >
                    {/* FOTO */}
                    <div style={{ flexShrink: 0 }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', background: '#000' }}>
                            {renta.herramienta ? (
                                <img 
                                    src={getImagenUrl(renta.herramienta)} 
                                    alt={renta.herramienta.nombre} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            ) : (
                                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <FaHammer color="#555"/>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* INFORMACIÓN */}
                    <div style={{ flexGrow: 1, minWidth: '200px' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#fff' }}>
                            {renta.herramienta ? renta.herramienta.nombre : 'Herramienta no disponible'}
                        </h3>
                        <p style={{ margin: '0 0 10px 0', color: '#a1a1aa', fontSize: '0.9rem' }}>
                            {renta.herramienta?.marca || 'Marca desconocida'}
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
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
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
                                    padding: '8px 16px', 
                                    fontSize: '0.9rem',
                                    background: 'transparent', 
                                    border: '1px solid #ee251a', 
                                    color: '#ee251a',
                                    marginTop: '5px'
                                }}
                            >
                                <FaUndo /> Devolver
                            </button>
                        )}
                        
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                            Total: <span style={{ color: '#fff', fontWeight: 'bold' }}>
                                ${renta.precioTotal || renta.monto || '0.00'}
                            </span>
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