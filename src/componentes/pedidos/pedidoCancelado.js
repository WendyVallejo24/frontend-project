import React, { useState, useEffect } from 'react';
import MenuHamburguesa from '../MenuHamburguesa';
import '../pantallasGerente/style/catalogo.css';
import '../pantallasGerente/style/salesReport.css';
import '../Calendar.js';
import Calendar from '../Calendar.js';
import { URL_API } from '../../config';
//import axios from 'axios';

const PedidoCancelado = () => {
    const [notasVentaCanceladas, setNotasVentaCanceladas] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    
    useEffect(() => {
        const fetchNotasVentaCanceladas = async () => {
            try {
                const response = await fetch(`${URL_API}api/vista-nota-venta-pedido-cancelado`);
                const data = await response.json();
                setNotasVentaCanceladas(data);
            } catch (error) {
                console.error('Error al obtener las notas de venta canceladas:', error);
            }
        };

        fetchNotasVentaCanceladas();
    }, [filtroCliente, filtroFecha,
    ]);

    const handleFiltroClienteChange = (e) => {
        setFiltroCliente(e.target.value);
    };

    const handleFiltroFechaChange = (date) => {
        setFiltroFecha(date);
    };

    const filtrarDatos = () => {
        return notasVentaCanceladas.filter(nota => {
            const fechaNota = nota.fechaNota || '';

            return (
                nota.nombreCompletoCliente.toLowerCase().includes(filtroCliente.toLowerCase()) &&
                ((filtroFecha === null) || (filtroFecha === '' || fechaNota.includes(filtroFecha.toISOString().slice(0, 10))))
            );
        });
    };

    const [userRole,  setUserRole] = useState({});
    useEffect(() => {
        // Modificación 2: Parsear el rol al cargar el componente
        const storedRole = localStorage.getItem('userRole');

        const parsedRole = storedRole ? JSON.parse(storedRole) : null;

        setUserRole(parsedRole);
    }, []);
    
    return (
        <div className='registro'>
            <MenuHamburguesa />
            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                <h1 className='responsive-title'>Pedidos Cancelados</h1>
            ) : (
                <p> </p>
            )}

            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                <div className='filtro'>
                    <div className='filter-container'>
                        <label>Filtrar por Cliente:</label>
                        <input className='fecha-entrega' type="text" placeholder="Nombre cliente" value={filtroCliente} onChange={handleFiltroClienteChange} />
                    </div>
                    <div className='filter-container'>
                        <label>Filtrar por Fecha Nota:</label>
                        <Calendar
                            selectedDate={filtroFecha}
                            handleDateChange={handleFiltroFechaChange}
                        />
                    </div>
                </div>
            ) : (
                <p> </p>
            )}

            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (

                <div className="table-container"> {/* Nuevo div que envuelve la tabla */}
                    <table className="tabla">
                        <thead className='encabezado'>
                            <tr>
                                <th>Nota</th>
                                <th>Fecha Anticipo</th>
                                <th>Cliente</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>Empleado</th>
                                <th>Fecha de Nota</th>
                                <th>Estado Pedido</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrarDatos().map((nota) => (
                                <tr key={nota.numeroNota}>
                                    <td>{nota.numeroNota}</td>
                                    <td>{nota.fechaAnticipo}</td>
                                    <td>{nota.nombreCompletoCliente}</td>
                                    <td>{nota.telefono}</td>
                                    <td>{nota.direccion}</td>
                                    <td>{nota.nombreCompletoEmpleado}</td>
                                    <td>{nota.fechaNota}</td>
                                    <td>{nota.estado}</td>
                                    <td>{nota.total}</td>
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

export default PedidoCancelado;