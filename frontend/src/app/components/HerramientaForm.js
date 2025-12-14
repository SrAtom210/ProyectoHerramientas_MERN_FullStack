import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// Si 'components' y 'app' están al mismo nivel dentro de 'src':
import { crearHerramienta, actualizarHerramienta } from '../../features/herramientasSlice';
//import { toast } from 'react-toastify'; // Importamos toast para alertas bonitas (si lo tienes instalado)

function HerramientaForm({ herramientaEditar, setHerramientaEditar }) {
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        precio: '',
        descripcion: ''
    });

    const { nombre, marca, precio, descripcion } = formData;
    const dispatch = useDispatch();

    useEffect(() => {
        if (herramientaEditar) {
            setFormData({
                nombre: herramientaEditar.nombre,
                marca: herramientaEditar.marca,
                precio: herramientaEditar.precio,
                descripcion: herramientaEditar.descripcion || ''
            });
        }
    }, [herramientaEditar]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        // ✅ NUEVO: Validación de seguridad antes de enviar
        if (precio < 0) {
            alert("El precio no puede ser negativo"); // O usa toast.error()
            return; // Detiene la función aquí, no envía nada
        }

        if (herramientaEditar) {
            const datosActualizados = {
                id: herramientaEditar._id,
                herramientaData: { nombre, marca, precio, descripcion }
            };
            dispatch(actualizarHerramienta(datosActualizados));
            setHerramientaEditar(null);
        } else {
            dispatch(crearHerramienta({ nombre, marca, precio, descripcion }));
        }

        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
    };

    const cancelarEdicion = () => {
        setHerramientaEditar(null);
        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
    };

    return (
        <section className='form'>
            <h3>
                {herramientaEditar ? 'Editar Herramienta' : 'Nueva Herramienta'}
            </h3>
            
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor="nombre">Nombre de la herramienta</label>
                    <input 
                        type='text' 
                        name='nombre' 
                        id='nombre' 
                        value={nombre} 
                        onChange={onChange} 
                        className='form-control' 
                        placeholder='Ej: Taladro Percutor'
                        required // ✅ Obligatorio
                    />
                </div>
                
                <div className='form-group'>
                    <label htmlFor="marca">Marca</label>
                    <input 
                        type='text' 
                        name='marca' 
                        id='marca' 
                        value={marca} 
                        onChange={onChange} 
                        className='form-control' 
                        placeholder='Ej: Bosch, Truper'
                        required // ✅ Obligatorio
                    />
                </div>
                
                <div className='form-group'>
                    <label htmlFor="precio">Precio de renta (MXN)</label>
                    {/* ✅ NUEVO: Atributos de validación numérica */}
                    <input 
                        type='number' 
                        name='precio' 
                        id='precio' 
                        value={precio} 
                        onChange={onChange} 
                        className='form-control' 
                        placeholder='0.00'
                        min='0'        // Evita negativos en el spinner
                        step='0.01'    // Permite decimales
                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()} // Bloquea tecla 'e' y signos manuales
                        required 
                    />
                </div>
                
                <div className='form-group'>
                    <label htmlFor="descripcion">Descripción (Opcional)</label>
                    <textarea 
                        name='descripcion' 
                        id='descripcion' 
                        value={descripcion} 
                        onChange={onChange} 
                        className='form-control'
                        placeholder='Detalles del estado...'
                    ></textarea>
                </div>

                <div className='form-group'>
                    <button className='btn btn-block' type='submit'>
                        {herramientaEditar ? 'Actualizar Herramienta' : 'Agregar Herramienta'}
                    </button>
                    
                    {herramientaEditar && (
                        <button 
                            type="button" 
                            className="btn btn-block" 
                            onClick={cancelarEdicion} 
                            style={{marginTop: '10px', backgroundColor: '#555', color: 'white'}}
                        >
                            Cancelar Edición
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default HerramientaForm;