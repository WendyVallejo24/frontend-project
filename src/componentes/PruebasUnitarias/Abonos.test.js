import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import VistaNotaVentaPedidoEnProcesoComponent from '../pedidos/pedidoProceso';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { prettyDOM } from '@testing-library/react';

jest.mock('axios');

describe('Abonar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('abona correctamente', async () => {
        // Simulamos una respuesta exitosa al obtener las notas de venta en proceso
        axios.get.mockResolvedValue({
            data: [{
                idAnticipo: 42,
                numeroNota: 42,
                estadoPago: 'Pendiente', // Aseguramos que el estado de pago sea 'Pendiente'
                nombreCompletoCliente: 'John Doe',
                resto: 25,
            }]
        });

        const { container } = render(
            <MemoryRouter>
                <VistaNotaVentaPedidoEnProcesoComponent />
            </MemoryRouter>
        );

        console.log(prettyDOM(container));

        // Esperamos a que se carguen los datos de la API
        await waitFor(() => {
            const numeroDeNota = screen.getByText(/Número de Nota:/);
            expect(numeroDeNota).toBeInTheDocument();
        });

        // Simulamos hacer clic en el botón "Abonar" de una nota
        const abonarButtons = screen.getAllByText('Abonar');
        fireEvent.click(abonarButtons[0]); // Seleccionamos el primer botón "Abonar"

        // Esperamos a que se muestre el modal
        await waitFor(() => screen.getAllByText('Abonar'));

        // Simulamos ingresar un monto de abono
        const abonoInput = screen.getByLabelText('Introduce la cantidad de dinero a abonar:');
        fireEvent.change(abonoInput, { target: { value: '10' } });

        // Simulamos una respuesta exitosa al abonar la nota
        axios.post.mockResolvedValue({ status: 200 });

        // Simulamos hacer clic en el botón "Confirmar Abono"
        fireEvent.click(screen.getByText('Confirmar Abono'));

        // Esperamos a que se realice la solicitud HTTP
        await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/notasventas/pagarnota', {
            nNota: 42,
            pago: 10,
        }));
    });
});


/*test('muestra un mensaje de error cuando la cantidad de abono es negativa', async () => {
        // Simulamos una respuesta exitosa al obtener las notas de venta en proceso
        axios.get.mockResolvedValue({
            data: [{
                idAnticipo: 42,
                numeroNota: 42,
                estadoPago: 'Pendiente', // Aseguramos que el estado de pago sea 'Pendiente'
                nombreCompletoCliente: 'John Doe',
                resto: 25,
            }]
        });

        render(
            <MemoryRouter>
                <VistaNotaVentaPedidoEnProcesoComponent />
            </MemoryRouter>
        );

        // Esperamos a que se carguen los datos de la API
        await waitFor(() => {
            const numeroDeNota = screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'p' && /Número de Nota/.test(content);
            });
            expect(numeroDeNota).toBeInTheDocument();
        });

        // Simulamos hacer clic en el botón "Abonar" de una nota
        const abonarButton = screen.getByRole('button', { name: /Abonar/i });
        fireEvent.click(abonarButton);

        // Simulamos ingresar una cantidad de abono negativa
        const abonoInput = screen.getByLabelText('Introduce la cantidad de dinero a abonar:');
        fireEvent.change(abonoInput, { target: { value: '-10' } });

        // Simulamos hacer clic en el botón "Confirmar Abono"
        fireEvent.click(screen.getByText('Confirmar Abono'));

        // Verificamos que se muestre el mensaje de error
        expect(screen.getByText('La cantidad de abono debe ser un número positivo.')).toBeInTheDocument();
    });*/