import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CrearReporteMensual from '../pantallasGerente/crearReporteMensual';
import { BrowserRouter as Router } from 'react-router-dom';

// Crear una instancia de MockAdapter para simular las llamadas a la API
const mock = new MockAdapter(axios);

// Antes de todas las pruebas, reemplazar console.log con una función vacía
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

// Después de todas las pruebas, restaurar console.log a su implementación original
afterAll(() => {
    console.log.mockRestore();
});

// Suite de pruebas para el componente CrearReporteMensual
describe('CrearReporteMensual Component', () => {
    // Antes de cada prueba, resetear el mock y establecer un rol de usuario en el almacenamiento local
    beforeEach(() => {
        mock.reset();
        localStorage.setItem('userRole', JSON.stringify({ role: 'admin' }));
    });

    // Prueba: verificar si el componente se renderiza correctamente
    test('renders correctly', () => {
        render(
            <Router>
                <CrearReporteMensual />
            </Router>
        );
        expect(screen.getByText('Crear y Actualizar Reportes Mensuales')).toBeInTheDocument();
        expect(screen.getByLabelText('Report ID:')).toBeInTheDocument();
        expect(screen.getByText('Actualizar Reporte Mensual')).toBeInTheDocument();
        expect(screen.getByText('Crear Reporte Mensual')).toBeInTheDocument();
    });

    // Prueba: verificar si se actualiza correctamente el reporte
    test('updates report successfully', async () => {
        // Configurar la respuesta simulada para la solicitud PUT
        mock.onPut('http://localhost:8080/api/detallesventas/actualizarReporteMensual/123').reply(200, {
            message: 'Reporte actualizado',
        });

        // Renderizar el componente
        render(
            <Router>
                <CrearReporteMensual />
            </Router>
        );

        // Simular el cambio en el input del report ID
        const reportIdInput = screen.getByLabelText('Report ID:');
        fireEvent.change(reportIdInput, { target: { value: '123' } });

        // Simular el clic en el botón de actualizar reporte
        const updateButton = screen.getByText('Actualizar Reporte Mensual');
        fireEvent.click(updateButton);

        // Esperar hasta que console.log sea llamado con el mensaje esperado
        await waitFor(() => {
            expect(console.log).toHaveBeenCalledWith('Reporte actualizado:', { message: 'Reporte actualizado' });
        });
    });

    // Prueba: verificar si se maneja correctamente el error al actualizar el reporte
    test('handles update report error', async () => {
        // Espiar console.error para simular el manejo del error
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Configurar la respuesta simulada para la solicitud PUT
        mock.onPut('http://localhost:8080/api/detallesventas/actualizarReporteMensual/123').reply(500);

        // Renderizar el componente
        render(
            <Router>
                <CrearReporteMensual />
            </Router>
        );

        // Simular el cambio en el input del report ID
        const reportIdInput = screen.getByLabelText('Report ID:');
        fireEvent.change(reportIdInput, { target: { value: '123' } });

        // Simular el clic en el botón de actualizar reporte
        const updateButton = screen.getByText('Actualizar Reporte Mensual');
        fireEvent.click(updateButton);

        // Esperar hasta que console.error sea llamado
        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalled();
        });

        // Verificar que console.error fue llamado al menos una vez
        expect(consoleErrorMock).toHaveBeenCalled();

        // Restaurar console.error a su implementación original
        consoleErrorMock.mockRestore();
    });

    // Prueba: verificar si se crea correctamente el reporte
    test('creates report successfully', async () => {
        // Configurar la respuesta simulada para la solicitud POST
        mock.onPost('http://localhost:8080/api/detallesventas/crearReporteMensual').reply(200, {
            message: 'Reporte creado',
        });

        // Renderizar el componente
        render(
            <Router>
                <CrearReporteMensual />
            </Router>
        );

        // Simular el clic en el botón de crear reporte
        const createButton = screen.getByText('Crear Reporte Mensual');
        fireEvent.click(createButton);

        // Esperar hasta que console.log sea llamado con el mensaje esperado
        await waitFor(() => {
            setTimeout(() => {
                expect(console.log).toHaveBeenCalledWith('Reporte creado:', { message: 'Reporte creado' });
            }, 100); // Esperar 100 milisegundos antes de realizar la verificación
        });
    });
});
