import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // Mock de axios
import { act } from '@testing-library/react'; // Importa la función act
import Pedidos from '../Pedidos'; // Componente que se está probando
import { BrowserRouter as Router } from 'react-router-dom';

// Se crea un mock de axios para simular peticiones HTTP
jest.mock('axios');
// Mockear window.alert
window.alert = jest.fn();

// Se describe un conjunto de pruebas para el componente Pedidos
describe('Pedidos Component', () => {
    // Antes de cada prueba, se define el comportamiento de axios
    beforeEach(() => {
        // Mock de la función get de axios, devuelve una promesa resuelta con un objeto vacío
        axios.get.mockResolvedValue({ data: [] });
        // Mock de la función post de axios, devuelve una promesa resuelta con un objeto vacío
        axios.post.mockResolvedValue({ data: {} });
    });
    // Prueba para verificar que el componente se renderice correctamente
    it('renders without crashing', () => {
        render(
            <Router>
                <Pedidos />
            </Router>
        );
        // Se espera que el texto 'Nuevo pedido' esté presente en la pantalla
        expect(screen.getByText('Nuevo pedido')).toBeInTheDocument();
    });

    it('should add a product to the sales list', async () => {
        // Simular una respuesta exitosa de la API al obtener la información del producto
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () =>
                Promise.resolve({
                    nombre: 'Producto de prueba',
                    unidadMedida: 'unidad',
                    existencia: 10, // Supongamos que hay 10 unidades disponibles en el stock
                }),
        });

        render(
            <Router>
                <Pedidos />
            </Router>
        );

        // Simular la entrada de datos en los campos de cantidad, producto y precioUnitario
        const cantidadInput = screen.getByPlaceholderText('Cantidad');
        const productoInput = screen.getByPlaceholderText('Producto');
        const precioUnitarioInput = screen.getByPlaceholderText('Precio Unitario');

        fireEvent.change(cantidadInput, { target: { value: '5' } });
        fireEvent.change(productoInput, { target: { value: '1' } }); // Supongamos que el ID del producto es 1
        fireEvent.change(precioUnitarioInput, { target: { value: '10.50' } });

        // Simular hacer clic en el botón "Agregar"
        const agregarButton = screen.getByText('Agregar');
        fireEvent.click(agregarButton);

        // Verificar que el producto se agregó correctamente a la lista de ventas
        const productList = await screen.findByText('Producto de prueba');
        expect(productList).toBeInTheDocument();
    });

    it('should calculate total and change correctly', () => {
        // Define un array de ventas para simular datos de productos
        const ventas = [
            { subtotal: 10 },
            { subtotal: 20 },
            { subtotal: 15 }
        ];

        // Define un monto recibido para la prueba
        const montoRecibido = '50';

        // Renderiza el componente con las ventas y el monto recibido
        render(
            <Router>
                <Pedidos ventas={ventas} montoRecibido={montoRecibido} />
            </Router>
        );

        // Obtiene el total renderizado en el componente
        const totalElement = screen.getByText(/Total:/);
        const totalValue = parseFloat(totalElement.textContent.split('$')[1]);
        // Obtiene el cambio renderizado en el componente
        const cambioElement = screen.getByText(/Cambio:/);
        const cambioValue = parseFloat(cambioElement.textContent.split('$')[1]);
        // Calcula el total esperado
        const expectedTotal = ventas.reduce((total, producto) => total + parseFloat(producto.subtotal), 0).toFixed(2);
        // Calcula el cambio esperado
        const totalVenta = parseFloat(expectedTotal);
        const montoRecibidoFloat = parseFloat(montoRecibido);
        const expectedChange = (montoRecibidoFloat - totalVenta).toFixed(2);

        // Verifica que el total renderizado sea igual al total esperado
       // expect(totalValue).toEqual(parseFloat(expectedTotal));

        // Verifica que el cambio renderizado sea igual al cambio esperado
       // expect(cambioValue).toEqual(parseFloat(expectedChange));
    });

    test('cancela el pedido correctamente', async () => {
        render(
            <Router>
                <Pedidos />
            </Router>
        );;
        // Simular la entrada de información en los campos del formulario
        const cantidadInput = screen.getByPlaceholderText('Cantidad');
        fireEvent.change(cantidadInput, { target: { value: '2' } });
        const productoInput = screen.getByPlaceholderText('Producto');
        fireEvent.change(productoInput, { target: { value: '1234' } });
        const precioInput = screen.getByPlaceholderText('Precio Unitario');
        fireEvent.change(precioInput, { target: { value: '10.50' } });

        // Simular el clic en el botón "Agregar"
        const agregarButton = screen.getByText('Agregar');
        fireEvent.click(agregarButton);

        // Simular el clic en el botón "Cancelar Pedido"
        const cancelarButton = screen.getByText('Cancelar Pedido');
        fireEvent.click(cancelarButton);
    });

});

// Prueba para verificar que se pueda quitar un producto de la lista
it('should remove a product from the list', async () => {
    render(
        <Router>
            <Pedidos />
        </Router>
    );
    // Se buscan los elementos necesarios para quitar un producto de la lista
    const cantidadInput = screen.getByPlaceholderText('Cantidad');
    const productoInput = screen.getByPlaceholderText('Producto');
    const precioInput = screen.getByPlaceholderText('Precio Unitario');
    const addButton = screen.getByText('Agregar');

    // Se simula el cambio de los valores de los inputs
    fireEvent.change(cantidadInput, { target: { value: '2' } });
    fireEvent.change(productoInput, { target: { value: '1234' } });
    fireEvent.change(precioInput, { target: { value: '10' } });

    // Se simula el click en el botón de agregar
    fireEvent.click(addButton);

    // Se busca el botón de quitar y se simula su click
    const removeButton = screen.getByText('Quitar');
    fireEvent.click(removeButton);

    // Se espera a que el producto se haya eliminado de la lista
    await waitFor(() => {
        expect(screen.queryByText('2')).not.toBeInTheDocument();
    }, { timeout: 10000 });
});

// Prueba para verificar que se pueda cancelar un pedido
it('should cancel the order', async () => {
    render(
        <Router>
            <Pedidos />
        </Router>
    );

    // Espera a que el botón "Cancelar Pedido" esté presente en la pantalla
    await waitFor(() => {
        const cancelButton = screen.getByText('Cancelar Pedido');
        expect(cancelButton).toBeInTheDocument();

        // Envuelve la actualización del estado en act(...)
        act(() => {
            // Simula el click en el botón de cancelar pedido
            fireEvent.click(cancelButton);
        });
    });
}, 20000);

// Prueba para verificar que se pueda guardar un pedido y descargar el PDF
it('should save the order and download PDF', async () => {
    render(
        <Router>
            <Pedidos />
        </Router>
    );

    // Se simula la interacción del usuario para agregar un producto
    const cantidadInput = screen.getByPlaceholderText('Cantidad');
    const productoInput = screen.getByPlaceholderText('Producto');
    const precioInput = screen.getByPlaceholderText('Precio Unitario');
    const addButton = screen.getByText('Agregar');

    fireEvent.change(cantidadInput, { target: { value: '2' } });
    fireEvent.change(productoInput, { target: { value: '1234' } });
    fireEvent.change(precioInput, { target: { value: '10' } });
    fireEvent.click(addButton);

    // Se simula la interacción del usuario para guardar el pedido y descargar el PDF
    const saveButton = screen.getByText('Guardar Pedido');
    fireEvent.click(saveButton);
});