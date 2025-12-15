import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { obtenerClientes, reset } from '../features/rentaSlice';
import Spinner from './Spinner';
import { FaUser, FaCalendarCheck, FaHammer, FaMoneyBillWave } from 'react-icons/fa';

function MisClientes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { clientes, isLoading, isError, message } = useSelector((state) => state.rentas);

  useEffect(() => {
    if (isError) console.log(message);
    if (!user) navigate('/login');
    else dispatch(obtenerClientes());

    return () => { dispatch(reset()); };
  }, [user, navigate, isError, message, dispatch]);

  const getImagenUrl = (herramienta) => {
      if (!herramienta || !herramienta.imagen) return null;
      let src = herramienta.imagen;
      if (!src.startsWith('http')) {
          src = src.replace(/\\/g, '/');
          src = `http://penrose512.jcarlos19.com:8000/${src}`;
      }
      return src;
  };

  if (isLoading) return <Spinner />;

  return (
    <div className='dashboard-container'>
      <div className='container'>
        <div className='dashboard-heading'>
            <h1 className='dashboard-title'>Mis Clientes <span style={{color: '#34d399'}}>.</span></h1>
            <p className='dashboard-subtitle'>Usuarios que están rentando tus herramientas actualmente</p>
        </div>

        {clientes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {clientes.map((renta) => {
                // Cálculo de fechas
                const fechaInicio = new Date(renta.fechaInicio || renta.createdAt);
                const dias = renta.dias || renta.diasRenta || 1;
                const fechaFin = renta.fechaFin ? new Date(renta.fechaFin) : new Date(fechaInicio.getTime() + (dias * 24*60*60*1000));
                const hoy = new Date();
                const esActiva = hoy < fechaFin;

                return (
                  <div key={renta._id} className="renta-ticket" 
                       style={{ 
                           display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px',
                           background: 'rgba(255, 255, 255, 0.03)',
                           border: `1px solid ${esActiva ? '#34d399' : '#555'}`, // Verde si está activa
                           borderRadius: '12px', padding: '20px'
                       }}
                  >
                    {/* FOTO */}
                    <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', background: '#000' }}>
                        {renta.herramienta ? (
                            <img src={getImagenUrl(renta.herramienta)} alt="Tool" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : <FaHammer />}
                    </div>

                    {/* DATOS DEL CLIENTE Y HERRAMIENTA */}
                    <div style={{ flexGrow: 1 }}>
                        <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>
                            {renta.herramienta?.nombre || 'Herramienta borrada'}
                        </h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca311', marginBottom: '8px' }}>
                            <FaUser /> 
                            <span style={{ fontWeight: 'bold' }}>Cliente: {renta.user?.nombre || 'Usuario desconocido'}</span>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                             <FaCalendarCheck style={{ marginRight: '5px' }}/> 
                             Devolución esperada: {fechaFin.toLocaleDateString('es-MX')}
                        </div>
                    </div>

                    {/* ESTADO FINANCIERO */}
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                            padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                            background: esActiva ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            color: esActiva ? '#34d399' : '#aaa', marginBottom: '8px', display: 'inline-block'
                        }}>
                            {esActiva ? 'En uso' : 'Finalizado'}
                        </div>
                        <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            <FaMoneyBillWave style={{ color: '#34d399', marginRight: '5px' }}/>
                            +${renta.precioTotal || renta.monto}
                        </div>
                    </div>
                  </div>
                );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#a1a1aa' }}>
            <h3>Aún no tienes clientes</h3>
            <p>Asegúrate de tener herramientas publicadas a buen precio.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MisClientes;