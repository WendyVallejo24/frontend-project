import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import CategoriaList from '../pantallasGerente/productos/categoria-all';

jest.mock('axios');

describe('CategoriaList component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component without crashing', async () => {
        render(
            <MemoryRouter>
                <CategoriaList />
            </MemoryRouter>
        );
        // Assuming there is a loader or some initial content, you can add an assertion here
        expect(screen.getByText('Administrar Categorías')).toBeInTheDocument();
    });

    test('creates a category', async () => {
        axios.post.mockResolvedValueOnce({ data: { id: 1, nombre: 'bebidas ' } });
        render(
            <MemoryRouter>
                <CategoriaList />
            </MemoryRouter>
        );

        const nombreInput = screen.getByPlaceholderText('Nombre de la Categoría');
        fireEvent.change(nombreInput, { target: { value: 'bebidas' } });

        fireEvent.click(screen.getByText('Crear'));

    });

});

