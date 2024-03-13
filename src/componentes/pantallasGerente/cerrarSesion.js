import React from 'react';
import { useNavigate } from 'react-router-dom';
import './cerrarSesion.css';

const CerrarSesion = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Mostrar un mensaje de confirmación antes de cerrar sesión
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");

    if (confirmLogout) {
      // Limpiar la información de inicio de sesión almacenada en localStorage
      localStorage.removeItem('nombreEmpleado');
      localStorage.removeItem('idEmpleado');
      localStorage.removeItem('userRole');

      // Redirigir a la página de inicio de sesión
      navigate('/');
    }
    // Si el usuario cancela, no hace nada
  };

  return (
    <div>
      <button className="btn-crud btn-logout" type="button" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default CerrarSesion;