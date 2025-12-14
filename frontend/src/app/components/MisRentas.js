import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHammer } from 'react-icons/fa'; // Icono opcional para decorar

function MisRentas() {
  const navigate = useNavigate();
  // Obtenemos al usuario para verificar si está logueado
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Si no hay usuario, lo mandamos al login (Protección de Ruta)
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <section className='heading'>
        <h1>
          <FaHammer /> Mis Rentas
        </h1>
        <p>Historial de herramientas que has rentado</p>
      </section>

      {/* AQUÍ MOSTRAREMOS LA LISTA CUANDO TENGAMOS EL BACKEND DE RENTAS */}
      <section className='content' style={{ textAlign: 'center', marginTop: '50px' }}>
        <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '40px', 
            borderRadius: '10px',
            border: '1px dashed #ccc'
        }}>
            <h3>Historial Vacío (Por ahora)</h3>
            <p>
                Aún no has rentado ninguna herramienta. 
                <br />
                Cuando rentes equipos, aparecerán listados aquí con su fecha de devolución.
            </p>
            <button 
                className='btn' 
                onClick={() => navigate('/')} 
                style={{ marginTop: '20px' }}
            >
                Ir a Rentar Herramientas
            </button>
        </div>
      </section>
    </div>
  );
}

export default MisRentas;