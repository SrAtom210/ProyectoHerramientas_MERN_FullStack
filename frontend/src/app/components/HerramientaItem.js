import { useDispatch } from 'react-redux';
//import { borrarHerramienta } from '../../features/herramientasSlice';
//import { crearRenta } from '../../features/rentaSlice'; // 1. Importamos la acción de rentar
import { borrarHerramienta } from '../features/herramientasSlice';
import { crearRenta } from '../features/rentaSlice'; // 1. Importamos la acción de rentar
import { FaEdit, FaTrash, FaShoppingCart } from 'react-icons/fa'; // Icono de carrito
import { toast } from 'react-toastify';

function HerramientaItem({ herramienta, activarEdicion }) {
  const dispatch = useDispatch();

  // Función para rentar
  const onRentar = () => {
    // Despachamos la acción enviando el ID de la herramienta
    dispatch(crearRenta({ herramientaId: herramienta._id }));
    toast.success(`¡Rentaste: ${herramienta.nombre}!`);
  };

  return (
    <div className='herramienta'>
      {/* Fecha de creación */}
      <div>{new Date(herramienta.createdAt).toLocaleString('es-MX')}</div>
      
      {/* Título y Marca */}
      <h2>{herramienta.nombre}</h2>
      <p style={{ color: '#a1a1aa', marginBottom: '10px' }}>Marca: {herramienta.marca}</p>

      {/* Precio estilizado */}
      <div className='precio-tag'>
        ${herramienta.precio} / día
      </div>

      {/* Descripción (si existe) */}
      <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>
         {herramienta.descripcion}
      </p>

      {/* BOTÓN DE RENTAR (Nuevo) */}
      <button 
        className='btn btn-block' 
        onClick={onRentar}
        style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
      >
        <FaShoppingCart /> Rentar Ahora
      </button>

      {/* Botones de Admin (Editar/Borrar) */}
      <button 
        onClick={() => activarEdicion(herramienta)} 
        className='edit-icon'
        title="Editar"
      >
        <FaEdit />
      </button>
      <button 
        onClick={() => dispatch(borrarHerramienta(herramienta._id))} 
        className='close'
        title="Borrar"
      >
        <FaTrash />
      </button>
    </div>
  );
}

export default HerramientaItem;