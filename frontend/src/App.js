import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importación de Componentes
import Dashboard from './app/components/Dashboard';
import Login from './app/components/Login';
import Registro from './app/components/Registro';
import Header from './app/components/Header';
import MisRentas from './app/components/MisRentas'; 
import MisHerramientas from './app/components/MisHerramientas';
import Perfil from './app/components/Perfil';
import CrearHerramienta from './app/components/CrearHerramienta';
import EditarHerramienta from './app/components/EditarHerramienta';

function App() {
  return (
    <>
      <Router>
        <div className='Container'>
          <Header />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registro' element={<Registro />} />
            <Route path='/mis-rentas' element={<MisRentas />} />
            <Route path='/mis-herramientas' element={<MisHerramientas />} />
            <Route path='/mi-perfil' element={<Perfil />} />
            <Route path='/crear-herramienta' element={<CrearHerramienta />} />
            <Route path='/editar-herramienta/:id' element={<EditarHerramienta />} />
            
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}
export default App;