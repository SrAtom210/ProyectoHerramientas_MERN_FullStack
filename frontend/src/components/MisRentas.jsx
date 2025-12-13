import { useEffect, useState } from 'react';
import rentaService from '../features/rentaService';

const MisRentas = () => {
  const [rentas, setRentas] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      cargarRentas();
    }
  }, []);

  const cargarRentas = async () => {
    try {
      const data = await rentaService.getMisRentas(user.token);
      setRentas(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar rentas");
    }
  };

  if (!user) {
    return <h2>Debes iniciar sesión para ver tus rentas.</h2>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Mis Rentas Activas</h1>
      {rentas.length === 0 ? <p>No has rentado nada aún.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {rentas.map((renta) => (
            <div key={renta._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
               {/* Si poblamos la herramienta, podemos mostrar su foto */}
               {renta.herramienta && (
                 <img src={renta.herramienta.foto} alt="Herramienta" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
               )}
               
               <div style={{ flex: 1 }}>
                 {renta.herramienta && <h3 style={{ margin: '0 0 5px 0' }}>{renta.herramienta.nombre}</h3>}
                 <p style={{ margin: '5px 0' }}>📅 <b>Inicio:</b> {new Date(renta.fechaInicio).toLocaleDateString()}</p>
                 <p style={{ margin: '5px 0' }}>📅 <b>Fin:</b> {new Date(renta.fechaFin).toLocaleDateString()}</p>
                 <p style={{ margin: '5px 0', color: '#666' }}>Estado: {renta.estado}</p>
               </div>

               <div style={{ textAlign: 'right' }}>
                 <p style={{ fontSize: '0.9rem', color: '#888' }}>Total a pagar:</p>
                 <h2 style={{ margin: 0, color: '#28a745' }}>${renta.total}</h2>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisRentas;