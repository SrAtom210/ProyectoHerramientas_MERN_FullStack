import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { crearHerramienta, actualizarHerramienta } from '../features/herramientasSlice';

function HerramientaForm({ herramientaEditar, setHerramientaEditar, alTerminar }) {
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        precio: '',
        descripcion: ''
    });

    const [imagen, setImagen] = useState(null);

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

    const onFileChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !marca || !precio) {
            alert("Por favor completa todos los campos de texto obligatorios");
            return;
        }

        if (!herramientaEditar && !imagen) {
            alert("Es obligatorio subir una imagen para crear una herramienta");
            return;
        }

        if (precio < 0) {
            alert("El precio no puede ser negativo");
            return;
        }

        const herramientaData = new FormData();
        herramientaData.append('nombre', nombre);
        herramientaData.append('marca', marca);
        herramientaData.append('precio', precio);
        herramientaData.append('descripcion', descripcion);
        
        if (imagen) {
            herramientaData.append('imagen', imagen);
        }

        if (herramientaEditar) {
            const datosActualizados = {
                id: herramientaEditar._id,
                herramientaData: herramientaData 
            };
            
            await dispatch(actualizarHerramienta(datosActualizados));
            
            // ✅ CORRECCIÓN AQUÍ:
            // Verificamos si existe la función antes de llamarla.
            // (En la página de editar, esta función no existe y no es necesaria porque redireccionamos).
            if (setHerramientaEditar) {
                setHerramientaEditar(null);
            }
            
            if (alTerminar) alTerminar();

        } else {
            await dispatch(crearHerramienta(herramientaData)); 
            if (alTerminar) alTerminar();
        }

        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
        setImagen(null);
        
        // Verificamos que el elemento exista antes de intentar limpiar el valor
        const fileInput = document.getElementById('imagenInput');
        if (fileInput) fileInput.value = ""; 
    };

    const cancelarEdicion = () => {
        // También protegemos aquí por seguridad
        if (setHerramientaEditar) {
            setHerramientaEditar(null);
        }
        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
        setImagen(null);
        const fileInput = document.getElementById('imagenInput');
        if (fileInput) fileInput.value = "";
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
                        required 
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
                        required 
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
                        min='0' 
                        step='0.01'
                        onKeyDown={(evt) => {
                            const allowedKeys = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Enter"];
                            if (!allowedKeys.includes(evt.key) && !/^[0-9.]$/.test(evt.key)) {
                                evt.preventDefault();
                            }
                        }}
                        required 
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="imagenInput">Imagen de la herramienta</label>
                    <input 
                        type="file" 
                        name="imagen" 
                        id="imagenInput" 
                        onChange={onFileChange}
                        className="form-control"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        required={!herramientaEditar} 
                    />
                    {herramientaEditar && (
                        <small style={{color: '#777'}}>Deja esto vacío si no quieres cambiar la imagen actual.</small>
                    )}
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
                    
                    {/* El botón de cancelar solo tiene sentido si estamos en la vista incrustada (Dashboard anterior) 
                        o si queremos limpiar el formulario, pero ahora ya tenemos el botón "Volver" arriba. 
                        Podemos dejarlo, pero con la protección que añadí a cancelarEdicion no fallará. */}
                    {herramientaEditar && setHerramientaEditar && (
                        <button 
                            type="button" 
                            className="btn btn-block" 
                            onClick={cancelarEdicion} 
                            style={{marginTop: '10px', backgroundColor: '#555', color: 'white'}}
                        >
                            Limpiar Formulario
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default HerramientaForm;