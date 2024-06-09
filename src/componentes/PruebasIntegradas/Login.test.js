import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '/';

jest.mock('axios');

describe('LoginForm', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('calls init function on mount', () => {
    const initSpy = jest.spyOn(LoginForm, 'init');

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(initSpy).toHaveBeenCalledTimes(1);
  });

  it('handles login form submission', async () => {
    const username = 'username';
    const password = 'password';
    const response = { data: { success: true, rol: 'admin' } };

    axios.post.mockResolvedValue(response);

    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const usernameInput = getByLabelText('Usuario:');
    const passwordInput = getByLabelText('Contraseña:');
    const submitButton = getByText('Ingresar');

    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/login', {
      usuario: username,
      contrasenia: password,
    });

    expect(localStorage.getItem('nombreEmpleado')).toBe(response.data.nombre);
    expect(localStorage.getItem('idEmpleado')).toBe(response.data.id_empleado);
    expect(localStorage.getItem('userRole')).toBe(JSON.stringify(response.data));
  });

  it('navigates to /pedidos on successful login', async () => {
    const username = 'username';
    const password = 'password';
    const response = { data: { success: true, rol: 'admin' } };

    axios.post.mockResolvedValue(response);

    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const usernameInput = getByLabelText('Usuario:');
    const passwordInput = getByLabelText('Contraseña:');
    const submitButton = getByText('Ingresar');

    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(window.location.pathname).toBe('/pedidos'));
  });
});