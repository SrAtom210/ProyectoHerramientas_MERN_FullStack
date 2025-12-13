import React, { useState, useEffect } from 'react';
import axios from 'axios';
import rentaService from '../features/rentaService';
import HerramientaForm from './HerramientaForm'; // Si quieres mostrar el formulario aquí

const ListadoHerramientas = () => {
  const [herramientas, setHerramientas] = useState([]);
  const [fechas, setFechas] = useState({}); // Estado local para guardar fechas de cada tarjeta

  const user = JSON.parse(localStorage.getItem('user'));

  const obtenerHerramientas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/herramientas');
      setHerramientas(response.data);
    } catch (error) {
      console.error("Error al obtener herramientas:", error);
    }
  };

  useEffect(() => {
    obtenerHerramientas();
  }, []);

  // Manejar cambios en los inputs de fecha
  const handleDateChange = (id, field, value) => {
    setFechas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const onRentar = async (herramientaId) => {
    if (!user) {
      alert("Por favor inicia sesión para rentar.");
      return;
    }

    const fechaInicio = fechas[herramientaId]?.inicio;
    const fechaFin = fechas[herramientaId]?.fin;

    if (!fechaInicio || !fechaFin) {
      alert("Selecciona fecha de inicio y fin");
      return;
    }

    try {
      await rentaService.crearRenta({
        herramientaId,
        fechaInicio,
        fechaFin
      }, user.token);
      
      alert("¡Renta exitosa!");
      obtenerHerramientas(); // Recargar para ver que ahora la herramienta está 'rentada'
    } catch (error) {
      alert("Error al rentar: " + (error.response?.data?.mensaje || error.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Solo mostramos el formulario si es Admin o si quieres que todos publiquen */}
      {user && <HerramientaForm />} 

      <h2>Catálogo de Herramientas</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {herramientas.map((herramienta) => (
          <div key={herramienta._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', background: herramienta.estado === 'rentada' ? '#f9f9f9' : 'white' }}>
            <img 
              src={herramienta.foto} 
              alt={herramienta.nombre} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
            />
            <h3>{herramienta.nombre}</h3>
            <p>{herramienta.descripcion}</p>
            <p style={{ fontWeight: 'bold', color: '#2ecc71', fontSize: '1.2rem' }}>${herramienta.precio} / día</p>
            
            <div style={{ marginBottom: '10px' }}>
               <span style={{ 
                  padding: '5px 10px', 
                  borderRadius: '15px', 
                  fontSize: '0.8rem',
                  backgroundColor: herramienta.estado === 'disponible' ? '#e8f5e9' : '#ffebee',
                  color: herramienta.estado === 'disponible' ? '#2e7d32' : '#c62828'
                }}>
                  {herramienta.estado.toUpperCase()}
                </span>
            </div>

            {/* Sección de Renta - Solo visible si está disponible */}
            {herramienta.estado === 'disponible' ? (
              <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <label style={{display:'block', fontSize:'0.9rem'}}>Desde:</label>
                <input 
                  type="date" 
                  style={{width: '100%', marginBottom: '5px'}}
                  onChange={(e) => handleDateChange(herramienta._id, 'inicio', e.target.value)}
                />
                
                <label style={{display:'block', fontSize:'0.9rem'}}>Hasta:</label>
                <input 
                  type="date" 
                  style={{width: '100%', marginBottom: '10px'}}
                  onChange={(e) => handleDateChange(herramienta._id, 'fin', e.target.value)}
                />

                <button 
                  onClick={() => onRentar(herramienta._id)}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Rentar Ahora
                </button>
              </div>
            ) : (
              <button disabled style={{ width: '100%', padding: '10px', backgroundColor: '#ccc', color: '#666', border: 'none', borderRadius: '5px', cursor: 'not-allowed' }}>
                No Disponible
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListadoHerramientas;