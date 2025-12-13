import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ListadoHerramientas from './components/ListadoHerramientas'; 
import MisRentas from './components/MisRentas';
import Login from './components/Login';
import Register from './components/Register'; // <--- Descomenta o agrega esto

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<ListadoHerramientas />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} /> {/* <--- Descomenta esto */}
            <Route path='/mis-rentas' element={<MisRentas />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;