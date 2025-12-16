import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { borrarHerramienta } from '../features/herramientasSlice'; 
// ✅ 1. Importamos FaBan y toast
import { FaTrash, FaShoppingCart, FaHammer, FaEdit, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify'; 

function HerramientaItem({ herramienta }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const herramientaUserId = herramienta.user?._id || herramienta.user;
  const esMio = user && herramientaUserId === user._id;
  
  // Recibimos si está rentada desde el backend
  const estaRentada = herramienta.rentada; 

  const irADetalles = () => {
    navigate(`/herramienta/${herramienta._id}`);
  };

  const irAEditar = () => {
    navigate(`/editar-herramienta/${herramienta._id}`);
  };

  // ✅ Función borrar con manejo de errores mejorado
  const confirmarBorrar = () => {
    if(window.confirm('¿Estás seguro de que quieres eliminar esta herramienta? Esta acción no se puede deshacer.')) {
        
        dispatch(borrarHerramienta(herramienta._id))
            .unwrap()
            .then(() => {
                toast.success('Herramienta eliminada correctamente');
            })
            .catch((error) => {
                // Si el backend envía un mensaje específico (ej: "Tiene renta activa"), lo mostramos aquí
                const mensajeError = error?.message || error || 'Error al borrar la herramienta';
                toast.error(mensajeError); 
            });
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
    // Si está rentada, la imagen se ve un poco más oscura (opacidad 0.6)
    return <img src={src} alt={herramienta.nombre} className="card-img" style={{opacity: estaRentada ? 0.6 : 1}} />;
  };

  return (
    <div className='herramienta' style={{ position: 'relative' }}>
      
      {/* ✅ Etiqueta roja si está ocupada */}
      {estaRentada && (
          <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#cf3e3e',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)'
          }}>
              OCUPADO
          </div>
      )}

      {renderImagen()}

      <div className="card-date">
         {new Date(herramienta.createdAt).toLocaleDateString('es-MX')}
      </div>
      
      {/* Título gris si está ocupada */}
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
            // === VISTA DEL DUEÑO ===
            <>
                {/* Si está rentada, bloqueamos EDITAR */}
                {estaRentada ? (
                    <button 
                        className='btn' 
                        disabled
                        style={{ background: '#222', border: '1px solid #333', color: '#555', cursor: 'not-allowed' }}
                        title="No se puede editar durante una renta activa"
                    >
                        <FaEdit /> En uso
                    </button>
                ) : (
                    <button 
                        className='btn' 
                        onClick={irAEditar} 
                        style={{ background: '#333', border: '1px solid #555' }}
                        title="Editar detalles"
                    >
                        <FaEdit /> Editar
                    </button>
                )}

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
            // === VISTA DEL CLIENTE ===
            estaRentada ? (
                // Si está rentada, bloqueamos RENTAR
                <button 
                    className='btn' 
                    disabled={true} 
                    style={{
                        flex: 1, 
                        background: '#222', 
                        color: '#555', 
                        cursor: 'not-allowed', 
                        border: '1px solid #333',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
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