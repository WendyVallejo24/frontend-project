import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
    <div className="logout-container">
      <button className="btn-crud btn-logout" type="button" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} size="2x" /> {/* Icono de logout */}
        Logout
      </button>
    </div>
  );
};

export default CerrarSesion;