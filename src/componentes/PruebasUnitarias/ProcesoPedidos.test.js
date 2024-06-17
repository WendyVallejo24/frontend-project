import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import ProcesoPedidos from '../../componentes/pedidos/pedidoProceso';

jest.mock('axios');

const originalAlert = window.alert;
beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => { });
});

// Restaurar window.alert después de las pruebas
afterEach(() => {
    window.alert.mockRestore();
});

describe('Proceso Pedidos', () => {
    // Mockear window.alert antes de las pruebas
    beforeEach(() => {
        axios.get.mockClear();
        axios.post.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', () => {
        render(
            <MemoryRouter>
                <ProcesoPedidos />
            </MemoryRouter>
        );
        // Expect component to render without throwing an error
    });

    test('should display search input for customer name', () => {
        render(
            <MemoryRouter>
                <ProcesoPedidos />
            </MemoryRouter>
        );
        const searchInput = screen.getByPlaceholderText('Nombre del cliente');
        expect(searchInput).toBeInTheDocument();
    });

    test('should cancel a pedido', async () => {
        const notaMock = {
            numeroNota: '15',
            nombreCompletoCliente: 'Wendy B Vallejo'
            // Otros datos de nota simulados
        };
        axios.get.mockResolvedValueOnce({ data: [notaMock] });
        axios.post.mockResolvedValueOnce({ status: 201 });

        render(
            <MemoryRouter>
                <ProcesoPedidos />
            </MemoryRouter>
        );
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Encontrar y hacer clic en el botón "Entregar Pedido"
        const entregarButton = screen.getByText('Cancelar Pedido');
        fireEvent.click(entregarButton);

        // Verificar que se envió una solicitud para entregar el pedido
        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/pedido/modificarpedido',
            {
                nNota: notaMock.numeroNota,
                idEstadoPedido: 3, // 3 representa el estado de pedido "Cancelado"
            }
        );

        await waitFor(() => expect(axios.post).toHaveBeenCalled());

        // Verifica que la alerta de éxito se muestre después de cancelar el pedido
        expect(window.alert).toHaveBeenCalledWith('Pedido cancelado con éxito');
    });

    test('should filter notes by customer name', async () => {
        const notaMock = {
            nombreCompletoCliente: 'Wendy B Vallejo',
            // Otros datos de nota simulados
        };
        axios.get.mockResolvedValueOnce({ data: [notaMock] });

        render(
            <MemoryRouter>
                <ProcesoPedidos />
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        const searchInput = screen.getByPlaceholderText('Nombre del cliente');
        fireEvent.change(searchInput, { target: { value: 'Wendy B Vallejo' } });

        // Verificar que solo se muestra la nota correspondiente al cliente buscado
        expect(screen.queryByText('Wendy B Vallejo')).toBeInTheDocument();

    });

    test('should deliver a pedido', async () => {
        const notaMock = {
            numeroNota: 15,
            nombreCompletoCliente: 'Wendy B Vallejo',
            // Otros datos de la nota simulados
        };
        axios.get.mockResolvedValueOnce({ data: [notaMock] });
        axios.post.mockResolvedValueOnce({ status: 201 });

        render(
            <MemoryRouter>
                <ProcesoPedidos />
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Encontrar y hacer clic en el botón "Entregar Pedido"
        const entregarButton = screen.getByText('Entregar Pedido');
        fireEvent.click(entregarButton);

        // Verificar que se envió una solicitud para entregar el pedido
        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/pedido/modificarpedido',
            {
                nNota: notaMock.numeroNota,
                idEstadoPedido: 1, // 1 representa el estado de pedido "Entregado"
            }
        );

        await waitFor(() => expect(axios.post).toHaveBeenCalled());

        // Verifica que la alerta de éxito se muestre después de cancelar el pedido
        expect(window.alert).toHaveBeenCalledWith('Pedido entregado con éxito');
    });

    test('should pay and deliver a pedido successfully', async () => {
        // Mock de la respuesta del servidor
        const notaMock = {
            idPedido: 1,
            numeroNota: 17,
            resto: 50, // Supongamos que el resto a pagar es 50
        };
        axios.get.mockResolvedValueOnce({ data: [notaMock] });
        axios.post.mockResolvedValueOnce({ data: "Pedido marcado como pagado y entregado con éxito", status: 201 });

        // Renderizar el componente
        render(
            <MemoryRouter>
                <ProcesoPedidos />
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalled());
        // Llamar a la función handlePagarYEntregarPedido
        const pagarentregarButton = screen.getByTestId("pagar-entregar-button");
        fireEvent.click(pagarentregarButton);

        // Verificar que se realizó la solicitud al servidor con los datos correctos
        expect(axios.post).toHaveBeenCalledWith(
            `http://localhost:8080/api/pedido/pagarentregarpedido`,
            {
                idPedido: notaMock.idPedido, // Reemplaza con el id correcto del pedido
                nNota: notaMock.numeroNota,
                pago: notaMock.resto,
                // Otros datos necesarios para la solicitud
            }
        );
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        // Verificar que se muestra el mensaje de éxito
        expect(window.alert).toHaveBeenCalledWith('Pagado y entregado con éxito');
    });
});
