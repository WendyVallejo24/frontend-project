import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './estilos/MenuHamburguesa.css';

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
                    <li className='titulo'>Productos</li>
                    <Link to='/catalogo' className='no-underline'><li className='opc'>Catalogo</li></Link>
                    <Link to='/agregarProducto' className='no-underline'><li className='opc'>Agregar</li></Link>
                    {/* <Link to='/modificarProducto' className='no-underline'><li className='opc'>Modificar</li></Link>  */}
                    <li className='titulo'>Otros</li>
                    <Link to='/marcas' className='no-underline'><li className='opc'>Listado marcas</li></Link>
                    <Link to='/categoria' className='no-underline'><li className='opc'>Categorias</li></Link>
                    <Link to='/unidadMedida' className='no-underline'><li className='opc'>Unidades medida</li></Link>
                    
                </ul>
            </div>
        </div>
    );
};

export default MenuHamburguesa;