import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { borrarHerramienta } from '../features/herramientasSlice'; 
// ✅ Agregamos FaBan para el icono de prohibido/ocupado
import { FaTrash, FaShoppingCart, FaHammer, FaEdit, FaBan } from 'react-icons/fa';

function HerramientaItem({ herramienta }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const herramientaUserId = herramienta.user?._id || herramienta.user;
  const esMio = user && herramientaUserId === user._id;
  
  // ✅ Detectamos si está rentada (viene del backend)
  const estaRentada = herramienta.rentada; 

  const irADetalles = () => {
    navigate(`/herramienta/${herramienta._id}`);
  };

  const irAEditar = () => {
    navigate(`/editar-herramienta/${herramienta._id}`);
  };

  const confirmarBorrar = () => {
    if(window.confirm('¿Estás seguro de que quieres eliminar esta herramienta? Esta acción no se puede deshacer.')) {
        dispatch(borrarHerramienta(herramienta._id));
    }
  };

  const renderImagen = () => {
    if (!herramienta.imagen) {
        return (
            <div className="img-placeholder">
                <FaHammer size={40} color="rgba(255,255,255,0.2)" />
            </div>
        );
    }
    let src = herramienta.imagen;
    if (!src.startsWith('http')) {
        src = src.replace(/\\/g, '/');
        src = `http://penrose512.jcarlos19.com:8000/${src}`;
    }
    return <img src={src} alt={herramienta.nombre} className="card-img" style={{opacity: estaRentada ? 0.6 : 1}} />;
  };

  return (
    <div className='herramienta' style={{ position: 'relative' }}>
      
      {/* ✅ BADGE VISUAL: Si está rentada, mostramos etiqueta roja */}
      {estaRentada && (
          <div style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              backgroundColor: '#cf3e3e',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
          }}>
              OCUPADO
          </div>
      )}

      {renderImagen()}

      <div className="card-date">
         {new Date(herramienta.createdAt).toLocaleDateString('es-MX')}
      </div>
      
      <h2 style={{ color: estaRentada ? '#777' : 'white' }}>{herramienta.nombre}</h2>
      <p className="card-brand">Marca: {herramienta.marca}</p>

      {!esMio && (
         <p className="card-user">
             Publicado por: {herramienta.user?.nombre || 'Usuario desconocido'}
         </p>
      )}

      <div className='precio-tag' style={{ opacity: estaRentada ? 0.5 : 1 }}>
          ${herramienta.precio} / día
      </div>

      <div className="card-actions">
        {esMio ? (
            // === OPCIONES DE DUEÑO ===
            <>
                <button 
                    className='btn' 
                    onClick={irAEditar} 
                    style={{ background: '#333', border: '1px solid #555' }}
                    title="Editar detalles"
                >
                    <FaEdit /> Editar
                </button>

                <button 
                    className='btn' 
                    onClick={confirmarBorrar} 
                    style={{ background: 'rgba(238, 37, 26, 0.2)', color: '#ee251a', border: '1px solid #ee251a' }}
                    title="Eliminar permanentemente"
                >
                    <FaTrash />
                </button>
            </>
        ) : (
            // === OPCIONES DE CLIENTE ===
            // ✅ LÓGICA DE BLOQUEO: Si está rentada, mostramos botón gris y deshabilitado
            estaRentada ? (
                <button 
                    className='btn' 
                    disabled={true} // Bloquea el click
                    style={{
                        flex: 1, 
                        background: '#333', 
                        color: '#777', 
                        cursor: 'not-allowed', 
                        border: '1px solid #444'
                    }}
                >
                    <FaBan /> No Disponible
                </button>
            ) : (
                <button className='btn' onClick={irADetalles} style={{flex: 1}}>
                    <FaShoppingCart /> Rentar
                </button>
            )
        )}
      </div>
    </div>
  );
}

export default HerramientaItem;