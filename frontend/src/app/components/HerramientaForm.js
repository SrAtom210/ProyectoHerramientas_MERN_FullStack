import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { crearHerramienta, actualizarHerramienta } from '../features/herramientasSlice';

function HerramientaForm({ herramientaEditar, setHerramientaEditar }) {
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        precio: '',
        descripcion: ''
    });

    // ✅ NUEVO: Estado separado para la imagen
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
            // Nota: No podemos poner el valor de la imagen anterior en un input type="file"
            // por seguridad del navegador, así que se queda en null a menos que suban una nueva.
        }
    }, [herramientaEditar]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // ✅ NUEVO: Manejador específico para el archivo
    const onFileChange = (e) => {
        // Guardamos el primer archivo seleccionado
        setImagen(e.target.files[0]);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        // Validaciones de campos de texto
        if (!nombre || !marca || !precio) {
            alert("Por favor completa todos los campos de texto obligatorios");
            return;
        }

        // ✅ NUEVO: Validación de Imagen (Obligatoria solo al Crear)
        if (!herramientaEditar && !imagen) {
            alert("Es obligatorio subir una imagen para crear una herramienta");
            return;
        }

        if (precio < 0) {
            alert("El precio no puede ser negativo");
            return;
        }

        // ✅ NUEVO: Preparamos los datos como FormData (Necesario para enviar archivos)
        const herramientaData = new FormData();
        herramientaData.append('nombre', nombre);
        herramientaData.append('marca', marca);
        herramientaData.append('precio', precio);
        herramientaData.append('descripcion', descripcion);
        
        // Solo agregamos la imagen si el usuario seleccionó una
        if (imagen) {
            herramientaData.append('imagen', imagen);
        }

        if (herramientaEditar) {
            const datosActualizados = {
                id: herramientaEditar._id,
                herramientaData: herramientaData // Ahora enviamos el FormData
            };
            dispatch(actualizarHerramienta(datosActualizados));
            setHerramientaEditar(null);
        } else {
            dispatch(crearHerramienta(herramientaData)); // Enviamos el FormData
        }

        // Limpiar formulario
        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
        setImagen(null);
        
        // Limpiar visualmente el input file
        document.getElementById('imagenInput').value = ""; 
    };

    const cancelarEdicion = () => {
        setHerramientaEditar(null);
        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
        setImagen(null);
        document.getElementById('imagenInput').value = "";
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

                {/* ✅ NUEVO: Input para subir imagen */}
                <div className='form-group'>
                    <label htmlFor="imagenInput">Imagen de la herramienta</label>
                    <input 
                        type="file" 
                        name="imagen" 
                        id="imagenInput" // ID para poder limpiarlo con JS
                        onChange={onFileChange}
                        className="form-control"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        // Solo es required si NO estamos editando (al editar es opcional cambiar la foto)
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