import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import CreateProduct from '../../componentes/pantallasGerente/productos/agregar';

jest.mock('axios');

describe('CreateProduct Component', () => {
    afterEach(() => {
        localStorage.clear(); // Limpiar localStorage después de cada prueba
    });

    test('renders without crashing', () => {
        render(
            <MemoryRouter>
                <CreateProduct />
            </MemoryRouter>
        );
        // Expect component to render without throwing an error
    });

    test('Create producto', async () => {

        const userRole = {
            rol: 'Encargado_Departamento'
        };
        localStorage.setItem('userRole', JSON.stringify(userRole));

        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock.mockResolvedValueOnce({ data: { message: 'Producto creado con éxito.' } });

        const { getByTestId, getByRole } = render(
            <MemoryRouter>
                <CreateProduct />
            </MemoryRouter>
        );

        fireEvent.change(getByTestId('codigoInput'), { target: { value: '1' } });
        fireEvent.change(getByTestId('nombreInput'), { target: { value: 'coca-cola original 600ml' } });
        fireEvent.change(getByTestId('existenciaInput'), { target: { value: '100' } });
        fireEvent.change(getByTestId('precioInput'), { target: { value: '30' } });

        fireEvent.change(getByTestId('categoriaSelect'), { target: { value: '1' } });
        fireEvent.change(getByTestId('marcaSelect'), { target: { value: '2' } });
        fireEvent.change(getByTestId('unidadMedidaSelect'), { target: { value: '3' } });

        fireEvent.click(getByRole('button', { name: 'Crear' }))

        // Espera a que se llame a axios.post
        await waitFor(() => {
            expect(axiosMock).toHaveBeenCalledTimes(1);
            expect(axiosMock).toHaveBeenCalledWith(
                expect.stringContaining('http://localhost:8080/api/productos'),
                {
                    codigo: 1,
                    nombre: 'coca-cola original 600ml',
                    existencia: 100,
                    precio: 30,
                    categoria: { idCategoria: 1 },
                    marca: { idMarca: 2 },
                    unidadMedida: { idUnidadMed: 3 },
                }
            );
        });

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Producto creado con éxito.');
        });
    })

    
});


    /*test('should display inputs for product details', () => {
        const userRole = {
            rol: ['Gerente_Departamento']
        };
        localStorage.setItem('userRole', JSON.stringify(userRole));
        
        render(
            <MemoryRouter>
                <CreateProduct />
            </MemoryRouter>
        );
        const codigoInput = screen.getByPlaceholderText('Código');
        const nombreInput = screen.getByPlaceholderText('Nombre');
        const existenciaInput = screen.getByPlaceholderText('Existencia');
        const precioInput = screen.getByPlaceholderText('Precio');
        const categoriaSelect = screen.getByText('Selecciona una categoría');
        const marcaSelect = screen.getByText('Selecciona una marca');
        const unidadMedidaSelect = screen.getByText('Selecciona una unidad de medida');

        expect(codigoInput).toBeInTheDocument();
        expect(nombreInput).toBeInTheDocument();
        expect(existenciaInput).toBeInTheDocument();
        expect(precioInput).toBeInTheDocument();
        expect(categoriaSelect).toBeInTheDocument();
        expect(marcaSelect).toBeInTheDocument();
        expect(unidadMedidaSelect).toBeInTheDocument();
    });*/

    /*test('should allow entering values in inputs', () => {
        render(
            <MemoryRouter>
                <CreateProduct />
            </MemoryRouter>
        );
        const codigoInput = screen.getByPlaceholderText('Código');
        const nombreInput = screen.getByPlaceholderText('Nombre');

        fireEvent.change(codigoInput, { target: { value: '1234' } });
        fireEvent.change(nombreInput, { target: { value: 'Producto de prueba' } });

        expect(codigoInput).toHaveValue('1234');
        expect(nombreInput).toHaveValue('Producto de prueba');
    });*/

    // Add more tests for other functionalities as needed
    
    /*
    test('Create producto', async () => {

        const userRole = {
            rol: 'Encargado_Departamento'
        };
        localStorage.setItem('userRole', JSON.stringify(userRole));

        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock.mockResolvedValueOnce({ data: { message: 'Producto creado con éxito.' } });

        const { getByTestId, getByRole } = render(
            <MemoryRouter>
                <CreateProduct />
            </MemoryRouter>
        );

        fireEvent.change(getByTestId('codigoInput'), { target: { value: '1' } });
        fireEvent.change(getByTestId('nombreInput'), { target: { value: 'coca-cola original 600ml' } });
        fireEvent.change(getByTestId('existenciaInput'), { target: { value: '100' } });
        fireEvent.change(getByTestId('precioInput'), { target: { value: '30' } });

        fireEvent.change(getByTestId('categoriaSelect'), { target: { value: '1' } });
        fireEvent.change(getByTestId('marcaSelect'), { target: { value: '2' } });
        fireEvent.change(getByTestId('unidadMedidaSelect'), { target: { value: '3' } });

        fireEvent.click(getByRole('button', { name: 'Crear' }))

        // Espera a que se llame a axios.post
        await waitFor(() => {
            expect(axiosMock).toHaveBeenCalledTimes(1);
            expect(axiosMock).toHaveBeenCalledWith(
                expect.stringContaining('http://localhost:8080/api/productos'),
                {
                    codigo: 1,
                    nombre: 'coca-cola original 600ml',
                    existencia: 100,
                    precio: 30,
                    categoria: { idCategoria: 1 },
                    marca: { idMarca: 2 },
                    unidadMedida: { idUnidadMed: 3 },
                }
            );
        });

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Producto creado con éxito.');
        });
    })
    */

    /*test('should display "Crear Producto" title', () => {
        render(
            <MemoryRouter>
                <CreateProduct />
            </MemoryRouter>
        );

        expect(screen.getByText('Crear Producto')).toBeInTheDocument();
    });


    test('Create producto', async () => {

        const userRole = {
            rol: 'Encargado_Departamento'
        };
        localStorage.setItem('userRole', JSON.stringify(userRole));

        const { getByText, getByPlaceholderText, getByTestId } = render(
            <MemoryRouter>
                <CreateProduct />
            </MemoryRouter>
        );

        expect(getByText('Crear Producto')).toBeInTheDocument();
        expect(getByPlaceholderText('Código')).toBeInTheDocument();
        expect(getByTestId('nombreInput')).toBeInTheDocument();
        expect(getByTestId('existenciaInput')).toBeInTheDocument();
        expect(getByTestId('precioInput')).toBeInTheDocument();
        expect(getByTestId('categoriaSelect')).toBeInTheDocument();
        expect(getByTestId('marcaSelect')).toBeInTheDocument();
        expect(getByTestId('unidadMedidaSelect')).toBeInTheDocument();
        expect(getByText('Crear')).toBeInTheDocument();

    });

    test('should display error message when creating product with invalid data', async () => {

        const userRole = {
            rol: 'Encargado_Departamento'
        };
        localStorage.setItem('userRole', JSON.stringify(userRole));

        const { getByText, getByTestId } = render(
            <MemoryRouter>
                <CreateProduct />
            </MemoryRouter>
        );

        fireEvent.click(getByText('Crear'));

        await waitFor(() => {
            expect(getByText('Todos los campos son obligatorios.')).toBeInTheDocument();
        });
        
    });*/