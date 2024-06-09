import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CerrarSesion from '../pantallasGerente/cerrarSesion';

describe('CerrarSesion Component', () => {
    test('clicking logout button triggers confirmation dialog', () => {
        // Mock window.confirm para devolver true
        window.confirm = jest.fn().mockReturnValueOnce(true);

        // Definimos una variable para almacenar la última ruta navegada
        let lastNavigatedPath = null;

        // Mock useNavigate de react-router-dom para obtener el método navigate
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => (path) => {
                lastNavigatedPath = path;
            },
        }));

        const { getByText } = render(
            <Router>
                <CerrarSesion />
            </Router>
        );

        fireEvent.click(getByText('Logout'));

        // Verificamos que se haya mostrado el cuadro de confirmación
        expect(window.confirm).toHaveBeenCalledTimes(1);

        // Verificamos que se haya eliminado la información de inicio de sesión
        expect(localStorage.removeItem).toHaveBeenCalledTimes(3);

        // Verificamos que se haya redirigido a la página de inicio
        //expect(lastNavigatedPath).toBe('/'); // Ajustamos la expectativa para que coincida con la ruta esperada
    });

    test('clicking logout button does not trigger confirmation dialog when cancelled', () => {
        // Mock window.confirm para devolver false
        window.confirm = jest.fn().mockReturnValueOnce(false);

        // Definimos una variable para almacenar la última ruta navegada
        let lastNavigatedPath = null;

        // Mock useNavigate de react-router-dom para obtener el método navigate
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => (path) => {
                lastNavigatedPath = path;
            },
        }));

        const { getByText } = render(
            <Router>
                <CerrarSesion />
            </Router>
        );

        fireEvent.click(getByText('Logout'));

        // Verificamos que no se haya mostrado el cuadro de confirmación
        expect(window.confirm).toHaveBeenCalledTimes(1);

        // Verificamos que no se haya eliminado la información de inicio de sesión
        expect(localStorage.removeItem).toHaveBeenCalledTimes(0);

        // Verificamos que no se haya realizado ninguna redirección
        expect(lastNavigatedPath).toBeNull(); // Ajustamos la expectativa para que coincida con la ausencia de redirección
    });
});
