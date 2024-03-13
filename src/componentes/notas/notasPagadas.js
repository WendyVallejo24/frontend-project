import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../MenuHamburguesa';
import '../pantallasGerente/style/catalogo.css';
import '../pantallasGerente/style/salesReport.css';
import Calendar from '../Calendar';

//const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080'; 

const NotasPagadas = () => {
    const [data, setData] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [departamentos, setDepartamentos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/vista-nota-venta-pagada`);
                setData(response.data);
            } catch (error) {
                console.error('Error al obtener datos:', error);
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

        fetchData();
        fetchDepartamentos();
    }, [filtroCliente, filtroFecha, filtroDepartamento]);

    const handleFiltroClienteChange = (e) => {
        setFiltroCliente(e.target.value);
    };

    const handleFiltroFechaChange = (date) => {
        setFiltroFecha(date);
    };

    const handleFiltroDepartamentoChange = (e) => {
        setFiltroDepartamento(e.target.value);
    };

    const filtrarDatos = () => {
        return data.filter(item => {
            const fechaNota = item.fechaNota || ''; // Manejar el caso en que fechaNota es null
            return (
                item.nombreCompletoCliente.toLowerCase().includes(filtroCliente.toLowerCase()) &&
                ((filtroFecha === null) || (filtroFecha === '' || fechaNota.includes(filtroFecha.toISOString().slice(0, 10)))) &&
                item.nombreDepartamento.toLowerCase().includes(filtroDepartamento.toLowerCase())
            );
        });
    };

    return (
        <div className='registro'>
            <MenuHamburguesa />
            <h1>Lista de Notas de Venta Pagadas</h1>
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
                        <th>Numero Nota</th>
                        <th>Nombre Cliente</th>
                        <th>Telefono</th>
                        <th>Dirección</th>
                        <th>Nombre Vendedor</th>
                        <th>Fecha Nota</th>
                        <th>Fecha Anticipo</th>                        
                        <th>Total</th>
                        <th>Departamento</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrarDatos().map(item => (
                        <tr key={item.numeroNota}>
                            <td>{item.numeroNota}</td>
                            <td>{item.nombreCompletoCliente}</td>
                            <td>{item.telefonoCliente}</td>
                            <td>{item.direccionCliente}</td>
                            <td>{item.nombreCompletoEmpleado}</td>
                            <td>{item.fechaNota}</td>
                            <td>{item.fechaAnticipo}</td>                            
                            <td>{item.total}</td>
                            <td>{item.nombreDepartamento}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NotasPagadas;