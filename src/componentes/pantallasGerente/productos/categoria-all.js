import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../../MenuHamburguesa';
import '../style/catalogo.css';
import '../style/salesReport.css';

const API_URL = 'http://localhost:8080';

const CategoriaList = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);

    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/categorias`);
            setCategorias(response.data);
        } catch (error) {
            console.error('Error al obtener categorías', error);
        }
    };

    const handleCrearCategoria = async () => {
        try {

            if (nombreCategoria.length < 1) {
                alert('El campo no debe estar vacío.');
                return;
            }

            if (categorias.some(categoria => categoria.nombre.toLowerCase() === nombreCategoria.toLowerCase())) {
                alert('Ya existe una categoría con ese nombre.');
                return;
            }

            const nuevaCategoria = {
                idCategoria: idCategoria,
                nombre: nombreCategoria.toLowerCase(),
            };

            const response = await axios.post(`${API_URL}/api/categorias`, nuevaCategoria);
            console.log('Categoría creada:', response.data);
            alert('Categoría creada con éxito.');
            setIdCategoria('');
            setNombreCategoria('');
            fetchCategorias();
        } catch (error) {
            console.error('Error al crear categoría', error);
            alert('Error al crear categoría.');
        }
    };

    const handleEditarCategoria = (idCategoria) => {
        console.log('Editar categoría con ID:', idCategoria);
        const categoria = categorias.find((c) => c.idCategoria === idCategoria);
        if (categoria) {
            setCategoriaSeleccionada(categoria);
            setNombreCategoria(categoria.nombre);
            setModoEdicion(true);
        } else {
            console.error(`No se encontró la categoría con ID: ${idCategoria}`);
            alert('Error al editar categoría.');
        };
    };

    const handleActualizarCategoria = async () => {
        try {
            if (nombreCategoria.length < 1) {
                alert('El campo no debe estar vacío.');
                return;
            }

            const categoriaActualizada = {
                nombre: nombreCategoria.toLowerCase(),
            };

            const response = await axios.put(
                `${API_URL}/api/categorias/${categoriaSeleccionada.idCategoria}`,
                categoriaActualizada
            );

            console.log('Categoría actualizada:', response.data);
            alert('Categoría actualizada con éxito.');
            setNombreCategoria('');
            setCategoriaSeleccionada('');
            setModoEdicion(false);
            fetchCategorias();
        } catch (error) {
            alert('Error al actualizar categoría.');
        }
    };

    const handleEliminarCategoria = async (idCategoria) => {
        try {
            await axios.delete(`${API_URL}/api/categorias/${idCategoria}`);
            alert('Categoría eliminada con éxito.');
            fetchCategorias();
        } catch (error) {
            alert('Error al eliminar categoría.');
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <div className='registro'>
            <MenuHamburguesa />
            {userRole && userRole.rol && (userRole.rol === "Supervisor de Ventas") ? (
                <h1>Administrar Categorías</h1>
            ) : (
                <p> </p>
            )}
            {userRole && userRole.rol && (userRole.rol === "Supervisor de Ventas") ? (
                <div>
                    <h4>{modoEdicion ? 'Editar' : 'Crear'} Categoría</h4>
                    <input
                        className='input-producto'
                        type="text"
                        placeholder="Nombre de la Categoría"
                        value={nombreCategoria}
                        onChange={(e) => setNombreCategoria(e.target.value.toLowerCase())}
                    />
                    <div className='botones'>
                        {modoEdicion ? (
                            <button className='btn-finalizar' onClick={handleActualizarCategoria}>Actualizar</button>
                        ) : (
                            <button className='btn-finalizar' onClick={handleCrearCategoria}>Crear</button>
                        )}
                    </div>
                </div>
            ) : (
                <p>No cuentas con los permisos.</p>
            )}

            {/* Listado de Categorías */}
            {userRole && userRole.rol && (userRole.rol === "Supervisor de Ventas") ? (
                <div>
                    <h4>Listado de Categorías</h4>
                    <table className='registroEmp'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((categoria) => (
                                <tr key={categoria.idCategoria}>
                                    <td>{categoria.idCategoria}</td>
                                    <td>{categoria.nombre}</td>
                                    <td className='btn-ventas'>
                                        <button className='btn-finalizar' onClick={() => handleEditarCategoria(categoria.idCategoria)}>Editar</button>
                                        <button className='btn-cancelar' onClick={() => handleEliminarCategoria(categoria.idCategoria)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p> </p>
            )}
        </div>
    );
};

export default CategoriaList;