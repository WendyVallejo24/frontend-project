import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/registroEmp.css';
import MenuHamburguesa from '../MenuHamburguesa';
import { URL_API } from '../../config';

const CrearReporteMensual = () => {
    const [reportId, setReportId] = useState('');  // State to hold the report ID
    const [userRole, setUserRole] = useState({});

    // Method to update the report
    const handleUpdateClick = async () => {
        try {
            const response = await axios.put(URL_API + `api/detallesventas/actualizarReporteMensual/${reportId}`);

            if (response.status === 200) {
                const data = response.data;
                console.log('Reporte actualizado:', data);
                alert('Reporte actualizado con éxito');
            } else {
                console.error('Error al actualizar el reporte:', response.statusText);
                alert("Error al actualizar el reporte");
            }
        } catch (error) {
            console.error('Error de red:', error.message);
            alert(`Error de red: ${error.message}`);
        }
    };

    // Method to create a new report
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
                alert('Reporte creado con éxito');
            } else {
                console.error('Error al crear el reporte');
                alert('Error al crear el reporte');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert(`Error de red: ${error.message}`);
        }
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
        <div style={{ textAlign: 'center' }} className="registro">
            {userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas") ? (
                <h1>Crear y Actualizar Reportes Mensuales</h1>
            ) : (
                <p> </p>
            )}
            <MenuHamburguesa />

            <label htmlFor="report-id">Report ID: </label><input id="report-id" className="producto" type="text" value={reportId} onChange={(e) => setReportId(e.target.value)} />

            <br /><br />
            {userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas") ? (

                <button type="button" className="btn-crud" onClick={handleUpdateClick} data-testid="actualizar-reporte-semanal-button">
                    Actualizar Reporte Mensual
                </button>
            ) : (
                <p>No cuentas con los permisos.</p>
            )}
            {userRole && userRole.rol && userRole.rol.includes("Supervisor de Ventas") ? (
                <button type="button" className="btn-crud" onClick={handleCreateClick}>
                    Crear Reporte Mensual
                </button>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default CrearReporteMensual;
