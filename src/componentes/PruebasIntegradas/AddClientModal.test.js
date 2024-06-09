import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddClientModal from '../AddClientModal';
import { BrowserRouter as Router } from 'react-router-dom';


jest.mock('axios');

describe('AddClientModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <Router>
                <AddClientModal />
            </Router>
        );
    });

    it('creates a new client successfully', async () => {
        const onClose = jest.fn();
        const setCliente = jest.fn();
        const setClienteSeleccionado = jest.fn();
        const setClienteCreado = jest.fn();

        axios.post.mockResolvedValueOnce({ data: { idCliente: 1 } });
        axios.get.mockResolvedValueOnce({ data: [] });

        const { getByPlaceholderText, getByTestId } =
            render(
                <Router>
                    <AddClientModal
                        onClose={onClose}
                        setCliente={setCliente}
                        setClienteSeleccionado={setClienteSeleccionado}
                        setClienteCreado={setClienteCreado}
                    />
                </Router>


            );

        fireEvent.change(getByPlaceholderText('Nombre'), { target: { value: 'John' } });
        fireEvent.change(getByPlaceholderText('Apellidos'), { target: { value: 'Doe' } });
        fireEvent.change(getByPlaceholderText('Teléfono'), { target: { value: '123456789' } });
        fireEvent.change(getByPlaceholderText('Dirección'), { target: { value: '123 Street' } });

        fireEvent.click(getByTestId('add-client-button'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/clientes', {
                nombre: 'John',
                apellidos: 'Doe',
                telefono: '123456789',
                direccion: '123 Street',
            });
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(setCliente).toHaveBeenCalledTimes(1);
            expect(setClienteSeleccionado).toHaveBeenCalledTimes(1);
            expect(setClienteCreado).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledTimes(1);

        });
    });

    it('handles error while creating a new client', async () => {
        const onClose = jest.fn();
        const setCliente = jest.fn();
        const setClienteSeleccionado = jest.fn();
        const setClienteCreado = jest.fn();
        const handleAlert = jest.fn();

        axios.post.mockRejectedValueOnce(new Error('Error creating client'));

        const { getByTestId } =

            render(
                <Router>
                    <AddClientModal
                        onClose={onClose}
                        setCliente={setCliente}
                        setClienteSeleccionado={setClienteSeleccionado}
                        setClienteCreado={setClienteCreado}
                    />
                </Router>
            );

        fireEvent.click(getByTestId('add-client-button'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            //expect(handleAlert).toHaveBeenCalledWith('Cliente creado con éxito');
            //expect(window.alert).toHaveBeenCalledWith('Error al crear el cliente');
            expect(setCliente).not.toHaveBeenCalled();
            expect(setClienteSeleccionado).not.toHaveBeenCalled();
            expect(setClienteCreado).not.toHaveBeenCalled();
            expect(onClose).not.toHaveBeenCalled();


        });
    });
});
