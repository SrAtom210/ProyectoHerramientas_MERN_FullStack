/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './app/components/Dashboard';
import Login from './app/components/Login';
import Registro from './app/components/Registro';
import Header from './app/components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App(){
  return (
    <>
    <Router>
    <div className='Container'>
      <Header />
        <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/registro' element={<Registro/>} />
        </Routes>
    </div>
    </Router>
    </>
  );
}

export default App;
