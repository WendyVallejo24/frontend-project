import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/registroEmp.css';
import MenuHamburguesa from '../MenuHamburguesa';

const CrearReporteMensual = () => {
    const [reportId, setReportId] = useState('');
    const [userRole, setUserRole] = useState({});
    const URL_API = 'http://localhost:8080/';

    const handleUpdateClick = async () => {
        try {
            const response = await axios.put(URL_API + `api/detallesventas/actualizarReporteMensual/${reportId}`);

            if (response.status === 200) {
                const data = response.data;
                console.log('Reporte actualizado:', data);
            } else {
                console.error('Error al actualizar el reporte:', response.statusText);
            }
        } catch (error) {
            console.error('Error de red:', error.message);
        }
    };

    const handleCreateClick = async () => {
        try {
            const response = await fetch(URL_API + 'api/detallesventas/crearReporteMensual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cve: 'string',
                    descripcion: 'string',
                    fechaInicio: '2024-01-02',
                    fechaFin: '2024-01-02',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Reporte creado:', data);
            } else {
                console.error('Error al crear el reporte');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const parsedRole = storedRole ? JSON.parse(storedRole) : null;
        setUserRole(parsedRole);
    }, []);

    return (
        <div style={{ textAlign: 'center' }} className="registro">
            <h1>Crear y Actualizar Reportes Mensuales</h1>
            <MenuHamburguesa />
            <label htmlFor="reportId">Report ID: </label>
            <input
                id="reportId"
                className="producto"
                type="text"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
            />
            <br /><br />
            <button className="btn-crud" onClick={handleUpdateClick}>
                Actualizar Reporte Mensual
            </button>
            <button className="btn-crud" onClick={handleCreateClick}>
                Crear Reporte Mensual
            </button>
        </div>
    );
};

export default CrearReporteMensual;