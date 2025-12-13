import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { crearHerramienta } from '../merkmale/herramientasSlice'; // Asegúrate de que la ruta sea correcta

function HerramientaForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        precio: '',
        descripcion: ''
    });

    const { nombre, marca, precio, descripcion } = formData;
    const dispatch = useDispatch();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // Enviamos el objeto con los datos
        dispatch(crearHerramienta({ nombre, marca, precio, descripcion }));
        // Limpiamos el formulario
        setFormData({ nombre: '', marca: '', precio: '', descripcion: '' });
    };

    return (
        <section className='form'>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor="nombre">Nombre de la herramienta</label>
                    <input type='text' name='nombre' id='nombre' value={nombre} onChange={onChange} className='form-control' />
                </div>
                <div className='form-group'>
                    <label htmlFor="marca">Marca</label>
                    <input type='text' name='marca' id='marca' value={marca} onChange={onChange} className='form-control' />
                </div>
                <div className='form-group'>
                    <label htmlFor="precio">Precio de renta (MXN)</label>
                    <input type='number' name='precio' id='precio' value={precio} onChange={onChange} className='form-control' />
                </div>
                <div className='form-group'>
                    <label htmlFor="descripcion">Descripción (Opcional)</label>
                    <textarea name='descripcion' id='descripcion' value={descripcion} onChange={onChange} className='form-control'></textarea>
                </div>
                <div className='form-group'>
                    <button className='btn btn-block' type='submit'>Agregar Herramienta</button>
                </div>
            </form>
        </section>
    );
}

export default HerramientaForm;