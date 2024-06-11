import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import MarcasList from '../pantallasGerente/productos/marcas-all';

jest.mock('axios');

const originalAlert = window.alert;
beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => { });
});

// Restaurar window.alert después de las pruebas
afterEach(() => {
    window.alert.mockRestore();
});

describe('MarcasList component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: [] });
    });

    test('renders the component without crashing', async () => {
        render(
            <MemoryRouter>
                <MarcasList />
            </MemoryRouter>
        );
        // Assuming there is a loader or some initial content, you can add an assertion here
        expect(screen.getByText('Administrar Marcas')).toBeInTheDocument();
    });

    test('crear una marca', async () => {
        axios.post.mockResolvedValueOnce({ data: { id: 2, nombre: 'coca-cola ' } });
        render(
            <MemoryRouter>
                <MarcasList />
            </MemoryRouter>
        );

        const nombreInput = screen.getByPlaceholderText('Nombre de la Marca');
        fireEvent.change(nombreInput, { target: { value: 'coca-cola' } });

        fireEvent.click(screen.getByText('Agregar'));

    });

    test('elimina una marca', async () => {
        const marcas = [
            { idMarca: 1, nombre: 'herdez' },
            { idMarca: 2, nombre: 'coca-cola' },
        ];
        axios.get.mockResolvedValueOnce({ data: marcas });
        axios.delete.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <MarcasList />
            </MemoryRouter>
        );
        await waitFor(() => expect(screen.getByText('herdez')).toBeInTheDocument());

        fireEvent.click(screen.getByTestId('eliminar-1'));

        await waitFor(() => expect(screen.getByText('Marca eliminada con éxito.')).toBeInTheDocument());

        expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/api/marcas/1');
    });

    test('editar una marca', async () => {
        const marcas = [
            { idMarca: 1, nombre: 'herdez' },
            { idMarca: 2, nombre: 'coca-cola' },
        ];
        axios.get.mockResolvedValueOnce({ data: marcas });

        render(
            <MemoryRouter>
                <MarcasList />
            </MemoryRouter>
        );
        await waitFor(() => expect(screen.getByText('herdez')).toBeInTheDocument());

        fireEvent.click(screen.getByTestId('editar-1'));

        expect(screen.getByPlaceholderText('Nombre de la Marca').value).toBe('herdez');
        expect(screen.getByText('Actualizar')).toBeInTheDocument();
    });

    test('actualizar una marca', async () => {
        const marcas = [
            { idMarca: 1, nombre: 'herdez' },
            { idMarca: 2, nombre: 'coca-cola' },
        ];
        axios.get.mockResolvedValueOnce({ data: marcas });
        axios.put.mockResolvedValueOnce({ data: { idMarca: 1, nombre: 'herdez actualizado' } });

        render(
            <MemoryRouter>
                <MarcasList />
            </MemoryRouter>
        );
        await waitFor(() => expect(screen.getByText('herdez')).toBeInTheDocument());

        fireEvent.click(screen.getByTestId('editar-1'));

        const nombreInput = screen.getByPlaceholderText('Nombre de la Marca');
        fireEvent.change(nombreInput, { target: { value: 'herdez actualizado' } });

        fireEvent.click(screen.getByText('Actualizar'));

        await waitFor(() => expect(screen.getByText('Marca actualizada con éxito.')).toBeInTheDocument());

        expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/api/marcas/1', { nombre: 'herdez actualizado' });
    });
});

/*test('actualizar una marca', async () => {
        const marcas = [
            { idMarca: 1, nombre: 'herdez' },
            { idMarca: 2, nombre: 'coca-cola' },
        ];
        axios.get.mockResolvedValueOnce({ data: marcas });
        axios.delete.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <MarcasList />
            </MemoryRouter>
        );
        await waitFor(() => expect(screen.getByText('herdez')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Actualizar'));

        await waitFor(() => expect(screen.getByText('Marca eliminada con éxito.')).toBeInTheDocument());

        expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/api/marcas/1');
    });*/