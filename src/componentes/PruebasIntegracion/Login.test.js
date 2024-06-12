import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../login';

// Mock de Axios para simular respuestas de la API
jest.mock('axios');

describe('LoginForm', () => {
  test('debería manejar errores de inicio de sesión', async () => {
    axios.post.mockRejectedValueOnce({ message: 'Error de autenticación' });

    render(
      <Router>
        <LoginForm />
      </Router>
    );

    // Encuentra los campos y el botón
    const usernameInput = await screen.findByLabelText(/Usuario:/i);
    const passwordInput = await screen.findByLabelText(/Contraseña:/i);
    const loginButton = await screen.findByText(/Ingresar/i);

    // Ingresa credenciales y hace clic en el botón de inicio de sesión
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPass' } });
    fireEvent.click(loginButton);

    // Espera a que aparezca el mensaje de error
    await waitFor(() => {
      const errorElement = screen.queryByText('Error de autenticación');
      expect(errorElement).toBeInTheDocument();
    });
  });
});
