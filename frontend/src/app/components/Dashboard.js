import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HerramientaForm from '../components/HerramientaForm';
import HerramientaItem from '../components/HerramientaItem';
import Spinner from '../components/Spinner';
import { obtenerHerramientas, reset } from '../merkmale/herramientasSlice';

function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    // Extraemos el estado de herramientas
    const { herramientas, isLoading, isError, message } = useSelector(
        (state) => state.herramientas
    );

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        if (!user) {
            navigate('/login');
        } else {
            // Solo intentamos obtener herramientas si hay usuario
            dispatch(obtenerHerramientas());
        }

        // Al salir del dashboard, reseteamos el estado de herramientas
        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            <section className='heading'>
                <h1>Bienvenido {user && user.nombre}</h1>
                <p>Panel de Renta de Herramientas</p>
            </section>

            <HerramientaForm />

            <section className='content'>
                {herramientas.length > 0 ? (
                    <div className='herramientas'>
                        {herramientas.map((herramienta) => (
                            <HerramientaItem key={herramienta._id} herramienta={herramienta} />
                        ))}
                    </div>
                ) : (
                    <h3>No has publicado herramientas aún</h3>
                )}
            </section>
        </>
    );
}

export default Dashboard;