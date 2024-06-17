import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../MenuHamburguesa';
import { Link } from 'react-router-dom';
import './style/registroEmp.css';
import '../pantallasGerente/style/salesReport.css';

const InformeReportes = () => {
    const [reportes, setReportes] = useState([]);
    //const URL_API = "https://abarrotesapi-service-api-yacruz.cloud.okteto.net/";

    //const URL_API = 'http://localhost:8080/';
    const URL_API = 'http://ordermanager.com/';


    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await axios.get(URL_API + 'api/reportes');
                setReportes(response.data);
            } catch (error) {
                console.error('Error al obtener los reportes:', error);
            }
        };

        fetchReportes();
    }, []);
    const fetchReporteByCve = async (cve) => {
        try {
            const response = await axios.get(URL_API + `api/reportes/byCve/${cve}`);
            setReportes(response.data);
        } catch (error) {
            console.error(`Error al obtener el detalle del reporte con CVE ${cve}:`, error);
        }
    };

    const handleCveInputChange = (event) => {
        const cve = event.target.value;
        fetchReporteByCve(cve);
    };


    return (
        <div className="registro">
            <MenuHamburguesa />
            <h1 className='responsive-title'>Reportes</h1>
            <div style={{ textAlign: 'center' }}>
                <label htmlFor="cveInput">Buscar por CVE: </label>
                <input className='producto' type="text" id="cveInput" onChange={handleCveInputChange} />
            </div>

            <br />
            <div className="table-container">
                <table>
                    <thead className='encabezado'>
                        <tr >
                            <th>ID</th>
                            <th>CVE</th>
                            <th>Descripción</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportes.map((reporte) => (
                            <tr key={reporte.idReporte}>
                                <td>{reporte.idReporte}</td>
                                <td>{reporte.cve}</td>
                                <td>{reporte.descripcion}</td>
                                <td>
                                    <Link to={`/detalleReporte/${reporte.idReporte}`}>Ver Detalles</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InformeReportes;
