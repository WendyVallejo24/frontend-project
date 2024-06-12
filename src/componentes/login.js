import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';
import imgFerreteria from './img/usuarioFerret.jpg';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const URL_API = 'http://localhost:8080/';

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const responseGet = await axios.get(URL_API + 'initEmpleados');
      if (responseGet) {
        console.log('Respuesta de inicialización con GET', responseGet.data);
      } else {
        console.error('Error en la inicialización: no se recibió respuesta');
      }
    } catch (error) {
      console.error('Error en la inicialización', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(URL_API + 'login', {
        usuario: username,
        contrasenia: password,
      });

      console.log('Respuesta del backend', response.data);

      if (response.data.success && response.data.rol) {
        const { nombre, id_empleado } = response.data;
        localStorage.setItem('nombreEmpleado', nombre);
        localStorage.setItem('idEmpleado', id_empleado);

        const userRole = response.data;
        localStorage.setItem('userRole', JSON.stringify(userRole));

        if (userRole.rol === 'Supervisor de Ventas') {
          navigate('/registroEmpleado', { state: { userRole } });
        } else if (userRole.rol === 'Vendedor') {
          navigate('/pedidos', { state: { userRole } });
        }
      } else {
        setError('La respuesta del servidor no contiene un rol válido.');
      }
    } catch (error) {
      setError('Error de autenticación');
      console.error('Error al iniciar sesión', error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <img className="user-photo" src={imgFerreteria} alt="Foto de usuario" />
        <p className='titulo'>Iniciar Sesión</p>
        {error && <div className="error-message">{error}</div>}
        <form>
          <label className="label">
            Usuario:
            <input
              className="user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label className="label">
            Contraseña:
            <input
              className="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button className="button" type="button" onClick={handleLogin}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;