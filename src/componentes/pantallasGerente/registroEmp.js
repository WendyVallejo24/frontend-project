import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './style/registroEmp.css';
import '../pantallasGerente/style/salesReport.css';
import MenuHamburguesa from '../MenuHamburguesa';

//const URL_API = "https://abarrotesapi-service-api-yacruz.cloud.okteto.net/"
const URL_API = 'http://localhost:8080/';

const RegistroEmp = () => {
    const [empleados, setEmpleados] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Verificar si localStorage tiene datos y asignar a userRole
    const storedUserRole = localStorage.getItem('userRole');
    console.log('Valor almacenado en localStorage:', storedUserRole);
    const userRole = storedUserRole ? JSON.parse(storedUserRole) : null;

    useEffect(() => {
        const obtenerEmpleados = async () => {
            try {
                const response = await fetch(URL_API + "api/empleados", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setEmpleados(data);
                    console.log("Empleados: ", data);
                } else {
                    console.error('Error en la solicitud:', response.statusText);
                    navigate('/ventas');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        obtenerEmpleados();
    }, [navigate]);

    console.log('userRole en RegistroEmp:', userRole);
    console.log('userRole.rol en RegistroEmp:', userRole && userRole.rol);
    console.log('¿Supervisor de Ventas?', userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas"));

    return (
        <div className="registro">
            <MenuHamburguesa />
            {userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas") ? (
                <h1 className='responsive-title'>Registro de empleados</h1>
            ) : (
                <p></p>
            )}

            {userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas") ? (


                <div className="botones">
                    <Link to="/agregarEmpleado"><button className="btn-crud">Agregar Empleado</button></Link>
                    <Link to="/eliminarEmpleado"><button className="btn-crud-1">Eliminar Empleado</button></Link>
                </div>
            ) : (
                <p></p>
            )}

            {userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas") ? (

                <div className="table-container"> {/* Nuevo div que envuelve la tabla */}
                    <table className="registrosEmp">
                        <thead className='encabezado'>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>Correo Electrónico</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map(empleado => (
                                <tr key={empleado.idEmpleado}>
                                    <td>{empleado.idEmpleado}</td>
                                    <td>{empleado.nombre}</td>
                                    <td>{empleado.apellidos}</td>
                                    <td>{empleado.correoElectronico}</td>
                                    <td>{empleado.roles}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No cuentas con los permisos.</p>
            )}
        </div>
    );
};

export default RegistroEmp;
