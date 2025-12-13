import { useState } from 'react';
import { toast } from 'react-toastify'; // Opcional: Para alertas bonitas

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Aquí luego llamaremos al Backend
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Acceder</h1>
      <p>Ingresa para rentar herramientas</p>
      
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Tu Email"
          onChange={onChange}
          style={{ padding: '10px' }}
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Tu Contraseña"
          onChange={onChange}
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#000', color: '#fff', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;