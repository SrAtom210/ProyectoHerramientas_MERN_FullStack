import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { crearHerramienta, actualizarHerramienta } from '../merkmale/herramientasSlice';

function HerramientaForm({ herramientaEditar, setHerramientaEditar }) {
    // Estado local del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        precio: '',
        descripcion: ''
    });

    // Desestructuramos para usar en los values de los inputs
    const { nombre, marca, precio, descripcion } = formData;

    const dispatch = useDispatch();

    // EFECTO MÁGICO: Si cambia 'herramientaEditar', rellenamos el formulario
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

    // Maneja los cambios en los inputs
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Maneja el envío del formulario
    const onSubmit = (e) => {
        e.preventDefault();

        if (herramientaEditar) {
            // --- MODO EDICIÓN ---
            const datosActualizados = {
                id: herramientaEditar._id,
                herramientaData: { nombre, marca, precio, descripcion }
            };
            dispatch(actualizarHerramienta(datosActualizados));
            
            // Salimos del modo edición
            setHerramientaEditar(null);
        } else {
            // --- MODO CREACIÓN ---
            dispatch(crearHerramienta({ nombre, marca, precio, descripcion }));
        }

        // Limpiamos el formulario
        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
    };

    // Botón para cancelar la edición y limpiar todo
    const cancelarEdicion = () => {
        setHerramientaEditar(null);
        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
    };

    return (
        <section className='form'>
            <h3>
                {herramientaEditar ? '✏️ Editar Herramienta' : '➕ Nueva Herramienta'}
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
                    />
                </div>
                
                <div className='form-group'>
                    <label htmlFor="precio">Precio de renta (MXN)</label>
                    <input 
                        type='number' 
                        name='precio' 
                        id='precio' 
                        value={precio} 
                        onChange={onChange} 
                        className='form-control' 
                        placeholder='0.00'
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
                        placeholder='Detalles del estado de la herramienta...'
                    ></textarea>
                </div>

                <div className='form-group'>
                    <button className='btn btn-block' type='submit'>
                        {herramientaEditar ? 'Actualizar Herramienta' : 'Agregar Herramienta'}
                    </button>
                    
                    {/* Botón de Cancelar (Solo aparece si estamos editando) */}
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