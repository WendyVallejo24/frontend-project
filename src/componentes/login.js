import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { URL_API } from '../config';
import imgFerreteria from './img/usuarioFerret.jpg';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Lógica de inicialización aquí
    init();
  }, []); // El segundo parámetro es un arreglo de dependencias, en este caso, vacío para que se ejecute solo una vez al montar el componente

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
        // Extraer nombre y id_empleado de la respuesta
        const { nombre, id_empleado, token } = response.data;

        // Almacenar el nombre y el id_empleado en localStorage
        localStorage.setItem('nombreEmpleado', nombre);
        localStorage.setItem('idEmpleado', id_empleado);
        localStorage.setItem('token', token);

        const userRole = response.data; // Almacena todo el objeto de respuesta
        localStorage.setItem('userRole', JSON.stringify(userRole));

        if (userRole.rol === 'Supervisor de Ventas') {
          navigate('/registroEmpleado', { state: { userRole } });
        } else if (userRole.rol === 'Vendedor') {
          navigate('/pedidos', { state: { userRole } });
        }
        //navigate('/pedidos', { state: { userRole } });
      } else {
        console.error('La respuesta del servidor no contiene un rol válido.', response.data);
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error.message);
    }

  };

  return (
    <div className="container">
      <div className="form-container">
        <img className="user-photo" src={imgFerreteria} alt="Foto de usuario" />
        <p className='titulo'>Iniciar Sesión</p>
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
