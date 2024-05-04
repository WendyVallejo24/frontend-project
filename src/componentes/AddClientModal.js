import React, { useState } from "react";
import MenuHamburguesa from './MenuHamburguesa';
import axios from 'axios';

const URL_API = 'http://localhost:8080/';

const AddClientModal = ({ onClose, setCliente, setClienteSeleccionado, setClienteCreado }) => {
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");

    const fetchClientes = async () => {
        try {
            const response = await axios.get(URL_API + 'api/clientes');
            setCliente(response.data);
        } catch (error) {
            console.error('Error al obtener los clientes', error);
        }
    };

    const handleCreateClient = async () => {
        try {
            const nuevoCliente = {
                nombre: nombre,
                apellidos: apellidos,
                telefono: telefono,
                direccion: direccion,
            };

            const response = await axios.post(URL_API + 'api/clientes', nuevoCliente);
            await fetchClientes();
            console.log('Cliente creado:', response.data);
            setClienteSeleccionado(response.data.idCliente);
            window.alert('Cliente creado con éxito');
            setClienteCreado(true);
            onClose();
        } catch (error) {
            console.error('Error al crear el cliente:', error);
            window.alert('Error al crear el cliente');
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
        <div className="modal-overlay">
            <div className="modal-content">
                <MenuHamburguesa />
                <h2 className='responsive-title'>Nuevo Cliente</h2>

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
                    <button className="btn-finalizar" data-testid="add-client-button" onClick={handleCreateClient}>Guardar</button>
                    <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default AddClientModal;
