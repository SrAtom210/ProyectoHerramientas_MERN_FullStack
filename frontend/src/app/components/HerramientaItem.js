import { useDispatch } from 'react-redux';
import { borrarHerramienta } from '../../features/herramientasSlice';
import { FaTrash, FaPen } from 'react-icons/fa'; // Importa FaPen


function HerramientaItem({ herramienta, activarEdicion }) { // Recibe la prop
    const dispatch = useDispatch();

    return (
        <div className='herramienta'>
            <div>
                {new Date(herramienta.createdAt).toLocaleString('es-MX')}
            </div>
            <h2>{herramienta.nombre}</h2>
            <p>Marca: <strong>{herramienta.marca}</strong></p>
            <p>Precio: ${herramienta.precio} / día</p>
            <p className='descripcion'>{herramienta.descripcion}</p>
            
            <div className="botones-acciones" style={{position: 'absolute', top: '10px', right: '15px'}}>
                <button onClick={() => activarEdicion(herramienta)} className='btn-icon' style={{border: 'none', background: 'transparent', color: 'blue', cursor: 'pointer', marginRight: '10px'}}>
                    <FaPen />
                </button>
                <button onClick={() => dispatch(borrarHerramienta(herramienta._id))} className='btn-icon' style={{border: 'none', background: 'transparent', color: 'red', cursor: 'pointer'}}>
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}

export default HerramientaItem;