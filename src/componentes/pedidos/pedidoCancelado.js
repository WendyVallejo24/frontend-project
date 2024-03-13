import React, { useState, useEffect } from 'react';
import MenuHamburguesa from '../MenuHamburguesa';
import '../pantallasGerente/style/catalogo.css';
import '../pantallasGerente/style/salesReport.css';
import '../Calendar.js';
import Calendar from '../Calendar.js';
import axios from 'axios';

//const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080'; 

const PedidoCancelado = () => {
    const [notasVentaCanceladas, setNotasVentaCanceladas] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [filtroEstadoPago, setFiltroEstadoPago] = useState('');
    const [departamentos, setDepartamentos] = useState([]);
    const [estadosPago, setEstadosPago] = useState([]);

    useEffect(() => {
        const fetchNotasVentaCanceladas = async () => {
            try {
                const response = await fetch(`${API_URL}/api/vista-nota-venta-pedido-cancelado`);
                const data = await response.json();
                setNotasVentaCanceladas(data);
            } catch (error) {
                console.error('Error al obtener las notas de venta canceladas:', error);
            }
        };

        const fetchDepartamentos = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/departamento`);
                setDepartamentos(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        const fetchEstadosPago = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/estadopago`);
                setEstadosPago(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchNotasVentaCanceladas();
        fetchDepartamentos();
        fetchEstadosPago();
    }, [filtroCliente, filtroFecha, filtroEstadoPago, filtroDepartamento
    ]);

    const handleFiltroClienteChange = (e) => {
        setFiltroCliente(e.target.value);
    };

    const handleFiltroFechaChange = (date) => {
        setFiltroFecha(date);
    };

    const handleFiltroEstadoPagoChange = (e) => {
        setFiltroEstadoPago(e.target.value);
    };

    const handleFiltroDepartamentoChange = (e) => {
        setFiltroDepartamento(e.target.value);
    };

    const filtrarDatos = () => {
        return notasVentaCanceladas.filter(nota => {
            const fechaNota = nota.fechaNota || '';

            return (
                nota.nombreCompletoCliente.toLowerCase().includes(filtroCliente.toLowerCase()) &&
                ((filtroFecha === null) || (filtroFecha === '' || fechaNota.includes(filtroFecha.toISOString().slice(0, 10)))) 
                && (filtroEstadoPago === '' || nota.estadoPago.toLowerCase().includes(filtroEstadoPago.toLowerCase()))
                && nota.nombreDepartamento.toLowerCase().includes(filtroDepartamento.toLowerCase())
            );
        });
    };

    return (
        <div className='registro'>
            <MenuHamburguesa />
            <h1>Pedidos Cancelados</h1>
            <h4>Filtros:</h4>
            <div className='filtro'>
                <div className='filter-container'>
                    <label>Filtrar por Cliente:</label>
                    <input className='fecha-entrega' type="text" value={filtroCliente} onChange={handleFiltroClienteChange} />
                </div>
                <div className='filter-container'>
                    <label>Filtrar por Fecha Nota:</label>
                    <Calendar
                        selectedDate={filtroFecha}
                        handleDateChange={handleFiltroFechaChange}
                    />
                </div>
                <div className='filter-container'>
                    <label>Filtrar por Estado de Pago:</label>
                    <select
                        className='rectangulos-container'
                        value={filtroEstadoPago}
                        onChange={handleFiltroEstadoPagoChange}
                    >
                        <option value="">Selecciona un estado de pago</option>
                        {estadosPago.map((estadoPago) => (
                            <option key={estadoPago.idEstadoPago} value={estadoPago.nombre}>
                                {estadoPago.nombre}
                            </option>
                        ))}
                    </select>
                    {/* <input className='fecha-entrega' type="text" value={filtroEstadoPago} onChange={handleFiltroEstadoPagoChange} /> */}
                </div>
                <div className='filter-container'>
                    <label>Filtrar por Departamento:</label>
                    <select
                        className='rectangulos-container'
                        value={filtroDepartamento}
                        onChange={handleFiltroDepartamentoChange}
                    >
                        <option value="">Selecciona un departamento</option>
                        {departamentos.map((departamento) => (
                            <option key={departamento.idDepartamento} value={departamento.nombre}>
                                {departamento.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <table>
                <thead className='encabezado'>
                    <tr>
                        <th>Nota</th>
                        <th>Fecha Anticipo</th>                        
                        <th>Estado Pago</th>
                        <th>Cliente</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Empleado</th>
                        <th>Fecha de Nota</th>
                        <th>Depto.</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrarDatos().map((nota) => (
                        <tr key={nota.numeroNota}>
                            <td>{nota.numeroNota}</td>
                            <td>{nota.fechaAnticipo}</td>                            
                            <td>{nota.estadoPago}</td>
                            <td>{nota.nombreCompletoCliente}</td>
                            <td>{nota.telefono}</td>
                            <td>{nota.direccion}</td>
                            <td>{nota.nombreCompletoEmpleado}</td>
                            <td>{nota.fechaNota}</td>
                            <td>{nota.nombreDepartamento}</td>
                            <td>{nota.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PedidoCancelado;