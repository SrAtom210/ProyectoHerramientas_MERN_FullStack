import { useState } from 'react';
import axios from 'axios';

const HerramientaForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    foto: '',
    estado: 'disponible' // Valor por defecto
  });

  const { nombre, descripcion, precio, foto, estado } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Obtener el usuario del localStorage para el Token
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
      alert('Debes estar logueado para publicar');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      await axios.post('http://localhost:8000/api/herramientas', formData, config);
      alert('Herramienta creada correctamente');
      setFormData({ nombre: '', descripcion: '', precio: '', foto: '', estado: 'disponible' }); // Limpiar form
      window.location.reload(); // Recargar para ver la nueva herramienta
    } catch (error) {
      alert('Error al crear herramienta');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px', borderRadius: '8px' }}>
      <h3>Agregar Nueva Herramienta</h3>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="nombre" value={nombre} onChange={onChange} placeholder="Nombre de la herramienta" required />
        <textarea name="descripcion" value={descripcion} onChange={onChange} placeholder="Descripción (medidas, uso...)" required />
        <input type="number" name="precio" value={precio} onChange={onChange} placeholder="Precio por día" required />
        <input type="text" name="foto" value={foto} onChange={onChange} placeholder="URL de la foto (https://...)" required />
        
        <select name="estado" value={estado} onChange={onChange}>
            <option value="disponible">Disponible</option>
            <option value="mantenimiento">En Mantenimiento</option>
        </select>

        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
          Publicar Herramienta
        </button>
      </form>
    </div>
  );
};

export default HerramientaForm;