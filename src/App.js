import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './componentes/login';
import RegistroEmp from './componentes/pantallasGerente/registroEmp';
import AgregarEmpleado from './componentes/pantallasGerente/AgregarEmpleado';
import EliminarEmpleado from './componentes/pantallasGerente/EliminarEmpleado';
import Ventas from './componentes/Ventas'
import Catalogo from './componentes/pantallasGerente/productos/catalogo';
import CreateProduct from './componentes/pantallasGerente/productos/agregar';
import UpdateProduct from './componentes/pantallasGerente/productos/modificar';
import MarcaList from './componentes/pantallasGerente/productos/marcas-all';
import CategoriaList from './componentes/pantallasGerente/productos/categoria-all';
import UnidadMedidaList from './componentes/pantallasGerente/productos/unidadMedida';
import NotasPagadas from './componentes/notas/notasPagadas';
import NotasCanceladas from './componentes/notas/notasCanceladas';
import NotasPendientes from './componentes/notas/notasPendientes';
import Pedidos from './componentes/Pedidos';
import PedidoEnProcesoComponent from './componentes/pedidos/pedidoProceso';
import PedidoCancelado from './componentes/pedidos/pedidoCancelado';
import PedidoEntregado from './componentes/pedidos/pedidoEntregado';
import InformeReportes from './componentes/pantallasGerente/informeReportes';
import DetalleReporte from './componentes/pantallasGerente/detalleReporte';
import CrearReporteSemanal from './componentes/pantallasGerente/crearReporteSemanal';
import CrearReporteMensual from './componentes/pantallasGerente/crearReporteMensual';
import CerrarSesion from './componentes/pantallasGerente/cerrarSesion';

function App() {
  return (
    <div>
    <Router>
      
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/registroEmpleado" element={<RegistroEmp />} />
        <Route path="/agregarEmpleado" element={<AgregarEmpleado />} />
        <Route path="/eliminarEmpleado" element={<EliminarEmpleado />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/agregarProducto" element={<CreateProduct />} />
        <Route path="/modificarProducto" element={<UpdateProduct />} />
        <Route path="/marcas" element={<MarcaList />} />
        <Route path="/categoria" element={<CategoriaList />} />
        <Route path="/unidadMedida" element={<UnidadMedidaList />} />
        <Route path="/notasPagadas" element={<NotasPagadas />} />
        <Route path="/notasCanceladas" element={<NotasCanceladas />} />
        <Route path="/notasPendientes" element={<NotasPendientes />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pedidoProceso" element={<PedidoEnProcesoComponent />} />
        <Route path="/pedidoCancelado" element={<PedidoCancelado />} />
        <Route path="/pedidoEntregado" element={<PedidoEntregado />} />
        <Route path="/informeReportes" element={<InformeReportes />} />
        <Route path="/detalleReporte/:id" element={<DetalleReporte />} ></Route>
        <Route path="/crearReporteSemanal" element={<CrearReporteSemanal />} />
        <Route path="/crearReporteMensual" element={<CrearReporteMensual />} />
        <Route path="/cerrarSesion" element={<CerrarSesion />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;