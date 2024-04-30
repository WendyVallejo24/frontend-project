import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuHamburguesa from '../../MenuHamburguesa';
import '../style/catalogo.css';
import '../style/salesReport.css';

//const API_URL = 'https://abarrotesapi-service-api-yacruz.cloud.okteto.net';
const API_URL = 'http://localhost:8080';

const MarcaList = () => {
  const [marcas, setMarcas] = useState([]);
  const [nombreMarca, setNombreMarca] = useState('');
  const [idMarca, setIdMarca] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const fetchMarcas = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/marcas`);
      setMarcas(response.data);
    } catch (error) {
      console.error('Error al obtener marcas', error);
    }
  };

  const handleCrearMarca = async () => {
    try {
      if (nombreMarca.length < 1) {
        alert('El campo no debe estar vacío.');
        return;
      }

      if (marcas.some(marca => marca.nombre.toLowerCase() === nombreMarca.toLowerCase())) {
        alert('Ya existe una marca con ese nombre.');
        return;
      }

      const nuevaMarca = {
        idMarca: idMarca,
        nombre: nombreMarca.toLowerCase(),
      };

      const response = await axios.post(`${API_URL}/api/marcas`, nuevaMarca);
      console.log('Marca creada:', response.data);
      alert('Marca creada con éxito.');
      setIdMarca('');
      setNombreMarca('');
      fetchMarcas();
    } catch (error) {
      console.error('Error al crear marca', error);
      alert('Error al crear marca.');
    }
  };

  const handleEditarMarca = (idMarca) => {
    const marca = marcas.find((m) => m.idMarca === idMarca);
    if (marca) {
      setMarcaSeleccionada(marca);
      setNombreMarca(marca.nombre);
      setModoEdicion(true);
    } else {
      console.error(`No se encontró la marca con ID: ${idMarca}`);
      alert('Error al editar marca.');
    }
  };

  const handleActualizarMarca = async () => {
    try {
      if (nombreMarca.length < 1) {
        alert('El campo no debe estar vacío.');
        return;
      }

      if (marcas.some(marca => marca.nombre.toLowerCase() === nombreMarca.toLowerCase())) {
        alert('Ya existe una marca con ese nombre.');
        return;
      }

      const marcaActualizada = {
        nombre: nombreMarca.toLowerCase(),
      }
      const response = await axios.put(
        `${API_URL}/api/marcas/${marcaSeleccionada.idMarca}`,
        marcaActualizada
      );
      console.log('Marca actualizada:', response.data);
      alert('Marca actualizada con éxito.');
      setNombreMarca('');
      setMarcaSeleccionada('');
      setModoEdicion(false);
      fetchMarcas();
    } catch (error) {
      console.error('Error al actualizar marca', error);
      alert('Error al actualizar marca.');
    }
  };

  const handleEliminarMarca = async (idMarca) => {
    try {
      await axios.delete(`${API_URL}/api/marcas/${idMarca}`);
      alert('Marca eliminada con éxito.');
      fetchMarcas();
    } catch (error) {
      console.error('Error al eliminar marca', error);
      alert('Error al eliminar marca.');
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return (
    <div className='registro'>
      <MenuHamburguesa />
      <h1>Administrar Marcas</h1>
      <div>
        <h4>{modoEdicion ? 'Editar' : 'Agregar'} Marca</h4>
        <input
          className='input-producto'
          type="text"
          placeholder="Nombre de la Marca"
          value={nombreMarca}
          onChange={(e) => setNombreMarca(e.target.value.toLowerCase())}
        />
        <div className='botones'>
          {modoEdicion ? (
            <button className='btn-finalizar' onClick={handleActualizarMarca}>Actualizar</button>
          ) : (
            <button className='btn-finalizar' onClick={handleCrearMarca}>Agregar</button>
          )}
        </div>
      </div>

      <div>
        <h4>Listado de Marcas</h4>
        <table className='registroEmp'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((marca) => (
              <tr key={marca.idMarca}>
                <td>{marca.idMarca}</td>
                <td>{marca.nombre}</td>
                <td className='btn-ventas'>
                  <div className='botones'>
                    <button className='btn-finalizar' onClick={() => handleEditarMarca(marca.idMarca)}>Editar</button>
                    <button className='btn-cancelar' onClick={() => handleEliminarMarca(marca.idMarca)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarcaList;