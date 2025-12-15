import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { borrarHerramienta } from '../features/herramientasSlice'; 
import { FaTrash, FaShoppingCart, FaHammer, FaEdit } from 'react-icons/fa';

function HerramientaItem({ herramienta }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // ✅ CORRECCIÓN DE SEGURIDAD (Defensive Coding)
  // 1. Intentamos obtener el ID del dueño de forma segura con '?.'
  // Si herramienta.user es null, esto devolverá undefined en lugar de romper la app.
  const herramientaUserId = herramienta.user?._id || herramienta.user;

  // 2. Comparamos solo si tenemos ambos datos
  const esMio = user && herramientaUserId === user._id;

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
    return <img src={src} alt={herramienta.nombre} className="card-img" />;
  };

  return (
    <div className='herramienta'>
      {renderImagen()}

      <div className="card-date">
         {new Date(herramienta.createdAt).toLocaleDateString('es-MX')}
      </div>
      
      <h2>{herramienta.nombre}</h2>
      <p className="card-brand">Marca: {herramienta.marca}</p>

      {/* ✅ CORRECCIÓN VISUAL:
          Usamos '?.' para acceder al nombre. Si no tiene usuario, mostramos "Usuario desconocido" */}
      {!esMio && (
         <p className="card-user">
             Publicado por: {herramienta.user?.nombre || 'Usuario desconocido'}
         </p>
      )}

      <div className='precio-tag'>${herramienta.precio} / día</div>

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
            <button className='btn' onClick={irADetalles} style={{flex: 1}}>
                <FaShoppingCart /> Rentar
            </button>
        )}
      </div>
    </div>
  );
}

export default HerramientaItem;