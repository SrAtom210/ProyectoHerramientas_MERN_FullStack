import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HerramientaForm from './HerramientaForm'; 
import HerramientaItem from './HerramientaItem';
import Spinner from './Spinner';
import { reset, obtenerHerramientas } from '../features/herramientasSlice';

function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { herramientas, isLoading, isError, message } = useSelector(
        (state) => state.herramientas
    );

    const [herramientaEditar, setHerramientaEditar] = useState(null);

    const activarEdicion = (herramienta) => {
        setHerramientaEditar(herramienta);
        // Opcional: Hacer scroll hacia arriba suavemente para ver el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        if (!user) {
            navigate('/login');
        } else {
            dispatch(obtenerHerramientas());
        }

        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="dashboard-container">
            <section className='container'>
                
                {/* --- NUEVO DISEÑO DE ENCABEZADO --- */}
                <div className="dashboard-heading">
                    <h1 className="dashboard-title">
                        Bienvenido {user && user.nombre} <span style={{color: '#fca311'}}>.</span>
                    </h1>
                    <p className="dashboard-subtitle">
                        Panel de Administración de Renta de Herramientas
                    </p>
                </div>

                {/* Mantenemos tu formulario aquí porque es tu lógica actual */}
                <div style={{ marginBottom: '40px' }}>
                    <HerramientaForm 
                        herramientaEditar={herramientaEditar} 
                        setHerramientaEditar={setHerramientaEditar} 
                    />
                </div>

                {/* --- NUEVO GRID DE HERRAMIENTAS --- */}
                {herramientas.length > 0 ? (
                    <div className="herramientas-grid">
                        {herramientas.map((herramienta) => (
                            <HerramientaItem 
                                key={herramienta._id} 
                                herramienta={herramienta}
                                activarEdicion={activarEdicion} // Mantenemos tu prop de edición
                            />
                        ))}
                    </div>
                ) : (
                    <h3 style={{gridColumn: '1 / -1', textAlign: 'center', color: '#a1a1aa', marginTop: '20px'}}>
                        No has publicado herramientas aún
                    </h3>
                )}
            </section>
        </div>
    );
}

export default Dashboard;