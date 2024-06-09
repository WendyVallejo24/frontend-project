import React, { useState, useEffect } from 'react';
import MenuHamburguesa from '../MenuHamburguesa';
import '../pantallasGerente/style/catalogo.css';
import '../pantallasGerente/style/salesReport.css';
import '../Calendar.js'; // Asegúrate de importar el componente Calendar si es necesario
import Calendar from '../Calendar.js';
import axios from 'axios';

//const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080';

const PedidoEntregado = () => {
    const [notasVentaPedidoEntregado, setNotasVentaPedidoEntregado] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroEstadoPago, setFiltroEstadoPago] = useState('');
    const [estadosPago, setEstadosPago] = useState([]);

    useEffect(() => {
        const fetchNotasVentaPedidoEntregado = async () => {
            try {
                const response = await fetch(`${API_URL}/api/vista-nota-venta-pedido-entregado`);
                const data = await response.json();
                setNotasVentaPedidoEntregado(data);
            } catch (error) {
                console.error('Error al obtener las notas de venta pedido entregado:', error);
            }
        };

        const fetchEstadosPago = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/estadopago`);
                setEstadosPago(response.data);
                console.log('Estados de Pago:', response.data); // Agrega esta línea para depurar
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchNotasVentaPedidoEntregado();
        fetchEstadosPago();
    }, [filtroCliente, filtroFecha, filtroEstadoPago
    ]);

    const handleFiltroClienteChange = (e) => {
        setFiltroCliente(e.target.value);
    };

    const handleFiltroFechaChange = (date) => {
        setFiltroFecha(date);
    };

    const handleFiltroEstadoPagoChange = (e) => {
        setFiltroEstadoPago(e.target.value);
        console.log('Estado de Pago:', e.target.value); // Agrega esta línea para depurar
    };

    const filtrarDatos = () => {
        return notasVentaPedidoEntregado.filter(nota => {
            const fechaNota = nota.fechaNota || '';

            return (
                nota.nombreCompletoCliente.toLowerCase().includes(filtroCliente.toLowerCase()) &&
                ((filtroFecha === null) || (filtroFecha === '' || fechaNota.includes(filtroFecha.toISOString().slice(0, 10)))) &&
                (filtroEstadoPago === '' || nota.estadoPago.toLowerCase().includes(filtroEstadoPago.toLowerCase()))
            );
        });
    };

    const [userRole, setUserRole] = useState({});

    useEffect(() => {
        // Modificación 2: Parsear el rol al cargar el componente
        const storedRole = localStorage.getItem('userRole');
        console.log('Stored Role:', storedRole);

        const parsedRole = storedRole ? JSON.parse(storedRole) : null;
        console.log('Parsed Role:', parsedRole);

        setUserRole(parsedRole);
        console.log('User Role:', userRole);
    }, []);


    return (
        <div className='contenedor-pedidos-entregados'>
            <MenuHamburguesa />
            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                <h1 className='responsive-title'>Pedidos Entregados</h1>
            ) : (
                <p> </p>
            )}
            <div className='filtro' style={{ textAlign: 'center' }}>
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                    <div className='filter-container'>
                        <label>Filtrar por Cliente:</label>
                        <input
                            className='fecha-entrega'
                            type="text"
                            placeholder='Nombre cliente'
                            value={filtroCliente}
                            onChange={handleFiltroClienteChange} />
                    </div>
                ) : (
                    <p> </p>
                )}
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                    <div className='filter-container'>
                        <label>Filtrar por Fecha Nota:</label>
                        <Calendar
                            selectedDate={filtroFecha}
                            handleDateChange={handleFiltroFechaChange}
                        />
                    </div>
                ) : (
                    <p>No cuentas con los permisos.</p>
                )}
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                    <div className='filter-container'>
                        <label>Filtrar por Estado de Pago:</label>
                        <select
                            value={filtroEstadoPago}
                            onChange={handleFiltroEstadoPagoChange}
                            style={{ width: '200px', marginLeft: 'auto', marginRight: 'auto' }}>
                            {/* Establece un ancho fijo y centra el select */}
                            <option value="">Selecciona un estado de pago</option>
                            {estadosPago.map((estadoPago) => (
                                <option key={estadoPago.idEstadoPago} value={estadoPago.nombre}>
                                    {estadoPago.nombre}
                                </option>
                            ))}
                        </select>
                        {/* <input className='fecha-entrega' type="text" value={filtroEstadoPago} onChange={handleFiltroEstadoPagoChange} /> */}
                    </div>
                ) : (
                    <p> </p>
                )}


            </div>
            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                <div className="table-container"> {/* Nuevo div que envuelve la tabla */}
                    <table className="tabla">
                        <thead className='encabezado'>
                            <tr>
                                <th>Nota</th>
                                <th>Fecha Anticipo</th>
                                <th>Monto</th>
                                <th>Resto</th>
                                <th>Cliente</th>
                                <th>Telefono</th>
                                <th>Dirección</th>
                                <th>Empleado</th>
                                <th>Fecha Nota</th>
                                <th>Estado de Pago</th>
                                <th>Estado Pedido</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrarDatos().map((nota) => (
                                <tr key={nota.numeroNota}>
                                    <td>{nota.numeroNota}</td>
                                    <td>{nota.fechaAnticipo}</td>
                                    <td>{nota.monto}</td>
                                    <td>{nota.resto}</td>
                                    <td>{nota.nombreCompletoCliente}</td>
                                    <td>{nota.telefono}</td>
                                    <td>{nota.direccion}</td>
                                    <td>{nota.nombreCompletoEmpleado}</td>
                                    <td>{nota.fechaNota}</td>
                                    <td>{nota.estadoPago}</td>
                                    <td>{nota.estado}</td>
                                    <td>{nota.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p></p>
            )}
        </div >
    );
};

export default PedidoEntregado;
