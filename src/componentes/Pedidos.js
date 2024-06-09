import React, { useState, useEffect } from "react";
import MenuHamburguesa from './MenuHamburguesa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { CgAdd } from "react-icons/cg";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './pantallasGerente/style/salesReport.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Ventas.css';
import AddClientModal from './AddClientModal';

const id_empleado = localStorage.getItem('idEmpleado');
const nombre = localStorage.getItem('nombreEmpleado');

//const URL_API = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net/';
const URL_API = 'http://localhost:8080/';

const Calendar = ({ value, onChange }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleDateChange = date => {
        onChange(date);
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
                    selected={value}
                    dateFormat="yyyy-MM-dd"
                    onChange={handleDateChange}
                    onClickOutside={closeCalendar}
                    onClose={closeCalendar}
                />
            </div>
        </div>
    );
};

const Pedidos = ({ handleCreateClient }) => {
    const [cliente, setCliente] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
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

    const fetchLastNoteNumber = async () => {
        try {
            const response = await axios.get(URL_API + 'api/notasventas/lastNoteNumber');
            const lastNoteNumberFromAPI = response.data + 1; // Suponiendo que la respuesta es el número de nota más reciente
            setNoteNumber(lastNoteNumberFromAPI);
        } catch (error) {
            console.error('Error al obtener el último número de nota:', error);
        }
    };

    useEffect(() => {
        fetchLastNoteNumber();
    }, []);

    const generateNoteNumber = (lastNoteNumber) => {
        // Obtener el número de nota actual y aumentar en 1
        const currentNoteNumber = lastNoteNumber + 1;
        // Formatear el número como un string con dos dígitos
        const formattedNoteNumber = currentNoteNumber.toString().padStart(2, '0');
        return formattedNoteNumber;
    };

    const monto = () => {
        const montoRecibidoFloat = parseFloat(montoRecibido);
        const total = parseFloat(calcularTotal());

        if (isNaN(montoRecibidoFloat) || isNaN(total)) {
            return 0;
        }

        if (montoRecibidoFloat >= total) {
            return total;
        } else {
            return montoRecibidoFloat;
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
            console.log('Nuevo Pedido:', nuevoPedido);
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

    };

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await axios.get(URL_API + 'api/clientes');
                if (response && response.data) {
                    setCliente(response.data);
                } else {
                    console.error('La respuesta del servidor no contiene datos válidos:', response);
                }
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

    const agregarProducto = async () => {
        if (cantidad && producto && precioUnitario) {
            try {
                const response = await fetch(URL_API + `api/productos/${producto}`);
                if (!response.ok) {
                    throw new Error('Error al obtener la información del producto');
                }

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
                // Manejar el error mostrando un mensaje al usuario
                alert("Error al obtener la información del producto. Inténtelo de nuevo más tarde.");
            }
        }
    };

    const quitarProducto = (index) => {
        const nuevasVentas = [...ventas];
        nuevasVentas.splice(index, 1);
        setVentas(nuevasVentas);
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

    const cancelarPedido = async () => {
        try {
            console.log('Pedido cancelado');
            window.alert('Pedido cancelado');
            resetForm();
        } catch (error) {
            console.error('Error al cancelar el pedido:', error);
            alert('Error al cancelar el pedido');
        }
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

    const resetForm = () => {
        setClienteSeleccionado('');
        setFechaEntrega(null);
        setCantidad("");
        setProducto("");
        setPrecioUnitario("");
        setVentas([]);
        setMontoRecibido("");
    }
    const estadoPago = () => {
        if (parseFloat(montoRecibido) < parseFloat(calcularTotal())) {
            return "Pendiente";
        } else if (parseFloat(montoRecibido) >= parseFloat(calcularTotal())) {
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
        console.log('User Role:', userRole);
    }, []);

    return (
        <div className="registro">
            <MenuHamburguesa />
            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                <h1 className='responsive-title'>Nuevo pedido</h1>
            ) : (
                <p></p>
            )}
            <div className="fecha">
                <label className="fecha"><b>Fecha: </b>{hoy.toDateString()}</label> <br />
                <label className="fecha"><b>Empleado: </b>{nombre}</label><br />
                <label className="fecha"><b>No. de Nota: </b>{noteNumber}</label>
            </div>
            <br />
            <div className="pedidos">
                <div className="clientes">
                    {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
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
                    ) : (
                        <p>No cuentas con los permisos.</p>
                    )}
                    <div className="mas" onClick={openAddClientModal}>
                        {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                            <Link className='no-underline2'><CgAdd /></Link>
                        ) : (
                            <p></p>
                        )}
                    </div>
                    {isAddClientModalOpen && (
                        <AddClientModal
                            onClose={closeAddClientModal}
                            setCliente={setCliente}
                            setClienteSeleccionado={setClienteSeleccionado}
                            setClienteCreado={setClienteCreado}
                            handleCreateClient={handleCreateClient}
                        />
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
                    {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                        <Calendar
                            value={fechaEntrega}
                            onChange={setFechaEntrega}
                        />
                    ) : (
                        <p></p>
                    )}
                </div>
                <div>
                    {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                        <input
                            className="cantidad"
                            placeholder="Cantidad"
                            value={cantidad}
                            onChange={handleCantidadChange}

                        />
                    ) : (
                        <p></p>
                    )}
                    {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                        <input
                            className="producto"
                            placeholder="Producto"
                            value={producto}
                            onChange={handleProductoChange}
                        />
                    ) : (
                        <p></p>
                    )}
                </div>
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                    <input
                        className="precio"
                        placeholder="Precio Unitario"
                        value={precioUnitario}
                        onChange={handlePrecioUnitarioChange}
                    />
                ) : (
                    <p></p>
                )}
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                    <button className="agregar-prod" type="button" onClick={agregarProducto} >Agregar</button>
                ) : (
                    <p></p>
                )}


                <div className="scroll-panel">
                    {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
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
                    ) : (
                        <p></p>
                    )}
                </div>
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                    <h3 className="total">Total: ${calcularTotal()}</h3>
                ) : (
                    <p></p>
                )}
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                    <input
                        className="producto"
                        placeholder="Monto Recibido"
                        value={montoRecibido}
                        onChange={handleMontoRecibidoChange}
                    />
                ) : (
                    <p></p>
                )}
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                    <h4 className="total">Cambio: ${cambio()}</h4>
                ) : (
                    <p></p>
                )}

                <div className="btns">
                    {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                        <button className="btn-finalizar" onClick={() => { handleCreatePedido(); downloadPDF(); }}>
                            Guardar Pedido
                        </button>
                    ) : (
                        <p></p>
                    )}
                    {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                        <button className="btn-cancelar" onClick={cancelarPedido}>Cancelar Pedido</button>
                    ) : (
                        <p></p>
                    )}
                </div>

            </div>

        </div>

    );
}

export default Pedidos;