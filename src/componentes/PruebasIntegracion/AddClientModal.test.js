import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter
import AddClientModal from '../AddClientModal';

// Mockear axios para simular las peticiones HTTP
jest.mock('axios');

describe('AddClientModal component', () => {
    // Definir funciones simuladas para los props
    const setCliente = jest.fn();
    const setClienteSeleccionado = jest.fn();
    const setClienteCreado = jest.fn();
    const onClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar todos los mocks antes de cada prueba
    });

    it('renders correctly', () => {
        render(
            <Router> {/* Envuelve el componente en el enrutador */}
                <AddClientModal 
                    onClose={onClose} 
                    setCliente={setCliente} 
                    setClienteSeleccionado={setClienteSeleccionado} 
                    setClienteCreado={setClienteCreado} 
                />
            </Router>
        );
        // Verificar que los elementos esperados se rendericen correctamente
        expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Apellidos')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Teléfono')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Dirección')).toBeInTheDocument();
        expect(screen.getByText('Nuevo Cliente')).toBeInTheDocument();
        expect(screen.getByText('Guardar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('handles input changes correctly', () => {
        render(
            <Router> {/* Envuelve el componente en el enrutador */}
                <AddClientModal 
                    onClose={onClose} 
                    setCliente={setCliente} 
                    setClienteSeleccionado={setClienteSeleccionado} 
                    setClienteCreado={setClienteCreado} 
                />
            </Router>
        );
        // Obtener los inputs del formulario por su placeholder
        const nombreInput = screen.getByPlaceholderText('Nombre');
        const apellidosInput = screen.getByPlaceholderText('Apellidos');
        const telefonoInput = screen.getByPlaceholderText('Teléfono');
        const direccionInput = screen.getByPlaceholderText('Dirección');

        // Simular cambios de entrada en los inputs
        fireEvent.change(nombreInput, { target: { value: 'John' } });
        fireEvent.change(apellidosInput, { target: { value: 'Doe' } });
        fireEvent.change(telefonoInput, { target: { value: '1234567890' } });
        fireEvent.change(direccionInput, { target: { value: '123 Main St' } });

        // Verificar que los valores de los inputs se actualicen correctamente
        expect(nombreInput.value).toBe('John');
        expect(apellidosInput.value).toBe('Doe');
        expect(telefonoInput.value).toBe('1234567890');
        expect(direccionInput.value).toBe('123 Main St');
    });
});
