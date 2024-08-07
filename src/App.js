import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './componentes/login';
import RegistroEmp from './componentes/pantallasGerente/registroEmp';
import AgregarEmpleado from './componentes/pantallasGerente/AgregarEmpleado';
import EliminarEmpleado from './componentes/pantallasGerente/EliminarEmpleado';
import Catalogo from './componentes/pantallasGerente/productos/catalogo';
import CreateProduct from './componentes/pantallasGerente/productos/agregar';
import UpdateProduct from './componentes/pantallasGerente/productos/modificar';
import MarcaList from './componentes/pantallasGerente/productos/marcas-all';
import CategoriaList from './componentes/pantallasGerente/productos/categoria-all';
import UnidadMedidaList from './componentes/pantallasGerente/productos/unidadMedida';
import Pedidos from './componentes/Pedidos';
import PedidoEnProcesoComponent from './componentes/pedidos/pedidoProceso';
import PedidoCancelado from './componentes/pedidos/pedidoCancelado';
import PedidoEntregado from './componentes/pedidos/pedidoEntregado';
import InformeReportes from './componentes/pantallasGerente/informeReportes';
import DetalleReporte from './componentes/pantallasGerente/detalleReporte';
import CrearReporteSemanal from './componentes/pantallasGerente/crearReporteSemanal';
import CrearReporteMensual from './componentes/pantallasGerente/crearReporteMensual';
import CerrarSesion from './componentes/pantallasGerente/cerrarSesion';
import PrivateRoute from './componentes/PrivateRoute';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route  path="/registroEmpleado" element={<PrivateRoute element={RegistroEmp} />} />
        <Route  path="/agregarEmpleado" element={<PrivateRoute element={AgregarEmpleado} />} />
        <Route  path="/eliminarEmpleado" element={<PrivateRoute element={EliminarEmpleado} />} />
        <Route  path="/catalogo" element={<PrivateRoute element={Catalogo} />} />
        <Route  path="/agregarProducto" element={<PrivateRoute element={CreateProduct} />} />
        <Route  path="/modificarProducto" element={<PrivateRoute element={UpdateProduct} />} />
        <Route  path="/marcas" element={<PrivateRoute element={MarcaList} />} />
        <Route  path="/categoria" element={<PrivateRoute element={CategoriaList} />} />
        <Route  path="/unidadMedida" element={<PrivateRoute element={UnidadMedidaList} />} />
        <Route  path="/pedidos" element={<PrivateRoute element={Pedidos} />} />
        <Route  path="/pedidoProceso" element={<PrivateRoute element={PedidoEnProcesoComponent} />} />
        <Route  path="/pedidoCancelado" element={<PrivateRoute element={PedidoCancelado} />} />
        <Route  path="/pedidoEntregado" element={<PrivateRoute element={PedidoEntregado} />} />
        <Route  path="/informeReportes" element={<PrivateRoute element={InformeReportes} />} />
        <Route  path="/detalleReporte/:id" element={<PrivateRoute element={DetalleReporte} />} />
        <Route  path="/crearReporteSemanal" element={<PrivateRoute element={CrearReporteSemanal} />} />
        <Route  path="/crearReporteMensual" element={<PrivateRoute element={CrearReporteMensual} />} />
        <Route  path="/cerrarSesion" element={<PrivateRoute element={CerrarSesion} />} />
      </Routes>
    </Router>
  );
}

export default App;