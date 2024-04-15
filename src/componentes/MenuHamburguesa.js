import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuHamburguesa.css';
import CerrarSesion from './pantallasGerente/cerrarSesion';
import logoFerreteria from './img/FERRETERIA.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUsers, faBox, faFileAlt, faCog } from '@fortawesome/free-solid-svg-icons';

const MenuHamburguesa = ({ items, activeIndex, onItemClick }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState('');
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setSubmenuOpen(''); /*Agregado*/
    };

    const toggleSubmenu = (menu) => {
        setSubmenuOpen(submenuOpen === menu ? '' : menu);
    };

    return (
        <div>
            <div className={`menu-btn ${menuOpen ? 'open' : ''}`} onClick={toggleMenu} id="menuHam">
                <div className="btn-line"></div>
                <div className="btn-line"></div>
                <div className="btn-line"></div>
            </div>


            <div className={`menu ${menuOpen ? 'open' : ''}`}>
                <img className="logo" src={logoFerreteria} alt="Logo Empresa" />
                <ul className='opciones'>
                    <li className={`titulo ${submenuOpen === 'Pedidos' ? 'active' : ''}`} onClick={() => toggleSubmenu('Pedidos')}>
                        <FontAwesomeIcon icon={faShoppingCart} /> Pedidos

                        {submenuOpen === 'Pedidos' && (
                            <ul className='submenu'>
                                <li><Link to='/pedidos' className='no-underline' onClick={closeMenu}>Crear Pedidos</Link></li>
                                <li><Link to='/pedidoProceso' className='no-underline' onClick={closeMenu}>Pedidos en Proceso</Link></li>
                                <li><Link to='/pedidoEntregado' className='no-underline' onClick={closeMenu}>Pedidos Entregados</Link></li>
                                <li><Link to='/pedidoCancelado' className='no-underline' onClick={closeMenu}>Pedidos Cancelados</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className={`titulo ${submenuOpen === 'Empleados' ? 'active' : ''}`} onClick={() => toggleSubmenu('Empleados')}>
                        <FontAwesomeIcon icon={faUsers} /> Empleados

                        {submenuOpen === 'Empleados' && (
                            <ul className='submenu'>
                                <li><Link to='/registroEmpleado' className='no-underline' onClick={closeMenu}>Registrar Empleado</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className={`titulo ${submenuOpen === 'Productos' ? 'active' : ''}`} onClick={() => toggleSubmenu('Productos')}>
                        <FontAwesomeIcon icon={faBox} /> Productos
                        {submenuOpen === 'Productos' && (
                            <ul className='submenu'>
                                <li><Link to='/catalogo' className='no-underline' onClick={closeMenu}>Catalogo</Link></li>
                                <li><Link to='/agregarProducto' className='no-underline' onClick={closeMenu}>Agregar nuevo</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className={`titulo ${submenuOpen === 'Informe' ? 'active' : ''}`} onClick={() => toggleSubmenu('Informe')}>
                        <FontAwesomeIcon icon={faFileAlt} /> Informes
                        {submenuOpen === 'Informe' && (
                            <ul className='submenu'>
                                <li><Link to='/informeReportes' className='no-underline' onClick={closeMenu}>Reportes</Link></li>
                                <li><Link to='/crearReporteSemanal' className='no-underline' onClick={closeMenu}>Reporte Semanal</Link></li>
                                <li><Link to='/crearReporteMensual' className='no-underline' onClick={closeMenu}>Reporte Mensual</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className={`titulo ${submenuOpen === 'Otros' ? 'active' : ''}`} onClick={() => toggleSubmenu('Otros')}>
                        <FontAwesomeIcon icon={faCog} /> Otros
                        {submenuOpen === 'Otros' && (
                            <ul className='submenu'>
                                <li><Link to='/marcas' className='no-underline' onClick={closeMenu}>Listado marcas</Link></li>
                                <li><Link to='/categoria' className='no-underline' onClick={closeMenu}>Categoria</Link></li>
                                <li><Link to='/unidadMedida' className='no-underline' onClick={closeMenu}>Unidad medida</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className='opc'><CerrarSesion /></li>
                </ul>


            </div>
        </div>
    );
};

export default MenuHamburguesa;