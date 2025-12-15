import { useNavigate } from 'react-router-dom';
import HerramientaForm from './HerramientaForm';
import { FaArrowLeft } from 'react-icons/fa';

function CrearHerramienta() {
  const navigate = useNavigate();

  // Esta función se la pasaremos al formulario para que sepa qué hacer al terminar
  const alTerminar = () => {
      navigate('/mis-herramientas'); // Nos regresa a mis equipos
  };

  return (
    <div className="dashboard-container">
        <div className="container">
            <button 
                className='btn-ghost' 
                onClick={() => navigate('/mis-herramientas')}
                style={{ marginBottom: '20px' }}
            >
                <FaArrowLeft /> Volver a Mis Equipos
            </button>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 className="dashboard-title">Publicar Equipo</h1>
                    <p className="dashboard-subtitle">Añade una nueva herramienta a tu inventario</p>
                </div>

                {/* Renderizamos tu formulario existente */}
                <HerramientaForm alTerminar={alTerminar} />
            </div>
        </div>
    </div>
  );
}

export default CrearHerramienta;