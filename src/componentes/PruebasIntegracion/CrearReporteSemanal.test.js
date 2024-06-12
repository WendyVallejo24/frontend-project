import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CrearReporteSemanal from '../pantallasGerente/crearReporteSemanal'; // Importa el componente a ser probado
import { BrowserRouter as Router } from 'react-router-dom';

describe('CrearReporteSemanal', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(axios); // Inicializa el mock adapter antes de cada prueba
        jest.clearAllMocks(); // Limpia todos los mocks de axios antes de cada prueba
    });

    afterEach(() => {
        mock.restore(); // Restaura el estado original de axios después de cada prueba
    });

    it('debe renderizar correctamente', () => {
        render(
            <Router>
                <CrearReporteSemanal />
            </Router>
        );
        // Verifica que el texto 'Crear y Actualizar Reportes Semanales' esté presente en el componente renderizado
        expect(screen.getByText('Crear y Actualizar Reportes Semanales')).toBeInTheDocument();
    });

    it('debe llamar a la API para actualizar el reporte cuando se hace clic en el botón de Actualizar', async () => {
        const reportId = '123';
        // Mockea la función axios.put para devolver una promesa resuelta con un objeto simulando una respuesta exitosa
        mock.onPut(`http://localhost:8080/api/detallesventas/actualizarReporteSemanal/${reportId}`).reply(200, { reportId });
        render(
            <Router>
                <CrearReporteSemanal />
            </Router>
        );
        // Simula un cambio en el campo de entrada del Report ID y un clic en el botón de Actualizar
        fireEvent.change(screen.getByTestId('report-id-input'), { target: { value: reportId } });
        fireEvent.click(screen.getByText(/Actualizar Reporte Semanal/i));
        // Espera a que se complete la acción de actualización y verifica que axios.put fue llamado correctamente
        await waitFor(() => {
            expect(mock.history.put.length).toBe(1);
            expect(mock.history.put[0].url).toBe(`http://localhost:8080/api/detallesventas/actualizarReporteSemanal/${reportId}`);
        });
    });

    it('debe llamar a la API para crear un nuevo reporte cuando se hace clic en el botón de Crear', async () => {
        // Mockea la función axios.post para devolver una promesa resuelta con un objeto simulando una respuesta exitosa
        mock.onPost('http://localhost:8080/api/detallesventas/crearReporteSemanal').reply(200, { reportId: '123' });
        render(
            <Router>
                <CrearReporteSemanal />
            </Router>
        );
        // Simula un clic en el botón de Crear Reporte Semanal
        fireEvent.click(screen.getByText(/Crear Reporte Semanal/i));
        // Espera a que se complete la acción de creación y verifica que axios.post fue llamado correctamente con los parámetros esperados
        await waitFor(() => {
            expect(mock.history.post.length).toBe(1); // Verifica que se haya realizado una solicitud POST
            expect(mock.history.post[0].url).toBe('http://localhost:8080/api/detallesventas/crearReporteSemanal');
            expect(JSON.parse(mock.history.post[0].data)).toEqual({
                cve: 'string',
                descripcion: 'string',
                fechaInicio: '2024-01-02',
                fechaFin: '2024-01-02',
            });
        });
    });
});
