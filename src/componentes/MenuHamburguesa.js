import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuHamburguesa.css';
import CerrarSesion from './pantallasGerente/cerrarSesion';

const MenuHamburguesa = ({ items, activeIndex, onItemClick }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div>
            <div className={`menu-btn ${menuOpen ? 'open' : ''}`} onClick={toggleMenu} id="menuHam">
                <div className="btn-line"></div>
                <div className="btn-line"></div>
                <div className="btn-line"></div>
            </div>

            <div className={`menu ${menuOpen ? 'open' : ''}`}>
                <ul className='opciones'>

                    <li className='titulo'>Pedidos</li>
                    <Link to='/pedidos' className='no-underline'><li className='opc'>Crear Pedidos</li></Link>
                    <Link to='/pedidoProceso' className='no-underline'><li className='opc'>Pedidos en Proceso</li></Link>
                    <Link to='/pedidoEntregado' className='no-underline'><li className='opc'>Pedidos Entregados</li></Link>
                    <Link to='/pedidoCancelado' className='no-underline'><li className='opc'>Pedidos Cancelados</li></Link>

                    <li className='titulo'>Empleados</li>
                    <Link to='/registroEmpleado' className='no-underline'><li className='opc'>Registrar Empleado</li></Link>

                    <li className='titulo'>Productos</li>
                    <Link to='/catalogo' className='no-underline'><li className='opc'>Catalogo</li></Link>
                    <Link to='/agregarProducto' className='no-underline'><li className='opc'>Agregar nuevo</li></Link>

                    <li className='titulo'>Informe</li>
                    <Link to='/informeReportes' className='no-underline'><li className='opc'>Reportes</li></Link>
                    <Link to='/crearReporteSemanal' className='no-underline'><li className='opc'>Reporte Semanal</li></Link>
                    <Link to='/crearReporteMensual' className='no-underline'><li className='opc'>Reporte Mensual</li></Link>

                    <li className='titulo'>Otros</li>
                    <Link to='/marcas' className='no-underline'><li className='opc'>Listado marcas</li></Link>
                    <Link to='/categoria' className='no-underline'><li className='opc'>Categoria</li></Link>
                    <Link to='/unidadMedida' className='no-underline'><li className='opc'>Unidad medida</li></Link>

                    <li className='opc'><CerrarSesion /></li>
                </ul>
            </div>
        </div>
    );
};

export default MenuHamburguesa;