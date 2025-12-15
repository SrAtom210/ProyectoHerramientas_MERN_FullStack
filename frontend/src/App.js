import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importación de Componentes
import Dashboard from './app/components/Dashboard';
import Login from './app/components/Login';
import Registro from './app/components/Registro';
import Header from './app/components/Header';
import MisRentas from './app/components/MisRentas'; 
// ✅ NUEVO: Importamos los componentes faltantes
import MisHerramientas from './app/components/MisHerramientas';
import Perfil from './app/components/Perfil';

function App() {
  return (
    <>
      <Router>
        <div className='Container'>
          <Header />
          <Routes>
            {/* Ruta Principal (Catálogo General) */}
            <Route path='/' element={<Dashboard />} />
            
            {/* Rutas de Autenticación */}
            <Route path='/login' element={<Login />} />
            <Route path='/registro' element={<Registro />} />
            
            {/* Rutas de Usuario */}
            <Route path='/mis-rentas' element={<MisRentas />} />
            
            {/* ✅ NUEVAS RUTAS AGREGADAS */}
            <Route path='/mis-herramientas' element={<MisHerramientas />} />
            <Route path='/mi-perfil' element={<Perfil />} />

          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;