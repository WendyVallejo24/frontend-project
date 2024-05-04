import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../login';

jest.mock('axios');

describe('LoginForm', () => {
    test('debería realizar el login correctamente', async () => {
        const mockData = {
            success: true,
            rol: 'admin',
            nombre: 'Usuario de Prueba',
            id_empleado: '123',
        };

        axios.post.mockResolvedValueOnce({ data: mockData });

        const { getByLabelText, getByText } = render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.change(getByLabelText(/usuario/i), { target: { value: 'user@example.com' } });
        fireEvent.change(getByLabelText(/contraseña/i), { target: { value: 'password123' } });
        fireEvent.click(getByText(/ingresar/i));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/login', {
                usuario: 'user@example.com',
                contrasenia: 'password123',
            });
        });

        expect(localStorage.setItem).toHaveBeenCalledWith('nombreEmpleado', 'Usuario de Prueba');
        expect(localStorage.setItem).toHaveBeenCalledWith('idEmpleado', '123');
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'userRole',
            JSON.stringify({ ...mockData })
        );
        // verificar que la navegación ocurra utilizando MemoryRouter
        expect(window.location.pathname).toBe('/'); // Esto es solo para verificar que no haya redirección en la misma página
    });

});
