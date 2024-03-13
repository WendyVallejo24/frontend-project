import React, { useState, useEffect } from "react";
import "./pantallasGerente/style/salesReport.css";
import "./pantallasGerente/style/registroEmp.css";
import "./Ventas.css";
import axios from 'axios';
import { format } from 'date-fns';
import MenuHamburguesa from './MenuHamburguesa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Ventas = () => {
    const [cantidad, setCantidad] = useState("");
    const [producto, setProducto] = useState("");
    const [precioUnitario, setPrecioUnitario] = useState("");
    const [ventas, setVentas] = useState([]);
    const [montoRecibido, setMontoRecibido] = useState("");
    const [departamento, setDepartamento] = useState([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");

    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);

    const fechaFormateada = format(hoy, 'yyyy-MM-dd');
    //const URL_API = "https://abarrotesapi-service-api-yacruz.cloud.okteto.net/";
    const URL_API = 'http://localhost:8080/'; 

    // Verificar si localStorage tiene datos y asignar a userRole
    const storedUserRole = localStorage.getItem('userRole');
    console.log('Valor almacenado en localStorage:', storedUserRole);
    const userRole = storedUserRole ? JSON.parse(storedUserRole) : null;
    const id_empleado = localStorage.getItem('idEmpleado');
    const nombre = localStorage.getItem('nombreEmpleado');

    const handleCreateVenta = async () => {
        try {
            const nuevaVenta = {
                fecha: fechaFormateada,
                total: parseFloat(calcularTotal()),
                anticipo: {
                    monto: parseFloat(calcularTotal()), // Asume que el anticipo es el total de la venta                
                },
                cliente: {
                    idCliente: 1
                },
                empleado: {
                    idEmpleado: parseInt(id_empleado)
                },
                departamento: {
                    idDepartamento: parseInt(departamentoSeleccionado)
                },
                detallePedido: {
                    idDetallePedido: 3,
                    fechaEntrega: "2023-12-18",
                    horaEntrgea: "00:00"
                },
                detalleVenta: ventas.map((producto) => ({
                    cantidad: parseFloat(producto.cantidad),
                    subtotal: parseFloat(producto.subtotal),
                    producto: {
                        codigo: parseInt(producto.producto)
                    }
                })),
            };
            console.log('Nueva venta:', nuevaVenta);
            const response = await axios.post(URL_API + 'api/notasventas/crearlimpio', nuevaVenta);
            console.log('Venta creada:', response.data);
            alert('Nota de venta creada con éxito');
            resetForm();
        } catch (error) {
            console.error('Error al crear la venta:', error);
            alert('Error al crear la nota de venta');
        }
    }

    useEffect(() => {
        const fetchDepartamento = async () => {
            try {
                const response = await axios.get(URL_API + 'api/departamento');
                setDepartamento(response.data);
            } catch (error) {
                console.error('Error al obtener los departamentos', error);
            }
        };
        fetchDepartamento();
    }, []);

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
                    
                    setCantidad(stockDisponible);
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

        if (!isNaN(totalVenta) && !isNaN(montoRecibidoFloat)) {
            return (montoRecibidoFloat - totalVenta).toFixed(2);
        } else {
            return "";
        }
    };

    const cancelarVenta = () => {
        if (window.confirm("¿Estás seguro de cancelar la venta?")) {
            resetForm();
            console.log("Venta cancelada");
        }
    };

    const resetForm = () => {
        setDepartamentoSeleccionado('');
        setCantidad("");
        setProducto("");
        setPrecioUnitario("");
        setVentas([]);
        setMontoRecibido("");
    }

    console.log('userRole en RegistroEmp:', userRole);
    console.log('userRole.rol en RegistroEmp:', userRole && userRole.rol);
    console.log('¿Es Jefe?', userRole && userRole.rol && userRole.rol.includes("Jefe"));

    // Componente para la nota de venta en PDF
    const downloadPDF = () => {
        const pdf = new jsPDF();
        pdf.text('Nota de venta', 20, 20);
        pdf.text('Fecha: ' + hoy.toDateString(), 20, 30);
        pdf.text('Empleado: ' + nombre, 20, 40);

        // Detalles del Reporte
        pdf.text('Productos:', 20, 60);
        pdf.autoTable({
            startY: 70,
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
        pdf.save('SalesReport_' + fechaFormateada + '.pdf');
    };

    return (
        <div className="registro">
            <MenuHamburguesa />
            <h1>Ventas</h1>
            <div className="fecha">
                <label className="fecha">Fecha : {hoy.toDateString()}</label><br />
                <label className="fecha"><b>Empleado: </b>{nombre}</label>
            </div>
            <br />
            <select
                className="select-producto"
                value={departamentoSeleccionado}
                onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
            >
                <option value="">Selecciona un departamento</option>
                {departamento.map((departamento) => (
                    <option key={departamento.idDepartamento} value={departamento.idDepartamento}>
                        {departamento.nombre}
                    </option>
                ))}
            </select>
            {userRole && userRole.rol && (userRole.rol === "Encargado_Departamento" || userRole.rol === "Gerente_Departamento" || userRole.rol === "Encargado_Caja") ? (
                <div className="input">
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
                    /> <br />
                    <input
                        className="precio"
                        placeholder="Precio Unitario"
                        value={precioUnitario}
                        onChange={handlePrecioUnitarioChange}
                    />
                    <button className="agregar-prod" onClick={agregarProducto}>Agregar Producto</button>
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
                    <div className="btns">
                        <button className="btn-finalizar" onClick={() => { handleCreateVenta(); downloadPDF(); }}>
                            Finalizar Venta
                        </button>
                        <button className="btn-cancelar" onClick={cancelarVenta}>Cancelar Venta</button>
                    </div>
                </div>
            ) : (
                <p>No cuentas con los permisos.</p>
            )}
        </div>
    );
}

export default Ventas;