import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { crearRenta, reset as resetRenta } from '../features/rentaSlice';
import { obtenerHerramientas } from '../features/herramientasSlice';
import Spinner from './Spinner';
// ✅ Mantenemos los imports, ahora sí los usaremos todos
import { FaArrowLeft, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

function HerramientaDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { herramientas, isLoading: loadingTools } = useSelector((state) => state.herramientas);
  const { isSuccess, isError, message, isLoading: loadingRenta } = useSelector((state) => state.rentas);
  const { user } = useSelector((state) => state.auth);

  const [dias, setDias] = useState(1);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);

  const herramienta = herramientas.find((h) => h._id === id);

  useEffect(() => {
    if (!herramienta && !loadingTools) {
        dispatch(obtenerHerramientas());
    }

    if (isSuccess) {
        alert('¡Renta realizada con éxito!');
        dispatch(resetRenta());
        navigate('/mis-rentas');
    }

    if (isError) {
        alert(message);
        dispatch(resetRenta());
    }
  }, [herramienta, isSuccess, isError, message, navigate, dispatch, loadingTools]);

  const onRentar = () => {
      if (!user) {
          navigate('/login');
          return;
      }

      const precioTotal = herramienta.precio * dias;
      
      const fechaFinObj = new Date(fechaInicio);
      fechaFinObj.setDate(fechaFinObj.getDate() + parseInt(dias));
      
      const rentaData = {
          herramientaId: herramienta._id,
          fechaInicio: fechaInicio,
          fechaFin: fechaFinObj.toISOString(),
          precioTotal: precioTotal,
          dias: dias
      };

      dispatch(crearRenta(rentaData));
  };

  if (loadingTools || !herramienta) return <Spinner />;

  const precioTotal = herramienta.precio * dias;

  let src = herramienta.imagen;
  if (src && !src.startsWith('http')) {
      src = src.replace(/\\/g, '/');
      src = `http://penrose512.jcarlos19.com:8000/${src}`;
  }

  return (
    <div className="dashboard-container">
        <div className="container" style={{ maxWidth: '900px' }}> 
            <button className='btn-back' onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
                <FaArrowLeft /> Volver al Catálogo
            </button>

            <div className="detail-layout" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '40px',
                background: 'rgba(20, 20, 20, 0.8)',
                padding: '40px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* COLUMNA IZQUIERDA: FOTO */}
                <div style={{ textAlign: 'center' }}>
                    <img 
                        src={src} 
                        alt={herramienta.nombre} 
                        style={{ width: '100%', borderRadius: '15px', border: '1px solid #333', maxHeight: '400px', objectFit: 'cover' }} 
                    />
                </div>

                {/* COLUMNA DERECHA: INFO Y PAGO */}
                <div style={{ color: 'white' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{herramienta.nombre}</h1>
                    <p style={{ color: '#a1a1aa', marginBottom: '20px', fontSize: '1.1rem' }}>
                        {herramienta.descripcion || 'Sin descripción disponible.'}
                    </p>
                    
                    <div style={{ marginBottom: '30px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                        <p style={{ margin: 0, color: '#fca311', fontWeight: 'bold' }}>Marca: {herramienta.marca}</p>
                        <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>Publicado por: {herramienta.user?.nombre || 'Anónimo'}</p>
                    </div>

                    {/* FORMULARIO DE RENTA */}
                    <div className="rent-calculator" style={{ background: '#000', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
                        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
                            Configurar Renta
                        </h3>

                        <div style={{ marginBottom: '15px' }}>
                            {/* ✅ USO 1: Icono de Calendario en el label */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', color: '#aaa' }}>
                                <FaCalendarAlt /> Fecha de Inicio
                            </label>
                            <input 
                                type="date" 
                                className="form-control" 
                                value={fechaInicio}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Días de renta</label>
                            <select 
                                className="form-control" 
                                value={dias} 
                                onChange={(e) => setDias(Number(e.target.value))}
                            >
                                {[1,2,3,4,5,7,14,30].map(d => (
                                    <option key={d} value={d}>{d} día{d > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        {/* RESUMEN DE COSTO */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '1.2rem' }}>
                            {/* ✅ USO 2: Icono de Billete en el total */}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaMoneyBillWave color="#34d399"/> Total a Pagar:
                            </span>
                            <span style={{ color: '#fca311', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                ${precioTotal}
                            </span>
                        </div>

                        <button 
                            className="btn btn-block" 
                            onClick={onRentar}
                            disabled={loadingRenta}
                            style={{ background: '#fca311', color: '#000', fontWeight: 'bold' }}
                        >
                            {loadingRenta ? 'Procesando...' : <><FaCheckCircle /> Confirmar Renta</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default HerramientaDetalles;