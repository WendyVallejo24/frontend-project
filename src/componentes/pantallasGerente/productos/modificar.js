// UpdateProduct.js
import React, { useState } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../../MenuHamburguesa';

//const API_URL = "https://abarrotesapi-service-api-yacruz.cloud.okteto.net"
//const API_URL = 'http://localhost:8080';
const API_URL = 'http://ordermanager.com/';


const UpdateProduct = ({ productId }) => {
  const [nuevoNombre, setNuevoNombre] = useState('');
  // Verificar si localStorage tiene datos y asignar a userRole
  const storedUserRole = localStorage.getItem('userRole');
  console.log('Valor almacenado en localStorage:', storedUserRole);
  const userRole = storedUserRole ? JSON.parse(storedUserRole) : null;


  const handleUpdate = async () => {
    try {
      const response = await axios.put(API_URL + `/${productId}`, {
        nombre: nuevoNombre,
      });
      console.log('Producto actualizado:', response.data);
      // Puedes actualizar la lista de productos después de la actualización
    } catch (error) {
      console.error('Error al actualizar producto', error);
    }
  };

  console.log('userRole en RegistroEmp:', userRole);
  console.log('userRole.rol en RegistroEmp:', userRole && userRole.rol);

  return (
    <div>
      <MenuHamburguesa />
      {userRole && userRole.rol && (userRole.rol === "Supervisor de Ventas") ? (
        <h2>Actualizar Producto</h2>
      ) : (
        <p></p>
      )}
      {userRole && userRole.rol && (userRole.rol === "Supervisor de Ventas") ? (
        <input
          type="text"
          placeholder="Nuevo Nombre del Producto"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
      ) : (
        <p></p>
      )}
      {userRole && userRole.rol && (userRole.rol === "Supervisor de Ventas") ? (
        <button onClick={handleUpdate}>Actualizar</button>
      ) : (
        <p>No cuentas con los permisos.</p>
      )}
    </div>
  );
};

export default UpdateProduct;