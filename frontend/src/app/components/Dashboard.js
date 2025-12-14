import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HerramientaForm from './HerramientaForm'; // (Verifica si es ./ o ../components)
import HerramientaItem from './HerramientaItem';
import Spinner from './Spinner';
//import { reset, obtenerHerramientas } from '../../features/herramientasSlice'; // (Verifica la ruta ../../features)
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
        <>
            <section className='heading'>
                <h1>Bienvenido {user && user.nombre}</h1>
                <p>Panel de Renta de Herramientas</p>
            </section>

            <HerramientaForm 
                herramientaEditar={herramientaEditar} 
                setHerramientaEditar={setHerramientaEditar} 
            />

            <section className='content'>
                {herramientas.length > 0 ? (
                    /* CORRECCIÓN: Quitamos el <div className='herramientas'> */
                    /* Ahora los items son hijos directos de 'content' y el CSS Grid funcionará */
                    herramientas.map((herramienta) => (
                        <HerramientaItem 
                            key={herramienta._id} 
                            herramienta={herramienta}
                            activarEdicion={activarEdicion} 
                        />
                    ))
                ) : (
                    /* Mensaje cuando no hay nada (Ocupará toda la fila o se verá solo) */
                    <h3 style={{gridColumn: '1 / -1', textAlign: 'center', color: '#a1a1aa'}}>
                        No has publicado herramientas aún
                    </h3>
                )}
            </section>
        </>
    );
}

export default Dashboard;