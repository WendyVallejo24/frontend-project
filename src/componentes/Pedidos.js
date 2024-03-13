import React, { useState, useEffect, useRef } from "react";
import MenuHamburguesa from './MenuHamburguesa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { CgAdd } from "react-icons/cg";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';
import './Ventas.css';

const id_empleado = localStorage.getItem('idEmpleado');
const nombre = localStorage.getItem('nombreEmpleado');

//const URL_API = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net/';
const URL_API = 'http://localhost:8080/';

const Calendar = ({ onChange }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleDateChange = date => {
        setSelectedDate(date);
        onChange(date);
        closeCalendar();
    };

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const closeCalendar = () => {
        setIsCalendarOpen(false);
    };

    return (
        <div>
            <div onClick={toggleCalendar}>
                <DatePicker
                    className="fecha-entrega"
                    placeholderText="Fecha de entrega"
                    selected={selectedDate}
                    dateFormat="yyyy-MM-dd"
                    onChange={handleDateChange}
                    onClickOutside={closeCalendar}
                />
            </div>
        </div>
    );
};

const Pedidos = () => {
    const [cliente, setCliente] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [cantidad, setCantidad] = useState("");
    const [producto, setProducto] = useState("");
    const [precioUnitario, setPrecioUnitario] = useState("");
    const [ventas, setVentas] = useState([]);
    const [montoRecibido, setMontoRecibido] = useState("");
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [clienteInfo, setClienteInfo] = useState(null);
    const [clienteCreado, setClienteCreado] = useState(false);
    const [noteNumber, setNoteNumber] = useState('');

    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const fechaFormateada = format(hoy, 'yyyy-MM-dd');

    const fetchClientes = async () => {
        try {
            const response = await axios.get(URL_API + 'api/clientes');
            setCliente(response.data);
        } catch (error) {
            console.error('Error al obtener los clientes', error);
        }
    };

    useEffect(() => {
        // Generar el número de nota automáticamente al montar el componente
        fetchLastNoteNumber();
    }, []);

    const fetchLastNoteNumber = () => {
        // Realizar una llamada a la API para obtener el último número de nota generado
        // Suponiendo que obtienes el número de nota desde la API, simulamos una llamada aquí
        const lastNoteNumberFromAPI = 0; // Supongamos que el último número de nota es 10
        setNoteNumber(generateNoteNumber(lastNoteNumberFromAPI));
    };

    const generateNoteNumber = (lastNoteNumber) => {
        // Obtener el número de nota actual y aumentar en 1
        const currentNoteNumber = lastNoteNumber + 1;
        // Formatear el número como un string con dos dígitos
        const formattedNoteNumber = currentNoteNumber.toString().padStart(2, '0');
        return formattedNoteNumber;
    };

    const monto = () => {
        if (montoRecibido > calcularTotal()) {
            return calcularTotal();
        } else if (montoRecibido <= calcularTotal()) {
            return montoRecibido;
        }
    }
    const handleCreatePedido = async () => {
        try {
            const nuevoPedido = {
                fecha: fechaFormateada,
                total: parseFloat(calcularTotal()),
                anticipo: {
                    monto: parseFloat(monto()),
                },
                cliente: {
                    idCliente: parseInt(clienteSeleccionado)
                },
                empleado: {
                    idEmpleado: parseInt(id_empleado)
                },
                detallePedido: {
                    fechaEntrega: fechaEntrega
                },
                detalleVenta: ventas.map((producto) => ({
                    cantidad: parseFloat(producto.cantidad),
                    subtotal: parseFloat(producto.subtotal),
                    producto: {
                        codigo: parseInt(producto.producto)
                    }
                })),
            };
            console.log('Nueva Pedido:', nuevoPedido);
            const response = await axios.post(URL_API + 'api/pedido', nuevoPedido);
            console.log('Pedido creado:', response.data);
            const newNoteNumber = generateNoteNumber(parseInt(noteNumber));
            setNoteNumber(newNoteNumber);
            console.log('Nuevo número de nota:', newNoteNumber);
            alert('Pedido creado con éxito');
            resetForm();
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            alert('Error al crear el pedido');
        }

    }

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await axios.get(URL_API + 'api/clientes');
                setCliente(response.data);
            } catch (error) {
                console.error('Error al obtener los clientes', error);
            }
        };
        fetchCliente();
    }, []);

    useEffect(() => {
        const fetchClienteDetalle = async (idCliente) => {
            try {
                const response = await axios.get(URL_API + `api/clientes/${idCliente}`);
                setClienteInfo(response.data);
                if (clienteCreado) {
                    setClienteCreado(false); // Reiniciar el estado después de mostrar la información
                }
            } catch (error) {
                console.error('Error al obtener la información del cliente', error);
            }
        };

        if (clienteSeleccionado) {
            fetchClienteDetalle(clienteSeleccionado);
        } else {
            setClienteInfo(null);
        }
    }, [clienteSeleccionado, clienteCreado]);

    useEffect(() => {
        const obtenerPrecioUnitario = async (codigo) => {
            try {
                const response = await fetch(URL_API + `api/productos/${codigo}`);
                const data = await response.json();
                console.log(data);
                setPrecioUnitario(data.precio); // Asume que la API devuelve un objeto con la propiedad 'precio'
            } catch (error) {
                console.error("Error al obtener el precio unitario:", error);
            }
        };

        if (producto) {
            obtenerPrecioUnitario(producto);
        }
    }, [producto]);

    const AddClientModal = ({ onClose }) => {
        const [nombre, setNombre] = useState("");
        const [apellidos, setApellidos] = useState("");
        const [telefono, setTelefono] = useState("");
        const [direccion, setDireccion] = useState("");

        const handleCreateClient = async () => {
            try {
                const nuevoCliente = {
                    nombre: nombre,
                    apellidos: apellidos,
                    telefono: parseInt(telefono),
                    direccion: direccion,
                };

                const response = await axios.post(URL_API + 'api/clientes', nuevoCliente);
                await fetchClientes();
                console.log('Cliente creado:', response.data);
                setClienteSeleccionado(response.data.idCliente);
                alert('Cliente creado con éxito');
                setClienteCreado(true);
                onClose();
            } catch (error) {
                console.error('Error al crear el cliente:', error);
                alert('Error al crear el cliente');
            }
        }

        const handleNombreChange = (e) => {
            setNombre(e.target.value);
        }

        const handleApellidosChange = (e) => {
            setApellidos(e.target.value);
        }

        const handleTelefonoChange = (e) => {
            setTelefono(e.target.value);
        }

        const handleDireccionChange = (e) => {
            setDireccion(e.target.value);
        }

        return (
            // JSX de la pantalla flotante
            <div className="modal-overlay">
                {userRole && userRole.rol && (userRole.rol === "Encargado_Departamento" || userRole.rol === "Gerente_Departamento" || userRole.rol === "Encargado_Caja") ? (
                    <div className="modal-content">
                        <MenuHamburguesa />
                        <h2>Nuevo Cliente</h2>

                        <div className="input">
                            <input
                                className="cantidad"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={handleNombreChange}
                            />
                            <input
                                className="cantidad"
                                placeholder="Apellidos"
                                value={apellidos}
                                onChange={handleApellidosChange}
                            />
                            <input
                                className="cantidad"
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={handleTelefonoChange}
                            />
                            <input
                                className="cantidad"
                                placeholder="Dirección"
                                value={direccion}
                                onChange={handleDireccionChange}
                            />
                        </div>
                        <div className="btns">
                            <button className="btn-finalizar" onClick={handleCreateClient}>Guardar</button>
                            <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <p>No cuentas con los permisos.</p>
                )}
            </div>
        );
    };

    const agregarProducto = async () => {
        if (cantidad && producto && precioUnitario) {
            try {
                const response = await fetch(URL_API + `api/productos/${producto}`);
                const data = await response.json();
                const unidadDeMedida = data.unidadMedida;

                const nuevoProducto = {
                    cantidad: parseFloat(cantidad),
                    producto: producto,
                    nombre: data.nombre,
                    precioUnitario: parseFloat(precioUnitario).toFixed(2),
                    subtotal: parseFloat(calcularSubtotal(unidadDeMedida)).toFixed(2),
                };

                const stockDisponible = data.existencia;

                if (nuevoProducto.cantidad <= stockDisponible) {
                    setVentas([...ventas, nuevoProducto]);

                    // Limpiar los campos después de agregar el producto
                    setCantidad("");
                    setProducto("");
                    setPrecioUnitario("");
                } else {
                    // Mostrar alerta
                    alert("La cantidad que está ingresando es superior a la cantidad de productos en stock");

                    setCantidad(stockDisponible); // Establecer la cantidad máxima disponible
                }
            } catch (error) {
                console.error("Error al obtener la información del producto:", error);
            }
        }
    };

    const quitarProducto = (index) => {
        const nuevasVentas = [...ventas];
        nuevasVentas.splice(index, 1);
        setVentas(nuevasVentas);
    };

    const handleFechaEntregaChange = (date) => {
        setFechaEntrega(date ? format(date, 'yyyy-MM-dd') : ''); // Formatear la fecha y establecer en fechaEntrega
    };

    const handleHoraEntrega = () => {
        setIsTimePickerOpen(true);
    };

    const handleCloseTimePicker = () => {
        setIsTimePickerOpen(false);
    };

    const isNumber = (value) => /^[0-9]+(\.[0-9]{1,2})?$/.test(value);

    const handleCantidadChange = (e) => {
        if (isNumber(e.target.value) || e.target.value === "") {
            setCantidad(e.target.value);
        }
    };

    const handleProductoChange = (e) => {
        if (/^[0-9]{0,4}$/.test(e.target.value)) {
            setProducto(e.target.value);
        }
    };

    const handlePrecioUnitarioChange = (e) => {
        setPrecioUnitario(e.target.value);
    };

    const handleMontoRecibidoChange = (e) => {
        setMontoRecibido(e.target.value);
    };

    const openAddClientModal = () => {
        setIsAddClientModalOpen(true);
    };

    const closeAddClientModal = () => {
        setIsAddClientModalOpen(false);
    };

    const calcularSubtotal = (unidadDeMedida) => {
        console.log('unidad de medida: ', unidadDeMedida)
        if (unidadDeMedida === 'gramos') {
            return parseFloat((parseFloat(cantidad) * parseFloat(precioUnitario) / 100).toFixed(2));
        }
        else {
            return parseFloat((parseFloat(cantidad) * parseFloat(precioUnitario)).toFixed(2));
        }
    }

    const calcularTotal = () => {
        return ventas.reduce((total, producto) => total + parseFloat(producto.subtotal), 0).toFixed(2);
    };

    const cambio = () => {
        const totalVenta = parseFloat(calcularTotal());
        const montoRecibidoFloat = parseFloat(montoRecibido);

        if (montoRecibidoFloat < calcularTotal()) {
            return "0.00"
        } else if (!isNaN(totalVenta) && !isNaN(montoRecibidoFloat)) {
            return (montoRecibidoFloat - totalVenta).toFixed(2);
        } else {
            return "";
        }
    };

    const cancelarPedido = () => {
        if (window.confirm("¿Estás seguro de cancelar el pedido?")) {
            resetForm();
            console.log("Pedido cancelado");
        }
    }

    const resetForm = () => {
        setClienteSeleccionado('');
        setFechaEntrega('');
        setCantidad("");
        setProducto("");
        setPrecioUnitario("");
        setVentas([]);
        setMontoRecibido("");
    }
    const estadoPago = () => {
        if (montoRecibido < calcularTotal()) {
            return "Pendiente";
        } else if (montoRecibido >= calcularTotal) {
            return "Pagado";
        }
    }

    const estadoPedido = () => {
        return 'En proceso'
    }

    // Componente para la nota de venta en PDF
    const downloadPDF = () => {

        // Obtener el nombre y apellidos del cliente seleccionado
        const clienteSeleccionadoData = cliente.find(cli => cli.idCliente === parseInt(clienteSeleccionado));
        const nombreClienteSeleccionado = clienteSeleccionadoData ? `${clienteSeleccionadoData.nombre} ${clienteSeleccionadoData.apellidos}` : '';

        const pdf = new jsPDF();
        pdf.text('Pedido', 20, 20);
        pdf.text('Fecha: ' + hoy.toDateString(), 20, 30);
        pdf.text('Empleado: ' + nombre, 20, 40);
        pdf.text('Cliente: ' + nombreClienteSeleccionado, 20, 60);
        pdf.text('Fecha de entrega: ' + fechaEntrega, 20, 70);
        pdf.text('Estado de Pago: ' + estadoPago(), 20, 90);
        pdf.text('Estado del Pedido: ' + estadoPedido(), 20, 100);

        // Detalles del Reporte
        pdf.text('Productos:', 20, 110);
        pdf.autoTable({
            startY: 120,
            head: [['Cantidad', 'Código del producto', 'Nombre Producto', 'Precio Unitario', 'Subtotal']],
            body: ventas.map((producto) => [
                producto.cantidad,
                producto.producto,
                producto.nombre,
                producto.precioUnitario,
                producto.subtotal,
            ]),
        });

        // Total
        const totalY = pdf.autoTable.previous.finalY + 10;
        pdf.text('Total: $' + calcularTotal(), 20, totalY);

        // Monto
        const montoY = totalY + 10; // Ajusta el espaciado aquí
        pdf.text('Monto recibido: $' + montoRecibido, 20, montoY);

        // Cambio
        const cambioY = montoY + 10; // Ajusta el espaciado aquí
        pdf.text('Cambio: $' + cambio(), 20, cambioY);

        // Descargar el PDF
        pdf.save('Pedido_' + fechaFormateada + '.pdf');
    };


    const [userRole, setUserRole] = useState({});

    useEffect(() => {
        // Modificación 2: Parsear el rol al cargar el componente
        const storedRole = localStorage.getItem('userRole');
        console.log('Stored Role:', storedRole);

        const parsedRole = storedRole ? JSON.parse(storedRole) : null;
        console.log('Parsed Role:', parsedRole);

        setUserRole(parsedRole);
    }, []);

    return (
        <div className="registro">
            <MenuHamburguesa />
            <h1>Nuevo pedido</h1>
            <div className="fecha">
                <label className="fecha"><b>Fecha: </b>{hoy.toDateString()}</label> <br />
                <label className="fecha"><b>Empleado: </b>{nombre}</label><br />
                <label className="fehca"><b>No. de Nota: </b>{noteNumber}</label>
            </div>
            <br />
            <div className="pedidos">
                <div className="clientes">
                    <select
                        className="select-cliente"
                        value={clienteSeleccionado}
                        onChange={(e) => setClienteSeleccionado(e.target.value)}
                    >
                        <option value="">Selecciona un cliente</option>
                        {cliente.map((cliente) => (
                            <option key={cliente.idCliente} value={cliente.idCliente}>
                                {cliente.nombre + ' ' + cliente.apellidos}
                            </option>
                        ))}
                    </select>
                    <div className="mas" onClick={openAddClientModal}>
                        <Link className='no-underline'><CgAdd /></Link>
                    </div>
                    {isAddClientModalOpen && (
                        <AddClientModal onClose={closeAddClientModal} />
                    )}
                </div>
            </div>
            {clienteInfo && (
                <div className="detalles-cliente">
                    <h4>Información del Cliente seleccionado</h4>
                    <table>
                        <thead className="ventas">
                            <tr className="ventas">
                                <th className="ventas">ID</th>
                                <th className="ventas">Nombre</th>
                                <th className="ventas">Apellidos</th>
                                <th className="ventas">Teléfono</th>
                                <th className="ventas">Dirección</th>
                            </tr>
                        </thead>
                        <tbody className="ventas">
                            <tr className="ventas">
                                <td className="ventas">{clienteInfo.idCliente}</td>
                                <td className="ventas">{clienteInfo.nombre}</td>
                                <td className="ventas">{clienteInfo.apellidos}</td>
                                <td className="ventas">{clienteInfo.telefono}</td>
                                <td className="ventas">{clienteInfo.direccion}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                </div>
            )}
            <div className="input">
                <div>
                    <Calendar
                        value={fechaEntrega}
                        onChange={handleFechaEntregaChange}
                    />
                </div>
                <div>
                    <input
                        className="cantidad"
                        placeholder="Cantidad"
                        value={cantidad}
                        onChange={handleCantidadChange}
                    />
                    <input
                        className="producto"
                        placeholder="Producto"
                        value={producto}
                        onChange={handleProductoChange}
                    />
                </div>
                <input
                    className="precio"
                    placeholder="Precio Unitario"
                    value={precioUnitario}
                    onChange={handlePrecioUnitarioChange}
                />
                {userRole && userRole.rol && (userRole.rol === "Encargado_Departamento" || userRole.rol === "Gerente_Departamento" || userRole.rol === "Encargado_Caja") ? (
                    <button className="agregar-prod" onClick={agregarProducto}>Agregar Producto</button>
                ) : (
                    <p>No cuentas con los permisos.</p>
                )}
                <div className="scroll-panel">
                    <table>
                        <thead className="ventas">
                            <tr className="ventas">
                                <th className="ventas">Cantidad</th>
                                <th className="ventas">Código Producto</th>
                                <th className="ventas">Producto</th>
                                <th className="ventas">Precio Unitario</th>
                                <th className="ventas">Subtotal</th>
                                <th className="ventas">Quitar</th>
                            </tr>
                        </thead>
                        <tbody className="ventas">
                            {ventas.map((producto, index) => (
                                <tr key={index} className="ventas">
                                    <td className="ventas">{producto.cantidad}</td>
                                    <td className="ventas">{producto.producto}</td>
                                    <td className="ventas">{producto.nombre}</td>
                                    <td className="ventas">${producto.precioUnitario}</td>
                                    <td className="ventas">${parseFloat(producto.subtotal)}</td>
                                    <td className="ventas">
                                        <button className="btn-editar" onClick={() => quitarProducto(index)}>Quitar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h3 className="total">Total: ${calcularTotal()}</h3>
                <input
                    className="producto"
                    placeholder="Monto Recibido"
                    value={montoRecibido}
                    onChange={handleMontoRecibidoChange}
                />
                <h4 className="total">Cambio: ${cambio()}</h4>
                {userRole && userRole.rol && (userRole.rol === "Encargado_Departamento" || userRole.rol === "Gerente_Departamento" || userRole.rol === "Encargado_Caja") ? (
                    <div className="btns">
                        <button className="btn-finalizar" onClick={() => { handleCreatePedido(); downloadPDF(); }}>
                            Guardar Pedido
                        </button>
                        <button className="btn-cancelar" onClick={cancelarPedido}>Cancelar Pedido</button>
                    </div>
                ) : (
                    <p>No cuentas con los permisos.</p>
                )}
            </div>
        </div>
    );
}

export default Pedidos;