import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { obtenerMisRentas, reset } from '../features/rentaSlice';
import Spinner from './Spinner';
import { FaCalendarAlt } from 'react-icons/fa'; // ✅ CORREGIDO: Se quitó FaHammer que no se usaba

function MisRentas() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { rentas, isLoading, isError, message } = useSelector(
    (state) => state.rentas
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(obtenerMisRentas());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='Container'>
      <section className='heading'>
        <h1>Mis Rentas</h1>
        <p>Herramientas que tienes actualmente</p>
      </section>

      <section className='content'>
        {rentas.length > 0 ? (
          rentas.map((renta) => (
            <div key={renta._id} className='herramienta' style={{ borderLeft: '4px solid #eee21a' }}>
              {/* Fecha de Renta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaCalendarAlt /> 
                {new Date(renta.createdAt).toLocaleDateString('es-MX')}
              </div>

              {/* Título de la Herramienta (Protección por si se borró la herramienta original) */}
              <h2>{renta.herramienta?.nombre || 'Herramienta no disponible'}</h2>
              <p>Marca: {renta.herramienta?.marca}</p>

              <div className='precio-tag'>
                Estado: {renta.estado}
              </div>

              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                ID Renta: <span style={{ fontFamily: 'monospace' }}>{renta._id.substring(0, 10)}...</span>
              </p>
            </div>
          ))
        ) : (
          <h3 style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            No has rentado nada aún. ¡Ve al Dashboard a buscar equipos!
          </h3>
        )}
      </section>
    </div>
  );
}

export default MisRentas;