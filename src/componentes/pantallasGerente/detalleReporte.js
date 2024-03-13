import React, { useState, useEffect } from 'react';
import './style/registroEmp.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DetalleReporte = () => {
  const { id } = useParams();
  const [reporte, setReporte] = useState(null);
  //const URL_API = "https://abarrotesapi-service-api-yacruz.cloud.okteto.net/";
  const URL_API = 'http://localhost:8080/'; 

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await axios.get(URL_API +  `api/reportes/${id}`);
        setReporte(response.data);
      } catch (error) {
        console.error(`Error al obtener el detalle del reporte con ID ${id}:`, error);
      }
    };

    fetchReporte();
  }, [id]);


  // Función para calcular el total basado en los subtotales
  const calcularTotal = () => {
    let total = 0;

    // Verificar si reporte y reporte.dtodetalleReporte están definidos
    if (reporte && reporte.dtodetalleReporte) {
      // Verificar si reporte.dtodetalleReporte es un array antes de usar forEach
      if (Array.isArray(reporte.dtodetalleReporte)) {
        reporte.dtodetalleReporte.forEach((detalle) => {
          total += detalle.subtotal;
        });
      }
    }

    return total;
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text('Detalle del Reporte', 20, 20);
    pdf.text(`CVE: ${reporte.cve}`, 20, 30);
    pdf.text(`Descripción: ${reporte.descripcion}`, 20, 40);

    // Detalles del Reporte
    pdf.text('Detalles del Reporte:', 20, 60);
    pdf.autoTable({
      startY: 70,
      head: [['Fecha', 'Marca', 'Nombre Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
      body: reporte.dtodetalleReporte.map((detalle) => [
        detalle.fecha,
        detalle.marca,
        detalle.nombreProducto,
        detalle.cantidad,
        detalle.precioUnitario,
        detalle.subtotal,
      ]),
    });

    // Total
    pdf.text(`Total: ${calcularTotal()}`, 20, pdf.autoTable.previous.finalY + 10);

    // Descargar el PDF
    pdf.save('DetalleReporte.pdf');
  };

  return (
    <div className="registro">
      <h1>Detalle del Reporte</h1>
      <Link to="/informeReportes">Volver a la lista de reportes</Link>

      {reporte ? (
        <div style={{ textAlign: 'center' }}>
          <p>CVE: {reporte.cve}</p>
          <p>Descripción: {reporte.descripcion}</p>
          <br />
          {reporte.dtodetalleReporte && reporte.dtodetalleReporte.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Marca</th>
                  <th>Nombre Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {reporte.dtodetalleReporte.map((detalle) => (
                  <tr key={detalle.idDetalleVenta}>
                    <td>{detalle.fecha}</td>
                    <td>{detalle.marca}</td>
                    <td>{detalle.nombreProducto}</td>
                    <td>{detalle.cantidad}</td>
                    <td>{detalle.precioUnitario}</td>
                    <td>{detalle.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay detalles disponibles.</p>
          )}

          {/* Mostrar el total calculado */}
          <p>Total: {calcularTotal()}</p>

          {/* Agregar botón para descargar el PDF */}
          <button style={{ fontSize: '1.2em' }} onClick={downloadPDF}>Descargar PDF</button>
        </div>
      ) : (
        <p>Cargando detalle del reporte...</p>
      )}
    </div>
  );

};

export default DetalleReporte;
