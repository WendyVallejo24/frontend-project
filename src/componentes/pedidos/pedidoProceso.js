import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../MenuHamburguesa';
import '../pantallasGerente/style/catalogo.css';
import '../pantallasGerente/style/salesReport.css';
import { IoMdArrowDropdownCircle } from "react-icons/io";
import DetallesVentaModal from './DetallesVentaModal';

//const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080';

const VistaNotaVentaPedidoEnProcesoComponent = () => {
  const [notasVentaEnProceso, setNotasVentaEnProceso] = useState([]);
  const [filtroNombreCliente, setFiltroNombreCliente] = useState('');
  const [notasFiltradas, setNotasFiltradas] = useState([]);
  const [showDetalles, setShowDetalles] = useState(false);
  const [selectedNota, setSelectedNota] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [abonoAmount, setAbonoAmount] = useState(0);

  useEffect(() => {
    fetchNotasVentaEnProceso();
  }, []);

  const fetchNotasVentaEnProceso = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/vista-nota-venta-pedido-en-proceso`);
      setNotasVentaEnProceso(response.data);
      setNotasFiltradas(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filtroNombreCliente, notasVentaEnProceso]);

  const applyFilters = () => {
    const notasFiltradas = notasVentaEnProceso.filter(nota => {
      // Verificar si la propiedad nombreCompletoCliente está definida en la nota
      if (nota.nombreCompletoCliente) {
        return nota.nombreCompletoCliente.toLowerCase().includes(filtroNombreCliente.toLowerCase());
      }
      return false; // O regresar false si la propiedad no está definida
    });
    setNotasFiltradas(notasFiltradas);
  };

  const handleVerDetalles = (nota) => {
    setSelectedNota(nota);
    setShowDetalles(true);
  };

  const handleCancelarPedido = async (nota) => {
    try {
      const response = await axios.post(`${API_URL}/api/pedido/modificarpedido`, {
        nNota: nota.numeroNota,
        idEstadoPedido: 3, // 3 representa el estado de pedido "Cancelado"
      });
      await fetchNotasVentaEnProceso();

      if (response.status === 201) {
        console.log('Pedido cancelado con éxito', response.data);
        alert('Pedido cancelado con éxito');
      } else {
        console.error('Error al cancelar el pedido:', response.data);
        alert('Error al cancelar el pedido');
      }
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      alert('Error al cancelar el pedido');
    }
  };

  const handleEntregarPedido = async (nota) => {
    try {
      const response = await axios.post(`${API_URL}/api/pedido/modificarpedido`, {
        nNota: nota.numeroNota,
        idEstadoPedido: 1, // 1 representa el estado de pedido "Entregado"
      });
      await fetchNotasVentaEnProceso();

      if (response.status === 201) {
        console.log('Pedido entregado con éxito', response.data);
        alert('Pedido entregado con éxito');
      } else {
        console.error('Error al entregar el pedido:', response.data);
        alert('Error al entregar el pedido');
      }
    } catch (error) {
      console.error('Error al entregar el pedido:', error);
      alert('Error al entregar el pedido', error);
    }
  };

  const handlePagarYEntregarPedido = async (nota) => {
    console.log('Clic para Pagar y entregar pedido:', nota);
    try {
      // Calcular el monto que falta pagar
      const restoAPagar = nota.resto;

      // Realizar la solicitud al servidor para pagar y entregar el pedido
      const response = await axios.post(`${API_URL}/api/pedido/pagarentregarpedido`, {
        idPedido: 1,
        nNota: nota.numeroNota,
        pago: restoAPagar,
        // Otros datos necesarios para la solicitud, si los hay
      });

      // Después de la acción, actualizar los datos
      await fetchNotasVentaEnProceso();

      if (response.status === 201) {
        console.log('Pedido pagado y entregado con éxito');
        alert('Pagado y entregado con éxito');
      } else {
        console.error('Error al pagar y entregar el pedido:', response.data);
        alert('Error al pagar y entregar el pedido');
      }
    } catch (error) {
      console.error('Error en la solicitud', error);
      alert('Error en la solicitud');
    }
  };

  const handleAbonar = (nota) => {
    if (nota.resto <= 0) {
      console.error('La nota ya se encuentra pagada.');
      alert('La nota ya se encuentra pagada.');
      return;
    }
    setSelectedNota(nota);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleConfirmAbono = async () => {
    try {
      if (!selectedNota) {
        alert('No se ha seleccionado una nota para abonar.');
        return;
      }

      if (!abonoAmount || abonoAmount <= 0) {
        alert('La cantidad de abono debe ser un número positivo.');
        return;
      }

      const abonarNota = {
        nNota: parseInt(selectedNota.numeroNota),
        pago: parseFloat(abonoAmount),
      };

      const response = await axios.post(`${API_URL}/api/notasventas/pagarnota`, abonarNota);
      console.log(response.data);
      console.log(`Abono de: ${abonoAmount}`);
      alert(`Abono de: ${abonoAmount}`);
      setShowModal(false);
      fetchNotasVentaEnProceso();

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
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
    <div className='registro'>
      <MenuHamburguesa />
      {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
        <h1 className='responsive-title'>Estado de pedido y de pago</h1>
      ) : (
        <p></p>
      )}
      <div className='btns'>
        {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
          <h4>Buscar nota:</h4>
        ) : (
          <p></p>
        )}
        {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
          <input
            className='input-producto'
            type="text"
            placeholder="Nombre del cliente"
            value={filtroNombreCliente}
            onChange={(e) => setFiltroNombreCliente(e.target.value)}
          />
        ) : (
          <p>No cuentas con los permisos.</p>
        )}

      </div>
      <div className="rectangulos-container">
        {notasFiltradas.map((nota) => (
          // console.log(nota),
          <div key={nota.idAnticipo} className="rectangulo">
            <div className="botones">
              {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                <h4>Acciones del pedido:</h4>
              ) : (
                <p> </p>
              )}
              <div className='r-1'>
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                  <button className='btn-finalizar rh' onClick={() => handleCancelarPedido(nota)} data-testid="cancelar-button">Cancelar Pedido</button>
                ) : (
                  <p> </p>
                )}
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                  <button className='btn-finalizar rh' onClick={() => handleEntregarPedido(nota)}>Entregar Pedido</button>
                ) : (
                  <p> </p>
                )}
                {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                  <button className='btn-finalizar rh' onClick={() => handlePagarYEntregarPedido(nota)} data-testid="pagar-entregar-button">Pagar y entregar</button>
                ) : (
                  <p> </p>
                )}
                {nota.estadoPago === 'Pendiente' && (
                  <button
                    className='btn-finalizar rh'
                    onClick={() => handleAbonar(nota)}
                  >
                    Abonar
                  </button>
                )}
              </div>
            </div>
            <div className="rectangulo-header" style={{ backgroundColor: '#f6f6f6' }}>
              {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                <div className='r-1'>
                  <p><b>Número de Nota: </b>{nota.numeroNota}</p>
                  <p><b>Fecha de Nota: </b>{nota.fechaNota}</p>
                  <p><b>Estado Pago: </b>{nota.estadoPago}</p>
                  <p><b>Último pago: </b>{nota.fechaAnticipo}</p>
                </div>
              ) : (
                <p> </p>
              )}
              {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
                <div className='r-1'>
                  <p><b>Empleado: </b>{nota.nombreCompletoEmpleado}</p>
                  {/* <p><b>Estado: </b>{nota.estado}</p> */}
                </div>
              ) : (
                <p> </p>
              )}
            </div>
            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (
              <div className="rectangulo-header" style={{ backgroundColor: '#eee' }}>
                <div className='r2'>
                  <b>Datos Cliente:</b>
                </div>
                <div className='r-1'>
                  <p><b>Nombre Cliente: </b>{nota.nombreCompletoCliente}</p>
                  <p><b>Teléfono: </b>{nota.telefono}</p>
                </div>
                <div className='r-2'>
                  <p><b>Dirección: </b>{nota.direccion}</p>
                </div>
              </div>
            ) : (
              <p> </p>
            )}

            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (

              <div className="rectangulo-header" style={{ backgroundColor: '#ddd' }}>
                <div className='r-1'>
                  <p><b>Fecha Anticipo: </b>{nota.fechaAnticipo}</p>
                  <p><b>Estado Pedido: </b>{nota.estado}</p>
                </div>
                <div className='r-1'>
                  <p><b>Total: </b>{nota.total}</p>
                  <p><b>Abonado: </b>{nota.monto}</p>
                  <p><b>Debe: </b>{nota.resto}</p>
                </div>
              </div>
            ) : (
              <p> </p>
            )}
            {userRole && userRole.rol && userRole.rol.includes("Vendedor") ? (

              <div className="rectangulo-header" style={{ backgroundColor: '#c6c6c6' }}>
                <div className='r-1'>
                  <button className='btn-detalles' onClick={() => handleVerDetalles(nota)}>
                    Ver Detalles
                    <IoMdArrowDropdownCircle className='icon' />
                  </button>
                </div>
              </div>
            ) : (
              <p> </p>
            )}
          </div>
        ))}
        {/* Ventana emergente para los detalles de la venta */}
        {showDetalles && selectedNota && (
          <DetallesVentaModal
            numeroNota={selectedNota.numeroNota}
            onClose={() => setShowDetalles(false)}
          />
        )}
        {/* Ventana emergente para el abono */}
        {showModal && (
          <div className="Overlay">
            <div className="Modal">
              <span className="close" onClick={handleModalClose}>
                &times;
              </span>
              <h2>Abonar</h2>
              <p>Introduce la cantidad de dinero a abonar:</p>
              <input
                className='input-producto'
                type="number"
                value={abonoAmount}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^[0-9]*$/.test(inputValue)) {
                    setAbonoAmount(inputValue);
                  }
                }}
              />
              <div className='botones'>
                <button className='btn-finalizar' onClick={handleConfirmAbono}>Confirmar Abono</button>
                <button className='btn-cancelar' onClick={handleModalClose}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaNotaVentaPedidoEnProcesoComponent;
