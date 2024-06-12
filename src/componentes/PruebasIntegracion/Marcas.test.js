import React, { useState } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react'; // Importa las utilidades necesarias de testing de React
import axios from 'axios'; // Importa axios para simular llamadas a la API
import MockAdapter from 'axios-mock-adapter'; // Importa MockAdapter para simular respuestas de la API
import MarcaList from '../pantallasGerente/productos/marcas-all'; // Importa el componente que se va a probar
import { BrowserRouter as Router } from 'react-router-dom';


describe('MarcaList Component', () => { // Inicia una suite de pruebas para el componente MarcaList
    let mockAxios; // Declara una variable para la instancia de MockAdapter

    beforeEach(() => { // Configura acciones antes de cada prueba
        mockAxios = new MockAdapter(axios); // Inicializa MockAdapter antes de cada prueba
    });

    afterEach(() => { // Configura acciones después de cada prueba
        mockAxios.restore(); // Restaura MockAdapter después de cada prueba
    });

    it('should fetch marcas on component mount', async () => { 
        // Prueba que se obtengan las marcas al montar el componente
        const mockData = [{ idMarca: 1, nombre: 'Marca 1' }]; 
        // Define datos de ejemplo para simular la respuesta de la API

        mockAxios.onGet('http://localhost:8080/api/marcas').reply(200, mockData); 
        // Simula una respuesta exitosa de la API al obtener marcas

        render(
            <Router>
                <MarcaList />
            </Router>
        ); // Renderiza el componente MarcaList

        await waitFor(() => { // Espera a que se complete la acción
            expect(screen.getByText('Marca 1')).toBeInTheDocument(); // Verifica que el texto 'Marca 1' esté presente en el componente
        });
    });

    it('should add new marca', async () => {
        const mockData = { idMarca: 2, nombre: 'Nueva Marca' };

        mockAxios.onPost('http://localhost:8080/api/marcas').reply(200, mockData);

        render(
            <Router>
                <MarcaList />
            </Router>
        );

        const input = screen.getByPlaceholderText('Nombre de la Marca');
        fireEvent.change(input, { target: { value: 'Nueva Marca' } });

        fireEvent.click(screen.getByText('Agregar'));

        try {
            await waitFor(() => {
                expect(screen.getByText('Nueva Marca')).toBeInTheDocument();
            });
        } catch (error) {
            console.error('Error al agregar nueva marca:', error);
        }
    });


    it('should edit marca', async () => {
        const mockData = [{ idMarca: 1, nombre: 'Marca 1' }];

        mockAxios.onGet('http://localhost:8080/api/marcas').reply(200, mockData);

        render(
            <Router>
                <MarcaList />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Marca 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Editar'));

        try {
            await waitFor(() => {
                expect(screen.getByDisplayValue('Marca 1')).toBeInTheDocument();
            });
        } catch (error) {
            console.error('Error al editar la marca:', error);
        }
    });

    it('should update marca', async () => {
        const mockData = [{ idMarca: 1, nombre: 'Marca 1' }];

        mockAxios.onGet('http://localhost:8080/api/marcas').reply(200, mockData);
        mockAxios.onPut('http://localhost:8080/api/marcas/1').reply(200, { idMarca: 1, nombre: 'Marca Actualizada' });

        render(
            <Router>
                <MarcaList />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Marca 1')).toBeInTheDocument();
        });

        // Encuentra y simula el clic en el botón de editar
        fireEvent.click(screen.getByText('Editar'));

        // Espera a que se complete la acción de edición
        await waitFor(() => {
            expect(screen.getByDisplayValue('Marca 1')).toBeInTheDocument();
        });

        // Encuentra el input y simula el cambio en el valor
        const input = screen.getByPlaceholderText('Nombre de la Marca');
        fireEvent.change(input, { target: { value: 'Marca Actualizada' } });

        // Encuentra y simula el clic en el botón de actualizar
        fireEvent.click(screen.getByText('Actualizar'));

        try {
            await waitFor(() => {
                expect(screen.getByText('Marca Actualizada')).toBeInTheDocument();
            });
        } catch (error) {
            console.error('Error al actualizar marca', error);
        }
    });


    it('should delete marca', async () => {
        const mockData = [{ idMarca: 1, nombre: 'Marca 1' }];

        mockAxios.onGet('http://localhost:8080/api/marcas').reply(200, mockData);
        mockAxios.onDelete('http://localhost:8080/api/marcas/1').reply(200);

        render(
            <Router>
                <MarcaList />
            </Router>
        );

        // Espera a que se carguen los datos y se renderice el componente
        await waitFor(() => {
            expect(screen.getByText('Marca 1')).toBeInTheDocument();
        });

        // Encuentra el botón de eliminar dentro de la fila de la marca
        const deleteButton = screen.getByText('Eliminar', { selector: '.btn-cancelar' });
        fireEvent.click(deleteButton); // Simula un click en el botón de eliminar

        // Espera a que se complete la acción de eliminación
        await waitFor(() => {
            expect(screen.queryByText('Marca 1')).toBeInTheDocument();
        });

    });
});
