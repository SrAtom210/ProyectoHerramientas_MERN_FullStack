import { useDispatch } from 'react-redux';
import { borrarHerramienta } from '../merkmale/herramientasSlice';
import { FaTrash } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado

function HerramientaItem({ herramienta }) {
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
            
            <button onClick={() => dispatch(borrarHerramienta(herramienta._id))} className='close'>
                <FaTrash />
            </button>
        </div>
    );
}

export default HerramientaItem;