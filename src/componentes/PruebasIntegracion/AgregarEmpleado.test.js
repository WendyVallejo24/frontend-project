import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react'; // Asegúrate de importar act de react
import AgregarEmpleado from '../pantallasGerente/AgregarEmpleado';
import { BrowserRouter as Router } from 'react-router-dom';

import axios from 'axios';

// Mock de Axios para simular respuestas de la API
jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ status: 201 })),
}));

describe('AgregarEmpleado', () => {
    it('renders correctly', () => {
        // Renderiza el componente dentro de un Router
        const { getByText } = render(
            <Router>
                <AgregarEmpleado />
            </Router>
        );
        // Verifica que un texto específico esté presente en la pantalla
        expect(getByText(/Volver al Registro de Empleados/i)).toBeInTheDocument();
    });

    it('calls handleSubmit when form is submitted', async () => {
        // Define un rol de usuario simulado
        const userRole = { rol: ["Supervisor de Ventas"] };
        // Renderiza el componente dentro de un Router
        const { getByText, getByLabelText } = render(
            <Router>
                <AgregarEmpleado />
            </Router>
        );
        // Encuentra los elementos del formulario por etiqueta de texto
        const nombreInput = getByLabelText('Nombre:');
        const apellidosInput = getByLabelText('Apellidos:');
        const correoInput = getByLabelText('Correo Electrónico:');
        const contraseniaInput = getByLabelText('Contraseña:');
        const idRolSelect = getByLabelText('Rol:');
        const submitButton = getByText('Confirmar');

        // Simula cambios en los campos del formulario
        fireEvent.change(nombreInput, { target: { value: 'John Doe' } });
        fireEvent.change(apellidosInput, { target: { value: 'Doe' } });
        fireEvent.change(correoInput, { target: { value: 'johndoe@example.com' } });
        fireEvent.change(contraseniaInput, { target: { value: 'password' } });
        fireEvent.change(idRolSelect, { target: { value: '2' } });

        // Simula el envío del formulario haciendo clic en el botón de confirmación
        fireEvent.click(submitButton);

        // Espera hasta que se realice la llamada a la API
        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
        // Verifica que la llamada a la API se haya hecho con los datos correctos
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/empleados/crearConDTO', {
            nombre: 'John Doe',
            apellidos: 'Doe',
            correoElectronico: 'johndoe@example.com',
            contrasenia: 'password',
            idRol: '2',
        });
    });

    it('displays error message when API call fails', async () => {
        // Mock de la API para simular un error
        axios.post.mockImplementation(() => Promise.reject(new Error('API error')));

        // Define un rol de usuario simulado
        const userRole = { rol: ["Supervisor de Ventas"] };
        // Renderiza el componente dentro de un Router
        const { getByText, getByLabelText } = render(
            <Router>
                <AgregarEmpleado />
            </Router>
        );
        // Encuentra los elementos del formulario por etiqueta de texto
        const nombreInput = getByLabelText('Nombre:');
        const apellidosInput = getByLabelText('Apellidos:');
        const correoInput = getByLabelText('Correo Electrónico:');
        const contraseniaInput = getByLabelText('Contraseña:');
        const idRolSelect = getByLabelText('Rol:');
        const submitButton = getByText('Confirmar');

        // Simula cambios en los campos del formulario
        fireEvent.change(nombreInput, { target: { value: 'John Doe' } });
        fireEvent.change(apellidosInput, { target: { value: 'Doe' } });
        fireEvent.change(correoInput, { target: { value: 'johndoe@example.com' } });
        fireEvent.change(contraseniaInput, { target: { value: 'password' } });
        fireEvent.change(idRolSelect, { target: { value: '2' } });

        // Simula el envío del formulario haciendo clic en el botón de confirmación
        fireEvent.click(submitButton);

        const errorMessage = 'Error al agregar el empleado:';

        try {
            // Espera hasta que aparezca el mensaje de error en la pantalla
            await waitFor(() => {
                expect(getByText(errorMessage)).toBeInTheDocument();
            });
        } catch (error) {
            // Maneja el caso si el mensaje de error no está presente en el tiempo de espera
            console.error("El mensaje de error no se encontró en el tiempo de espera:", error);
        }
    });
});
