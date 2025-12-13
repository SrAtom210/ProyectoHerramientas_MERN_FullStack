import { useState, useEffect } from 'react';
import authService from '../features/authService'; // Asegúrate que la ruta sea correcta
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Si instalaste react-toastify, sino usa alert()

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmpassword: '',
  })
  
  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const userData = { nombre, email, password };
      
      // 1. Llamamos al servicio de registro
      await authService.register(userData);
      
      // 2. Si todo sale bien, redirigimos al Home
      alert('¡Registro exitoso!');
      navigate('/');
      
      // Opcional: Recargar la página para que el Header detecte al usuario logueado
      window.location.reload(); 
      
    } catch (error) {
      // Manejo de errores (ej. "Usuario ya existe")
      const mensaje = (error.response && error.response.data && error.response.data.mensaje) || error.message;
      alert('Error: ' + mensaje);
    }
  };

  const { nombre, email, password, confirmpassword } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      alert('Las contraseñas no coinciden'); // O toast.error
      return;
    } else {
      const userData = {
        nombre,
        email,
        password,
      };
      console.log('Registrando usuario:', userData);
      // Aquí conectaremos con el backend en el siguiente paso
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Registrarse</h1>
      <p>Crea una cuenta para empezar</p>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="nombre"
          value={nombre}
          placeholder="Tu Nombre"
          onChange={onChange}
          style={{ padding: '10px' }}
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Tu Email"
          onChange={onChange}
          style={{ padding: '10px' }}
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Contraseña"
          onChange={onChange}
          style={{ padding: '10px' }}
          required
        />
        <input
          type="password"
          name="confirmpassword"
          value={confirmpassword}
          placeholder="Confirmar Contraseña"
          onChange={onChange}
          style={{ padding: '10px' }}
          required
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#000', color: '#fff', cursor: 'pointer' }}>
          Registrarme
        </button>
      </form>
    </div>
  );
};

export default Register;