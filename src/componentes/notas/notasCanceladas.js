import React, { useState, useEffect } from 'react';
import MenuHamburguesa from '../MenuHamburguesa';
import '../pantallasGerente/style/catalogo.css';
import '../pantallasGerente/style/salesReport.css';
import '../Calendar.js';
import Calendar from '../Calendar.js';
import axios from 'axios';

// const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080';    

const NotasCanceladas = () => {
    const [notasVentaCanceladas, setNotasVentaCanceladas] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [departamentos, setDepartamentos] = useState([]);

    useEffect(() => {
        const fetchNotasVentaCanceladas = async () => {
            try {
                const response = await fetch(`${API_URL}/api/vista-nota-venta-cancelada`);
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

        fetchNotasVentaCanceladas();
        fetchDepartamentos();
    }, [filtroCliente, filtroFecha, filtroDepartamento]);

    const handleFiltroClienteChange = (e) => {
        setFiltroCliente(e.target.value);
    };

    const handleFiltroDepartamentoChange = (e) => {
        setFiltroDepartamento(e.target.value);
    };

    const filtrarDatos = () => {
        return notasVentaCanceladas.filter(nota => {
            const fechaNota = nota.fechaNota || '';

            return (
                nota.nombreCompletoCliente.toLowerCase().includes(filtroCliente.toLowerCase()) &&
                ((filtroFecha === null) || (filtroFecha === '' || fechaNota.includes(filtroFecha.toISOString().slice(0, 10)))) &&
                nota.nombreDepartamento.toLowerCase().includes(filtroDepartamento.toLowerCase())
            );
        });
    };

    return (
        <div className='registro'>
            <MenuHamburguesa />
            <h1>Notas de Venta Canceladas</h1>
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
                        handleDateChange={(date) => setFiltroFecha(date)}
                    />
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
                        <th>Número de Nota</th>
                        <th>Fecha de Anticipo</th>                        
                        <th>Nombre Cliente</th>
                        <th>Teléfono Cliente</th>
                        <th>Dirección Cliente</th>
                        <th>Nombre Empleado</th>
                        <th>Fecha de Nota</th>
                        <th>Total</th>
                        <th>Nombre Departamento</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrarDatos().map((nota) => (
                        <tr key={nota.numeroNota}>
                            <td>{nota.numeroNota}</td>
                            <td>{nota.fechaAnticipo}</td>                            
                            <td>{nota.nombreCompletoCliente}</td>
                            <td>{nota.telefonoCliente}</td>
                            <td>{nota.direccionCliente}</td>
                            <td>{nota.nombreCompletoEmpleado}</td>
                            <td>{nota.fechaNota}</td>
                            <td>{nota.total}</td>
                            <td>{nota.nombreDepartamento}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NotasCanceladas;