import React, { useState, useEffect } from 'react';
import axios from 'axios';

//onst API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080'; 

const DetallesVentaModal = ({ numeroNota, onClose }) => {
  const [detallesVenta, setDetallesVenta] = useState([]);

  useEffect(() => {
    const fetchDetallesVenta = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/detallesventas/byNumeroNota/${numeroNota}`);
        setDetallesVenta(response.data);
      } catch (error) {
        console.error('Error fetching detalles venta:', error);
      }
    };

    fetchDetallesVenta(); // Llamada a la función fetchDetallesVenta

  }, [numeroNota]);

  return (
    <div className="Overlay">
      <div className="Modal">
        <h2 style={{ display: 'flex', alignItems: 'center' }}>
          Detalles de la Venta
          <div className='d botones'>
            <button onClick={onClose} className='btn-editar btn-finalizar' style={{backgroundColor: '#bb2424'}}>
              CLOSE</button>
          </div>
        </h2>
        <table>
          <thead>
            <tr>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Código</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {detallesVenta.map((detalle) => (
              // console.log(detalle),
              <tr key={detalle.codigo}>
                <td>{detalle.cantidad}</td>
                <td>{detalle.subtotal}</td>
                <td>{detalle.codigo}</td>
                <td>{detalle.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>        
      </div>
    </div>
  );
};

export default DetallesVentaModal;
