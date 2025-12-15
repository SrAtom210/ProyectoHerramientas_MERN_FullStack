import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHammer, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import { obtenerUnaHerramienta, reset } from '../features/herramientasSlice';
import { crearRenta } from '../features/rentaSlice';

function HerramientaDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { herramientaActiva, isLoading, isError, message } = useSelector(
    (state) => state.herramientas
  );

  const [fechas, setFechas] = useState({ fechaInicio: '', fechaFin: '' });
  const [total, setTotal] = useState(0);
  const [dias, setDias] = useState(0);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(obtenerUnaHerramienta(id));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, id]);

  useEffect(() => {
    if (herramientaActiva && fechas.fechaInicio && fechas.fechaFin) {
      const inicio = new Date(fechas.fechaInicio);
      const fin = new Date(fechas.fechaFin);

      if (fin < inicio) {
        setDias(0); setTotal(0);
        return;
      }
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
      toast.error('Selecciona fechas válidas');
      return;
    }
    const rentData = {
      herramientaId: id,
      fechaInicio: fechas.fechaInicio,
      fechaFin: fechas.fechaFin,
      costoCalculado: total
    };
    dispatch(crearRenta(rentData))
      .unwrap()
      .then(() => {
        toast.success(`¡Renta exitosa por $${total}!`);
        navigate('/mis-rentas');
      })
      .catch((error) => toast.error(error));
  };

  if (isLoading) return <Spinner />;
  if (!herramientaActiva) return <div className='container' style={{color:'white', marginTop:'50px', textAlign:'center'}}>Cargando...</div>;

  // CORRECCIÓN: Usamos 'foto' aquí
  const imagenMostrar = herramientaActiva.foto && herramientaActiva.foto !== 'https://via.placeholder.com/150' 
    ? herramientaActiva.foto 
    : null;

  return (
    <div className="dashboard-container">
      <div className="Container">
        <button className="btn" style={{width: 'auto', marginBottom: '20px', background: 'transparent', border: '1px solid #333'}} onClick={() => navigate('/')}>
          <FaArrowLeft /> Regresar
        </button>

        <div className="detail-layout">
          <div className="detail-visual">
            {imagenMostrar ? (
                <img src={imagenMostrar} alt={herramientaActiva.nombre} className="detail-image" />
            ) : (
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'300px', background:'rgba(255,255,255,0.05)', borderRadius:'16px'}}>
                    <FaHammer size={100} color="rgba(255,255,255,0.2)" />
                </div>
            )}
            <div className="visual-badges">
                <span className="badge-tech" style={{marginRight:'10px', padding:'5px 10px', background:'#333', borderRadius:'20px', fontSize:'0.8rem'}}>{herramientaActiva.marca}</span>
                <span className="badge-status available" style={{color:'#4ade80'}}><FaCheckCircle/> {herramientaActiva.estado}</span>
            </div>
          </div>

          <div className="detail-panel">
            <h1 className="detail-title" style={{fontSize:'2.5rem'}}>{herramientaActiva.nombre}</h1>
            <div className="detail-price">
                <span style={{color:'var(--brand-yellow)', fontSize:'1.5rem'}}>${herramientaActiva.precio}</span> <small>/día</small>
            </div>
            <p className="detail-desc" style={{margin:'20px 0', color:'#ccc'}}>{herramientaActiva.descripcion}</p>

            <form onSubmit={onSubmit} className="rent-calculator" style={{background:'rgba(255,255,255,0.05)', padding:'20px', borderRadius:'16px'}}>
                <h3 className="calc-title" style={{marginBottom:'15px'}}><FaCalendarAlt /> Configurar Renta</h3>
                <div className="date-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px'}}>
                    <div className="form-group">
                        <label>Desde</label>
                        <input type="date" name="fechaInicio" className="form-control" onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label>Hasta</label>
                        <input type="date" name="fechaFin" className="form-control" onChange={onChange} required />
                    </div>
                </div>
                <div className="cost-summary" style={{borderTop:'1px solid #333', paddingTop:'15px', marginBottom:'20px'}}>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span>Total estimado:</span>
                        <span className="neon-text" style={{color:'var(--brand-red)', fontWeight:'bold'}}>${total} MXN</span>
                    </div>
                </div>
                <button type="submit" className="btn btn-block">Confirmar Renta <FaMoneyBillWave /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HerramientaDetalles;