import './style/AgregarEmpleado.css';
import './style/EliminarEmpleado.css';
import MenuHamburguesa from '../MenuHamburguesa';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const EliminarEmpleado = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [resultados, setResultados] = useState([]);
  const [empleadoId, setEmpleadoId] = useState('');
  const [userRole, setUserRole] = useState({});
  //const URL_API = "https://abarrotesapi-service-api-yacruz.cloud.okteto.net/";
  const URL_API = 'http://localhost:8080/'; 

  const buscarEmpleado = async () => {
    try {
      const response = await fetch(URL_API + `api/empleados/buscar?nombre=${nombre}&apellidos=${apellidos}`);
      if (response.ok) {
        const data = await response.json();
        setResultados(data);
      } else {
        console.error('Error al buscar empleado');
      }
    } catch (error) {
      console.error('Error al buscar empleado:', error);
    }
  };

  const handleEliminar = async () => {
    try {
      const response = await fetch(URL_API + `api/empleados/${empleadoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Procesar la respuesta
        console.log('Empleado eliminado con éxito');
        // Actualizar la lista de resultados después de la eliminación
        setResultados([]);
      } else {
        // Manejar errores
        console.error('Error al eliminar el empleado');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    // Modificación 2: Parsear el rol al cargar el componente
    const storedRole = localStorage.getItem('userRole');
    console.log('Stored Role:', storedRole);

    const parsedRole = storedRole ? JSON.parse(storedRole) : null;
    console.log('Parsed Role:', parsedRole);

    setUserRole(parsedRole);
  }, []);

  return (
    <div className='contenedor'>
      <MenuHamburguesa />
      <h1>Eliminar Empleado</h1>
      <Link to="/registroEmpleado">Volver al Registro de Empleados</Link><br /><br />
      
      {userRole && userRole.rol && userRole.rol === "Encargado_Departamento" ? (
        <form>
          <div>
            <label>Nombre:</label>
            <input
              type='text'
              className='datos'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder='Ingrese el nombre'
            />
          </div>
          <div>
            <label>Apellidos:</label>
            <input
              type='text'
              className='datos'
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              placeholder='Ingrese los apellidos'
            />
          </div>
          <button type='button' onClick={buscarEmpleado} className='buscador'>
            Buscar Empleado
          </button>
        </form>
      ) : (
        <p>No cuentas con los permisos.</p>
      )}

      {resultados.length > 0 && (
        <div className='resultados'>
          <h2>Resultados de la búsqueda:</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>ID Rol</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((empleado) => (
                <tr key={empleado.idEmpleado}>
                  <td>{empleado.idEmpleado}</td>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.apellidos}</td>
                  <td>{empleado.idRol}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <label>ID del empleado a eliminar:</label>
            <input
              type='text'
              className='datos'
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
            />
            <button type='button' onClick={handleEliminar} className='eliminar'>
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EliminarEmpleado;