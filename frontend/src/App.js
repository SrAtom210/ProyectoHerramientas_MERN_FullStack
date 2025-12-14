import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importación de Componentes
import Dashboard from './app/components/Dashboard';
import Login from './app/components/Login';
import Registro from './app/components/Registro';
import Header from './app/components/Header';
import MisRentas from './app/components/MisRentas'; // ✅ NUEVO: Importamos el archivo
import HerramientaDetalles from './app/components/HerramientaDetalles';

function App() {
  return (
    <>
      <Router>
        <div className='Container'>
          <Header />
          <Routes>
            {/* Ruta Principal (Dashboard) */}
            <Route path='/' element={<Dashboard />} />
            
            {/* Rutas de Autenticación */}
            <Route path='/login' element={<Login />} />
            <Route path='/registro' element={<Registro />} />
            
            {/* ✅ NUEVO: La ruta para ver mis rentas */}
            <Route path='/mis-rentas' element={<MisRentas />} />
            <Route path="/herramienta/:id" element={<HerramientaDetalles />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;