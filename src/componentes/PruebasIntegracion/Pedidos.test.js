import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Importar esto para tener acceso a los matchers de Jest-DOM
import Pedidos from '../Pedidos';
import { BrowserRouter as Router } from 'react-router-dom';


describe('Pruebas de integración para el componente Pedidos', () => {
    test('Prueba de renderizado inicial del componente', async () => {
        render(
            <Router>
                <Pedidos />
            </Router>
        );
        // Aquí puedes agregar expectativas para verificar el renderizado inicial de tus elementos.
        // Por ejemplo:
        expect(screen.getByText(/Nuevo pedido/i)).toBeInTheDocument(); 
        // Verifica que el título se renderiza correctamente
        expect(screen.getByPlaceholderText('Fecha de entrega')).toBeInTheDocument();
         // Verifica que el input para la fecha de entrega esté presente
        // Agrega más expectativas según sea necesario...
    });

    test('Prueba de agregar producto', async () => {
        render(
            <Router>
                <Pedidos />
            </Router>
        );

        // Simula la entrada de datos en los campos correspondientes
        fireEvent.change(screen.getByPlaceholderText('Cantidad'), { target: { value: '2' } });
        fireEvent.change(screen.getByPlaceholderText('Producto'), { target: { value: '1234' } });
        fireEvent.change(screen.getByPlaceholderText('Precio Unitario'), { target: { value: '10.00' } });

        // Simula hacer clic en el botón "Agregar"
        fireEvent.click(screen.getByText('Agregar'));

        // Aquí puedes agregar expectativas para verificar que el producto se agregó correctamente al carrito.
        // Por ejemplo:
        expect(screen.getByText('2')).toBeInTheDocument();
         // Verifica que la cantidad del producto esté en el carrito
        expect(screen.getByText('1234')).toBeInTheDocument();
         // Verifica que el código del producto esté en el carrito
        // Agrega más expectativas según sea necesario...
    });

    test('Prueba de cancelar pedido', async () => {
        render(
            <Router>
                <Pedidos />
            </Router>
        );

        fireEvent.click(screen.getByText('Cancelar Pedido'));

        expect(screen.getByText('Pedido cancelado')).toBeInTheDocument();
    });

    test('Prueba de generar la nota de venta en PDF', async () => {
        render(
            <Router>
                <Pedidos />
            </Router>
        );

        // Simular el llenado de datos necesarios para generar el PDF

        fireEvent.click(screen.getByText('Guardar Pedido'));

        expect(screen.getByText('Pedido creado con éxito')).toBeInTheDocument();
        // Verificar que se haya generado el PDF (esto podría requerir una librería o mock para simular la descarga del PDF)
    });
});
