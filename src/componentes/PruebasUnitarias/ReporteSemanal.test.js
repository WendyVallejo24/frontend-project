import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import CrearReporteSemanal from '../pantallasGerente/crearReporteSemanal';

// Mock de axios
jest.mock('axios');

describe('CrearReporteSemanal', () => {
  // Prueba para el caso en que el usuario tenga el rol de Supervisor de Ventas
  test('permite la creación de un reporte para un usuario con el rol de Supervisor de Ventas', async () => {
    // Simulamos un usuario con el rol de Supervisor de Ventas
    const userRole = { rol: 'Supervisor de Ventas' };
    // Mock de localStorage para devolver el rol de usuario
    jest.spyOn(window.localStorage, 'getItem').mockReturnValue(JSON.stringify(userRole));

    render(
      <MemoryRouter>
        <CrearReporteSemanal />
      </MemoryRouter>
    );

    // Simulamos hacer clic en el botón "Crear Reporte Semanal"
    fireEvent.click(screen.getByText(/Crear Reporte Semanal/));

    try {
      // Esperamos a que se realice la solicitud HTTP
      await waitFor(() => expect(axios.post).toHaveBeenCalled());
    } catch (error) {
      console.error('Error al esperar la solicitud HTTP:', error);
    }

    // Verificamos que se muestre el mensaje de éxito después de crear el reporte
    expect(screen.getByText('Reporte creado con éxito')).toBeInTheDocument();
  });

  test('actualiza el reporte correctamente', async () => {
    // Simulamos un usuario con el rol de Supervisor de Ventas
    const userRole = { rol: 'Supervisor de Ventas' };
    // Mock de localStorage para devolver el rol de usuario
    jest.spyOn(window.localStorage, 'getItem').mockReturnValue(JSON.stringify(userRole));

    // Simulamos una respuesta exitosa al actualizar el reporte
    axios.put.mockResolvedValue({ status: 200, data: { mensaje: 'Reporte actualizado' } });

    render(
      <MemoryRouter>
        <CrearReporteSemanal />
      </MemoryRouter>
    );

    // Simulamos el ingreso de un ID de reporte
    const reportIdInput = screen.getByLabelText('Report ID:');
    fireEvent.change(reportIdInput, { target: { value: '12345' } });

    // Simulamos hacer clic en el botón "Actualizar Reporte Semanal"
    fireEvent.click(screen.getByTestId('actualizar-reporte-semanal-button'));

    // Esperamos a que se realice la solicitud HTTP
    await waitFor(() => expect(axios.put).toHaveBeenCalled());

    // Verificamos que se muestre el mensaje de éxito después de actualizar el reporte
    expect(screen.getByText('Reporte actualizado con éxito')).toBeInTheDocument();
  });

});
