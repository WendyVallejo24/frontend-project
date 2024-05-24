// CreateProduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../../MenuHamburguesa';
import '../style/catalogo.css';
import '../style/salesReport.css';
import '../style/registroEmp.css';

//const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080';

const CreateProduct = () => {
    const [productos, setProductos] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [existencia, setExistencia] = useState('');
    const [precio, setPrecio] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [marcas, setMarcas] = useState([]);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
    const [unidadMedidas, setUnidadMedidas] = useState([]);
    const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);

    // Verificar si localStorage tiene datos y asignar a userRole
    const storedUserRole = localStorage.getItem('userRole');
    console.log('Valor almacenado en localStorage:', storedUserRole);
    const userRole = storedUserRole ? JSON.parse(storedUserRole) : null;

    const handleCreate = async () => {
        try {
            if (!codigo || !nombre || !existencia || !precio || !categoriaSeleccionada || !marcaSeleccionada || !unidadMedidaSeleccionada) {
                alert('Todos los campos son obligatorios.');
                return;
            }

            if (codigo.length > 4) {
                alert('El código debe tener máximo 4 números.');
                return;
            }

            const existenciaNumber = parseInt(existencia);
            const precioNumber = parseFloat(precio);

            if (isNaN(existenciaNumber) || isNaN(precioNumber) || existenciaNumber < 0 || precioNumber < 0) {
                alert('La existencia y el precio deben ser números positivos.');
                return;
            }

            const nuevoProducto = {
                codigo: parseInt(codigo),
                nombre: nombre.toLowerCase(),
                existencia: parseInt(existencia),
                precio: parseFloat(precio),
                categoria: {
                    idCategoria: parseInt(categoriaSeleccionada)
                },
                marca: {
                    idMarca: parseInt(marcaSeleccionada)
                },
                unidadMedida: {
                    idUnidadMed: parseInt(unidadMedidaSeleccionada)
                },
            };

            const response = await axios.post(`${API_URL}/api/productos`, nuevoProducto);
            console.log('Producto creado:', response.data);
            alert('Producto creado con éxito.');
            fetchProductos();
            resetForm();

        } catch (error) {
            // console.error('Error al crear producto', error);
            alert('Error al crear producto.');
        }
    };

    const handleEdit = async (codigo) => {
        // console.log('Editar producto con código:', codigo);
        const productoAEditar = productos.find((producto) => producto.codigo === codigo);

        if (productoAEditar) {
            console.log('Producto a editar:', productoAEditar);
            setProductoSeleccionado(productoAEditar);
            setCodigo(productoAEditar.codigo.toString());
            setNombre(productoAEditar.nombre);
            setExistencia(productoAEditar.existencia.toString());
            setPrecio(productoAEditar.precio.toString());
            setCategoriaSeleccionada(productoAEditar.idCategoria.toString()); // Cambié a idCategoria
            setMarcaSeleccionada(productoAEditar.idMarca.toString()); // Cambié a idMarca
            setUnidadMedidaSeleccionada(productoAEditar.idUnidadMedida.toString()); // Cambié a idUnidadMedida
            setModoEdicion(true);

        } else {
            // console.error(`No se encontró el producto con código: ${codigo}`);
            alert(`No se encontró el producto con código: ${codigo}`);
        }
    };


    const handleUpdate = async () => {
        // console.log('productoSeleccionado:', productoSeleccionado);
        try {
            if (!codigo || !nombre || !existencia || !precio || !categoriaSeleccionada || !marcaSeleccionada || !unidadMedidaSeleccionada) {
                alert('Todos los campos son obligatorios.');
                return;
            }

            if (codigo.length > 4) {
                alert('El código debe tener máximo 4 números.');
                return;
            }

            const existenciaNumber = parseInt(existencia);
            const precioNumber = parseFloat(precio);

            if (isNaN(existenciaNumber) || isNaN(precioNumber) || existenciaNumber < 0 || precioNumber < 0) {
                alert('La existencia y el precio deben ser números positivos.');
                return;
            }

            const productoActualizado = {
                codigo: parseInt(codigo),
                nombre: nombre.toLowerCase(),
                existencia: parseInt(existencia),
                precio: parseFloat(precio),
                categoria: {
                    idCategoria: parseInt(categoriaSeleccionada)
                },
                marca: {
                    idMarca: parseInt(marcaSeleccionada)
                },
                unidadMedida: {
                    idUnidadMed: parseInt(unidadMedidaSeleccionada)
                },
            };

            const response = await axios.put(
                `${API_URL}/api/productos/${productoSeleccionado.codigo}`,
                productoActualizado
            );
            console.log('Producto actualizado:', response.data);
            alert('Producto actualizado con éxito.');
            setModoEdicion(false);
            fetchProductos();
            resetForm();

        } catch (error) {
            // console.error('Error al actualizar producto', error);
            alert('Error al actualizar producto.');
        }
    };

    const resetForm = () => {
        setCodigo('');
        setNombre('');
        setExistencia('');
        setPrecio('');
        setCategoriaSeleccionada('');
        setMarcaSeleccionada('');
        setUnidadMedidaSeleccionada('');
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/productos`);
            // console.log('Productos obtenidos:', response.data);
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos', error);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/marcas`);
                setMarcas(response.data);
            } catch (error) {
                console.error('Error al obtener marcas', error);
            }
        };

        fetchMarcas();
    }, []);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/categorias`);
                setCategorias(response.data);
            } catch (error) {
                console.error('Error al obtener categorías', error);
            }
        };

        fetchCategorias();
    }, []);

    useEffect(() => {
        const fetchUnidadMedidas = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/unidadesMedida`);
                setUnidadMedidas(response.data);
            } catch (error) {
                console.error('Error al obtener unidades de medida', error);
            }
        };

        fetchUnidadMedidas();
    }, []);

    console.log('userRole en RegistroEmp:', userRole);
    console.log('userRole.rol en RegistroEmp:', userRole && userRole.rol);

    return (
        <div className='registro'>
            <MenuHamburguesa />
            <h1 className='responsive-title'>Crear Producto</h1>
            {userRole && userRole.rol && (userRole.rol === "Encargado_Departamento" || userRole.rol === "Gerente_Departamento") ? (
                <div>
                    <h4>{modoEdicion ? 'Editar' : 'Agregar'} Producto</h4>
                    <input
                        className='input-producto'
                        type="number"
                        placeholder="Código"
                        name="codigo"
                        data-testid="codigoInput"
                        value={codigo}
                        onChange={(e) => {
                            const inputCodigo = e.target.value.replace(/\D/g, '');
                            if (inputCodigo.length <= 4) {
                                setCodigo(inputCodigo);
                            }
                        }
                        }
                    />
                    <input
                        className='input-producto'
                        type="text"
                        placeholder="Nombre"
                        name='nombre'
                        data-testid="nombreInput"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value.toLowerCase())}
                    />
                    <input
                        className='input-producto'
                        type="number"
                        placeholder="Existencia"
                        name='existencia'
                        data-testid= "existenciaInput"
                        value={existencia}
                        onChange={(e) => {
                            const inputExistencia = e.target.value.replace(/\D/g, '');
                            setExistencia(inputExistencia);
                        }}
                    />
                    <input
                        className='input-producto'
                        type="number"
                        placeholder="Precio"
                        name='precio'
                        data-testid="precioInput"
                        value={precio}
                        onChange={(e) => {
                            const inputPrecio = e.target.value.replace(/[^\d.]/g, '');
                            setPrecio(inputPrecio);
                        }}
                    />
                    <select
                        className='select-producto'
                        value={categoriaSeleccionada}
                        data-testid="categoriaSelect"
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                    <select
                        className='select-producto'
                        value={marcaSeleccionada}
                        data-testid="marcaSelect"
                        onChange={(e) => setMarcaSeleccionada(e.target.value)}
                    >
                        <option value="">Selecciona una marca</option>
                        {marcas.map((marca) => (
                            <option key={marca.idMarca} value={marca.idMarca}>
                                {marca.nombre}
                            </option>
                        ))}
                    </select>
                    <select
                        className='select-producto'
                        value={unidadMedidaSeleccionada}
                        data-testid="unidadMedidaSelect"
                        onChange={(e) => setUnidadMedidaSeleccionada(e.target.value)}
                    >
                        <option value="">Selecciona una unidad de medida</option>
                        {unidadMedidas.map((unidadMedida) => (
                            <option key={unidadMedida.idUnidadMedida} value={unidadMedida.idUnidadMedida}>
                                {unidadMedida.nombre}
                            </option>
                        ))}
                    </select>
                    <div className='botones'>
                        {modoEdicion ? (
                            <button className='btn-finalizar' onClick={handleUpdate}>Actualizar</button>
                        ) : (
                            <button className='btn-finalizar' onClick={handleCreate}>Crear</button>
                        )}
                    </div>
                </div>
            ) : (
                <p>No cuentas con los permisos.</p>
            )}
            <h4>Lista de Productos</h4>
            <div className="table-container"> {/* Nuevo div que envuelve la tabla */}
                {userRole && userRole.rol && (userRole.rol === "Encargado_Departamento" || userRole.rol === "Gerente_Departamento") ? (
                    <table className="registroEmp">
                        <thead className="encabezado">
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Existencia</th>
                                <th>Precio</th>
                                <th>Categoría</th>
                                <th>Marca</th>
                                <th>Unidad de Medida</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                // console.log(producto),
                                <tr key={producto.codigo}>
                                    <td>{producto.codigo}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.existencia}</td>
                                    <td>{producto.precio}</td>
                                    <td>{producto.categoria}</td>
                                    <td>{producto.marca}</td>
                                    <td>{producto.unidadMedida}</td>
                                    <td className='btn-ventas'>
                                        <div className='botones'>
                                            <button className='btn-editar' onClick={() => handleEdit(producto.codigo)}>Editar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No cuentas con los permisos.</p>
                )}
            </div>
        </div>
    );
};

export default CreateProduct;