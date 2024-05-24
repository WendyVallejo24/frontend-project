import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AgregarEmpleado from '../pantallasGerente/AgregarEmpleado';
import axios from 'axios';

jest.mock('axios');

// Mockear la función fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
    })
);


describe('AgregarEmpleado Component', () => {
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: function (key) {
                return store[key] || null;
            },
            setItem: function (key, value) {
                store[key] = value.toString();
            },
            removeItem: function (key) {
                delete store[key];
            },
            clear: function () {
                store = {};
            }
        };
    })();

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    });

    /*test('does not render form with insufficient permissions', () => {
        const mockLocalStorage = {
            getItem: jest.fn().mockReturnValue(JSON.stringify({ rol: ['Some_Other_Role'] })),
        };
        Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

        const { queryByText } = render(
            <MemoryRouter>
                <AgregarEmpleado />
            </MemoryRouter>
        );

        expect(queryByText('Nombre:')).not.toBeInTheDocument();
        expect(queryByText('Apellidos:')).not.toBeInTheDocument();
        expect(queryByText('Correo Electrónico:')).not.toBeInTheDocument();
        expect(queryByText('Contraseña:')).not.toBeInTheDocument();
        expect(queryByText('Rol:')).not.toBeInTheDocument();
        expect(queryByText('Confirmar')).not.toBeInTheDocument();
        expect(queryByText('No cuentas con los permisos.')).toBeInTheDocument();
    });*/

    test('submits form data correctly', async () => {
        // Simulamos el almacenamiento local del rol del usuario
        const userRole = {
            rol: ['Encargado_Departamento']
        };
        localStorage.setItem('userRole', JSON.stringify(userRole));
    
        const { getByTestId } = render(
            <MemoryRouter>
                <AgregarEmpleado />
            </MemoryRouter>
        );
    
        // Fill form inputs
        fireEvent.change(getByTestId('nombre-input'), { target: { value: 'Ana' } });
        fireEvent.change(getByTestId('apellidos-input'), { target: { value: 'Lopez' } });
        fireEvent.change(getByTestId('correo-input'), { target: { value: 'ana@example.com' } });
        fireEvent.change(getByTestId('contrasenia-input'), { target: { value: 'ana123' } });
        fireEvent.change(getByTestId('idRol-input'), { target: { value: '1' } });
    
        // Submit the form
        fireEvent.click(screen.getByText('Confirmar'));
    
        // Agregar console.log para depuración
        console.log('antes de waitFor');
        await waitFor(() => {
            console.log('dentro de waitFor');
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/empleados/crearConDTO',
                {
                    nombre: 'Ana',
                    apellidos: 'Lopez',
                    contrasenia: 'ana123',
                    correoElectronico: 'ana@example.com',
                    idRol: '1'
                }
            );
        });
        console.log('después de waitFor');
    });

});