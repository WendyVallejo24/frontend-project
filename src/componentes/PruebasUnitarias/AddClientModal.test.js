import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddClientModal from '../AddClientModal';
import axios from 'axios';

describe('AddClientModal', () => {

    test('renders correctly with initial state', () => {
        const { getByPlaceholderText, getByText } = render(
            <MemoryRouter>
                <AddClientModal />
            </MemoryRouter>
        );
        expect(getByPlaceholderText('Nombre')).toBeInTheDocument();
        expect(getByPlaceholderText('Apellidos')).toBeInTheDocument();
        expect(getByPlaceholderText('Teléfono')).toBeInTheDocument();
        expect(getByPlaceholderText('Dirección')).toBeInTheDocument();
        expect(getByText('Guardar')).toBeInTheDocument();
        expect(getByText('Cancelar')).toBeInTheDocument();
    });

    test('adds a new client successfully', async () => {


        const onCloseMock = jest.fn(); // Función mock para onClose
        const setClienteMock = jest.fn(); // Función mock para setCliente
        const setClienteSeleccionadoMock = jest.fn(); // Función mock para setClienteSeleccionado
        const setClienteCreadoMock = jest.fn(); // Función mock para setClienteCreado

        // Simula la petición POST al crear un cliente
        axios.post = jest.fn().mockResolvedValueOnce({ data: { idCliente: 1 } });

        const { getByText, getByPlaceholderText } = render(
            <MemoryRouter>
                <AddClientModal
                    onClose={onCloseMock}
                    setCliente={setClienteMock}
                    setClienteSeleccionado={setClienteSeleccionadoMock}
                    setClienteCreado={setClienteCreadoMock}
                />
            </MemoryRouter>
        );

        // Espera a que el botón de guardar cliente se renderice
        await waitFor(() => {
            expect(getByText('Guardar')).toBeInTheDocument();
        });

        // Simula entrada de datos en los campos del cliente
        const nombreInput = getByPlaceholderText('Nombre');
        const apellidosInput = getByPlaceholderText('Apellidos');
        const telefonoInput = getByPlaceholderText('Teléfono');
        const direccionInput = getByPlaceholderText('Dirección');

        fireEvent.change(nombreInput, { target: { value: 'John' } });
        fireEvent.change(apellidosInput, { target: { value: 'Doe' } });
        fireEvent.change(telefonoInput, { target: { value: '1234567890' } });
        fireEvent.change(direccionInput, { target: { value: '123 Main St' } });

        // Simula clic en el botón de guardar cliente
        fireEvent.click(getByText('Guardar'));

        // Espera a que se complete la petición POST
        await waitFor(() => {
            // Verifica que se haya llamado a la función de cerrar modal
            expect(onCloseMock).toHaveBeenCalled();
            // Verifica que se haya llamado a la función para obtener los clientes
            expect(setClienteMock).toHaveBeenCalled();
            // Verifica que se haya llamado a la función para establecer el cliente seleccionado
            expect(setClienteSeleccionadoMock).toHaveBeenCalledWith(1);
            // Verifica que se haya llamado a la función para establecer que se creó un nuevo cliente
            expect(setClienteCreadoMock).toHaveBeenCalledWith(true);
        });
    });

    test('updates state when typing in input fields', () => {
        const { getByPlaceholderText } = render(
            <MemoryRouter>
                <AddClientModal />
            </MemoryRouter>
        );
        const nombreInput = getByPlaceholderText('Nombre');

        fireEvent.change(nombreInput, { target: { value: 'John' } });

        expect(nombreInput.value).toBe('John');
        // Similar para otros campos
    });

    test('calls onClose on "Cancelar" button click', async () => {
        const onCloseMock = jest.fn();
        const setClienteMock = jest.fn();
        const setClienteSeleccionadoMock = jest.fn();
        const setClienteCreadoMock = jest.fn();

        const { getByText } = render(
            <MemoryRouter>
                <AddClientModal
                    onClose={onCloseMock}
                    setCliente={setClienteMock}
                    setClienteSeleccionado={setClienteSeleccionadoMock}
                    setClienteCreado={setClienteCreadoMock} />
            </MemoryRouter>
        );

        fireEvent.click(getByText('Cancelar'));

        expect(onCloseMock).toHaveBeenCalled();
    });

});
