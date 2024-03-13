import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../MenuHamburguesa';
import '../pantallasGerente/style/catalogo.css';
import '../pantallasGerente/style/salesReport.css';

//const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080'; 

const NotasPendientes = () => {
    const [notasVentaPendientes, setNotasVentaPendientes] = useState([]);
    const [filtroNombreCliente, setFiltroNombreCliente] = useState('');
    const [notasFiltradas, setNotasFiltradas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [abonoAmount, setAbonoAmount] = useState(0);
    const [selectedNota, setSelectedNota] = useState(null);
    const [departamentos, setDepartamentos] = useState([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState('');

    useEffect(() => {
        fetchNotasVentaPendientes();
        fetchDepartamentos();
    }, []);

    const fetchDepartamentos = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/departamento`);
            setDepartamentos(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchNotasVentaPendientes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/vista-nota-venta-pendiente`);
            const data = await response.json();
            setNotasVentaPendientes(data);
            setNotasFiltradas(data);
        } catch (error) {
            console.error('Error al obtener las notas de venta pendientes:', error);
        }
    };

    const applyFilters = () => {
        const notasFiltradas = notasVentaPendientes.filter(
            (nota) =>
                nota.nombreCompletoCliente.toLowerCase().includes(filtroNombreCliente.toLowerCase()) &&
                (selectedDepartamento === '' || nota.nombreDepartamento.toLowerCase() === selectedDepartamento.toLowerCase())
        );
        setNotasFiltradas(notasFiltradas);
    };

    useEffect(() => {
        applyFilters();
    }, [filtroNombreCliente, selectedDepartamento]);

    const handleAbonar = (nota) => {
        if (nota.resto <= 0) {
            console.error('La nota ya se encuentra pagada.');
            alert('La nota ya se encuentra pagada.');
            return;
        }
        setSelectedNota(nota);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleConfirmAbono = async () => {
        try {
            if (!selectedNota) {
                alert('No se ha seleccionado una nota para abonar.');
                return;
            }

            if (!abonoAmount || abonoAmount <= 0) {
                alert('La cantidad de abono debe ser un número positivo.');
                return;
            }

            const abonarNota = {
                nNota: parseInt(selectedNota.numeroNota),
                pago: parseFloat(abonoAmount),
            };

            const response = await axios.post(`${API_URL}/api/notasventas/pagarnota`, abonarNota);
            console.log(response.data);
            console.log(`Abono de: ${abonoAmount}`);
            alert(`Abono de: ${abonoAmount}`);
            setShowModal(false);
            fetchNotasVentaPendientes();

        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    return (
        <div className='registro'>
            <MenuHamburguesa />
            <h1 className='titulos'>Notas de Venta Pendientes</h1>
            <div className='btns'>
                <h4>Buscar nota:</h4>
                <input
                    className='input-producto'
                    type="text"
                    placeholder="Nombre del cliente"
                    value={filtroNombreCliente}
                    onChange={(e) => setFiltroNombreCliente(e.target.value)}
                />
                <select
                    className='select-producto'
                    value={selectedDepartamento}
                    onChange={(e) => setSelectedDepartamento(e.target.value)}
                >
                    <option value="">Selecciona un departamento</option>
                    {departamentos.map((departamento) => (
                        <option key={departamento.idDepartamento} value={departamento.nombre}>
                            {departamento.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="rectangulos-container">
                {notasFiltradas.map((nota) => (
                    <div key={nota.numeroNota} className="rectangulo">
                        <div className="rectangulo-header" style={{ backgroundColor: '#f6f6f6' }}>
                            <div className='r-1'>
                                <p><b>Número de Nota: </b>{nota.numeroNota}</p>
                                <p><b>Fecha de Nota: </b>{nota.fechaNota}</p>
                            </div>
                            <div className='r-2'>
                                <p><b>Nombre Empleado: </b>{nota.nombreCompletoEmpleado}</p>
                            </div>
                        </div>

                        <div className="rectangulo-header" style={{ backgroundColor: '#eee' }}>
                            <div className='r2'>
                                <b>Datos Cliente:</b>
                            </div>
                            <div className='r-1'>
                                <p><b>Nombre: </b>{nota.nombreCompletoCliente}</p>
                                <p><b>Teléfono: </b>{nota.telefonoCliente}</p>
                            </div>
                            <div className='r-2'>
                                <p><b>Dirección: </b>{nota.direccionCliente}</p>
                            </div>
                        </div>

                        <div className="rectangulo-header" style={{ backgroundColor: '#ddd' }}>
                            <div className='r-1'>
                                <p><b>Total: </b>{nota.total}</p>
                                <p><b>Abonado: </b>{nota.monto}</p>
                                <p><b>Debe: </b>{nota.resto}</p>
                            </div>
                            <div className='r-2'>
                                <p><b>Estado de Pago: </b>{nota.estadoPago}</p>
                                <p><b>Ultimo anticipo: </b>{nota.fechaAnticipo}</p>
                                <p><b>Departamento: </b>{nota.nombreDepartamento}</p>
                            </div>
                        </div>

                        <div className="rectangulo-header" style={{ backgroundColor: '#d6d6d6' }}>
                            <div className='btn'>
                                <button onClick={() => handleAbonar(nota)} className='btn-finalizar'>Abonar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Ventana emergente para el abono */}
            {showModal && (
                <div className="Overlay">
                    <div className="Modal">
                        <span className="close" onClick={handleModalClose}>
                            &times;
                        </span>
                        <h2>Abonar</h2>
                        <p>Introduce la cantidad de dinero a abonar:</p>
                        <input
                            className='input-producto'
                            type="number"
                            value={abonoAmount}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                if (/^[0-9]*$/.test(inputValue)) {
                                    setAbonoAmount(inputValue);
                                }
                            }}
                        />
                        <div className='botones'>
                            <button className='btn-finalizar' onClick={handleConfirmAbono}>Confirmar Abono</button>
                            <button className='btn-finalizar' onClick={handleModalClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotasPendientes;