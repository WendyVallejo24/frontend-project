// UnidadMedidaList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../../MenuHamburguesa';
import '../style/catalogo.css';
import '../style/salesReport.css';

//const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080'; 

const UnidadMedidaList = () => {
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [nombreUnidadMedida, setNombreUnidadMedida] = useState('');
  const [idUnidadMedida, setIdUnidadMedida] = useState('');
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);

  const fetchUnidadesMedida = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/unidadesMedida`);
      setUnidadesMedida(response.data);
    } catch (error) {
      console.error('Error al obtener unidades de medida', error);
    }
  };

  const handleCrearUnidadMedida = async () => {
    try {

      if (nombreUnidadMedida.length < 1) {
        alert('El campo no debe estar vacío.');
        return;
      }

      if (unidadesMedida.some(unidadMedida => unidadMedida.nombre.toLowerCase() === nombreUnidadMedida.toLowerCase())) {
        alert('Ya existe una unidad de medida con ese nombre.');
        return;
      }

      const nuevaUnidadMedida = {
        idUnidadMed: idUnidadMedida,
        nombre: nombreUnidadMedida.toLowerCase(),
      };

      const response = await axios.post(`${API_URL}/api/unidadesMedida`, nuevaUnidadMedida);
      console.log('Unidad de medida creada:', response.data);
      alert('Unidad de medida creada con éxito.');
      setIdUnidadMedida('');
      setNombreUnidadMedida('');
      fetchUnidadesMedida();
    } catch (error) {
      console.error('Error al crear unidad de medida', error);
      alert('Error al crear unidad de medida.');
    }
  };

  const handleEditarUnidadMedida = (idUnidadMed) => {
    console.log('Editar unidad de medida con ID:', idUnidadMed);
    const unidadMedida = unidadesMedida.find((u) => u.idUnidadMedida === idUnidadMed);
    if (unidadMedida) {
      setUnidadMedidaSeleccionada(unidadMedida);
      setNombreUnidadMedida(unidadMedida.nombre);
      setModoEdicion(true);
    } else {
      console.error(`No se encontró la unidad de medida con ID: ${idUnidadMed}`);

    }
  };

  const handleActualizarUnidadMedida = async () => {
    console.log('unidadMedidaSeleccionada:', unidadMedidaSeleccionada);
    try {
      if (nombreUnidadMedida.length < 1) {
        alert('El campo no debe estar vacío.');
        return;
      }
      
      const unidadMedidaActualizada = {
        nombre: nombreUnidadMedida.toLowerCase(),
      };
      console.log(unidadMedidaActualizada);

      const response = await axios.put(
        `${API_URL}/api/unidadesMedida/${unidadMedidaSeleccionada.idUnidadMedida}`,
        unidadMedidaActualizada
      );

      console.log('Unidad de medida actualizada:', response.data);
      alert('Unidad de medida actualizada con éxito.');
      setNombreUnidadMedida('');
      setUnidadMedidaSeleccionada('');
      setModoEdicion(false);
      fetchUnidadesMedida();
    } catch (error) {
      console.error('Error al actualizar unidad de medida', error);
      alert('Error al actualizar unidad de medida.');
    }
  };

  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  return (
    <div className='registro'>
      <MenuHamburguesa />
      <h1>Administrar Unidades de Medida</h1>
      <div>
        <h4>{modoEdicion ? 'Editar' : 'Crear'} Unidad de Medida</h4>
        <input
          className='input-producto'
          type="text"
          placeholder="Nombre de la Unidad de Medida"
          value={nombreUnidadMedida}
          onChange={(e) => setNombreUnidadMedida(e.target.value.toLowerCase())}
        />
        <div className='botones'>
          {modoEdicion ? (
            <button className='btn-finalizar' onClick={handleActualizarUnidadMedida}>Actualizar</button>
          ) : (
            <button className='btn-finalizar' onClick={handleCrearUnidadMedida}>Crear</button>
          )}
        </div>
      </div>

      {/* Listado de Unidades de Medida */}
      <div>
        <h4>Listado de Unidades de Medida</h4>
        <table className='registroEmp'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {unidadesMedida.map((unidadMedida) => (
              // console.log(unidadMedida),
              <tr key={unidadMedida.idUnidadMedida}>
                <td>{unidadMedida.idUnidadMedida}</td>
                <td>{unidadMedida.nombre}</td>
                <td className='btn-ventas'>
                  <button className='btn-finalizar' onClick={() => handleEditarUnidadMedida(unidadMedida.idUnidadMedida)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnidadMedidaList;