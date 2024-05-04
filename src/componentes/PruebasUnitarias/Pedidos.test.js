import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import axios from 'axios'; // Mockear axios
import Pedidos from '../Pedidos';
import AddClientModal from '../AddClientModal';
import CerrarSesion from '../../componentes/pantallasGerente/cerrarSesion';


// Mock axios to prevent actual HTTP requests during testing
jest.mock('axios');

describe('Pedidos Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: [] }); // Mockear respuesta de axios para obtener clientes
        axios.post.mockResolvedValue({ data: {} }); // Mockear respuesta de axios para crear pedido
    });

    global.window = Object.create(window);

    Object.defineProperty(window, 'alert', {
        configurable: true,
    });
    window.alert = jest.fn();

    Object.defineProperty(window, 'confirm', {
        configurable: true,
    });
    window.confirm = jest.fn();

    test('renders without crashing', () => {
        render(
            <MemoryRouter>
                <Pedidos />
            </MemoryRouter>
        );
    });

    test('initial state values are correct', () => {
        const { getByText, getByPlaceholderText } = render(
            <MemoryRouter>
                <Pedidos />
            </MemoryRouter>
        );

        // Example: Test initial state values
        expect(getByText('Nuevo pedido')).toBeInTheDocument();
        expect(getByPlaceholderText('Fecha de entrega')).toBeInTheDocument();
        // Add more assertions for other initial state values
    });

    test('updates the delivery date', () => {
        const { getByPlaceholderText } = render(
            <MemoryRouter>
                <Pedidos />
            </MemoryRouter>
        );

        // Enter a new delivery date
        fireEvent.change(getByPlaceholderText('Fecha de entrega'), { target: { value: '2024-05-10' } });

        // Assert that the delivery date is updated correctly
        expect(getByPlaceholderText('Fecha de entrega').value).toBe('2024-05-10');
    });

    test('adds a product to the order', async () => { // Make this test async
        const { getByPlaceholderText, getByText, getByRole } = render(
            <MemoryRouter>
                <Pedidos />
            </MemoryRouter>
        );

        // Fire events to change input values and click button
        fireEvent.change(getByPlaceholderText('Cantidad'), { target: { value: '1' } });
        fireEvent.change(getByPlaceholderText('Producto'), { target: { value: '1' } });
        fireEvent.change(getByPlaceholderText('Precio Unitario'), { target: { value: '20' } });
        fireEvent.click(getByRole('button', { name: 'Agregar' }));

        // Verificar que se haya agregado el producto
        expect(getByPlaceholderText('Cantidad').value).toBe('1');
        expect(getByPlaceholderText('Producto').value).toBe('1');
        expect(getByPlaceholderText('Precio Unitario').value).toBe('20');

    });

    test('saves the order successfully', async () => {
        const { getByText, findByText, container } = render(
            <MemoryRouter>
                <Pedidos />
            </MemoryRouter>
        );
        console.log(container.innerHTML)
        const guardarButton = await findByText(/Guardar Pedido/i);

        fireEvent.click(guardarButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1); // Verifica que la función post de axios se haya llamado una vez
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/pedido',
                expect.objectContaining({ /* verificar el cuerpo de la solicitud aquí */ }),
            );
            // Verifica que se haya mostrado la alerta de éxito
            expect(window.alert).toHaveBeenCalledWith('Pedido creado con éxito');
        });
    });

    test('cancels the order when cancel button is clicked', async () => {
        const { getByText } = render(
            <MemoryRouter>
                <Pedidos />
            </MemoryRouter>
        );

        // Simula hacer clic en el botón "Cancelar Pedido"
        fireEvent.click(getByText('Cancelar Pedido'));

        await waitFor(() => {
            // Verifica que se haya mostrado la alerta de éxito
            expect(window.alert).toHaveBeenCalledWith('Pedido cancelado');
        });
    });

});

describe('CerrarSesion Component', () => {
    test('logs out when button is clicked', () => {
        const { getByText } = render(
            <MemoryRouter>
                <CerrarSesion />
            </MemoryRouter>
        );

        global.confirm = jest.fn(() => true);

        // Simula hacer clic en el botón de logout
        fireEvent.click(getByText('Logout'));
    });
});