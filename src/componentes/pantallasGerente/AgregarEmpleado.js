import './style/AgregarEmpleado.css';
import MenuHamburguesa from '../MenuHamburguesa';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { URL_API } from '../../config';

const AgregarEmpleado = () => {

    const [empleado, setEmpleado] = useState({
        nombre: '',
        apellidos: '',
        contrasenia: '',
        correoElectronico: '',
        idRol: ''
    });

    const [userRole, setUserRole] = useState({});
    //const URL_API = "https://abarrotesapi-service-api-yacruz.cloud.okteto.net/";
    //const URL_API = 'http://localhost:8080/api/empleados/crearConDTO';
    const API_URL = `${URL_API}api/empleados/crearConDTO`;


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmpleado({ ...empleado, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Antes de la llamada a fetch:', empleado);
            const response = await axios.post(API_URL, empleado);
            console.log('Después de la llamada a fetch:', response);

            if (response.status === 201) { // Verifica si la respuesta tiene un estado 200
                console.log('Empleado agregado correctamente');
                window.alert('Empleado registrado correctamente');
                // limpiar los input
                setEmpleado({
                    nombre: '',
                    apellidos: '',
                    contrasenia: '',
                    correoElectronico: '',
                    idRol: ''
                });
            } else {
                console.error('Error al agregar el empleado:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
        console.log('userRole en AgregarEmpleado:', userRole);
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
        <div className="contenedor">
            <MenuHamburguesa />
            {userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas") ? (
                <h1>Agregar Empleado</h1>
            ) : (
                <p></p>
            )}
            <Link to="/registroEmpleado">Volver al Registro de Empleados</Link><br /><br />
            {userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas") ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            className="datos"
                            name="nombre"
                            placeholder='Nombre'
                            data-testid="nombre-input"
                            value={empleado.nombre}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Apellidos:
                        <input
                            type="text"
                            className="datos"
                            name="apellidos"
                            placeholder='Apellidos'
                            data-testid="apellidos-input"
                            value={empleado.apellidos}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Correo Electrónico:
                        <input
                            type="email"
                            className="datos"
                            name="correoElectronico"
                            placeholder='Correo Electrónico'
                            data-testid="correo-input"
                            value={empleado.correoElectronico}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Contraseña:
                        <input
                            type="password"
                            className="datos"
                            name="contrasenia"
                            placeholder='Contraseña'
                            data-testid="contrasenia-input"
                            value={empleado.contrasenia}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Rol:
                        <select className='select-empleado'
                            //className="datos"
                            name="idRol"
                            data-testid="idRol-input"
                            value={empleado.idRol}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecciona un rol</option>
                            <option value="2">Supervisor de Ventas</option>
                            <option value="1">Vendedor</option>
                        </select>
                    </label>
                    <br />
                    <button type='submit' className='confirmar'>Confirmar</button>
                </form>
            ) : (
                <p>No cuentas con los permisos.</p>
            )}
        </div>
    );
};

export default AgregarEmpleado;