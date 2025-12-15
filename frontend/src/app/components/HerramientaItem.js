import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { borrarHerramienta } from '../features/herramientasSlice'; 
import { FaTrash, FaShoppingCart, FaHammer } from 'react-icons/fa';

function HerramientaItem({ herramienta }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // 2. Navegar a detalles (Para elegir fechas antes de rentar)
  const irADetalles = () => {
    navigate(`/herramienta/${herramienta._id}`);
  };

  // 3. LÓGICA PARA MOSTRAR LA IMAGEN
  const renderImagen = () => {
    // Si no hay foto, mostramos el icono del martillo por defecto
    if (!herramienta.imagen) {
        return (
            <div className="img-placeholder">
                <FaHammer size={40} color="rgba(255,255,255,0.2)" />
            </div>
        );
    }

    let src = herramienta.imagen;

    // Si NO empieza con http, asumimos que es una foto subida al servidor (Multer)
    if (!src.startsWith('http')) {
        // Corregimos las barras invertidas de Windows (\) por barras normales (/)
        src = src.replace(/\\/g, '/');
        // Construimos la URL completa apuntando a tu backend
        // Asegúrate de que este puerto (8000) sea el correcto de tu backend
        src = `http://penrose512.jcarlos19.com:8000/${src}`;
    }

    return <img src={src} alt={herramienta.nombre} className="card-img" />;
  };

  return (
    <div className='herramienta'>
      {/* Renderizamos la imagen primero */}
      {renderImagen()}

      <div className="card-date">
         {new Date(herramienta.createdAt).toLocaleDateString('es-MX')}
      </div>
      
      <h2>{herramienta.nombre}</h2>
      <p className="card-brand">Marca: {herramienta.marca}</p>

      {/* Mostrar quién lo publicó (útil para el Marketplace) */}
      {herramienta.user && (
         <p className="card-user">
             Publicado por: {herramienta.user.nombre}
         </p>
      )}

      <div className='precio-tag'>${herramienta.precio} / día</div>

      <div className="card-actions">
        {/* El botón ahora lleva a detalles para configurar la renta */}
        <button className='btn' onClick={irADetalles} style={{flex: 1}}>
            <FaShoppingCart /> Rentar
        </button>

        {/* 4. Solo mostramos el botón de borrar si el usuario logueado es el dueño */}
        {user && herramienta.user && user._id === herramienta.user._id && (
            <button 
                onClick={() => dispatch(borrarHerramienta(herramienta._id))} 
                className='close'
                title="Borrar mi herramienta"
            >
                <FaTrash />
            </button>
        )}
      </div>
    </div>
  );
}

export default HerramientaItem;