import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { UserProvider } from "./contexts/UserProvider";
import { Home } from "./features/home/Home";
import { Login } from "./features/login/Login";
import { Menu } from "./features/Menu/Menu";
import { RegisterCliente } from "./features/register/RegisterCliente";
import { RegisterTecnico } from "./features/register/RegisterTecnico";
import { ProtectedRoute } from "./features/ProtectedRoute";
import { Navigate } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material";
import { PedidoNuevo } from "./features/cliente/PedidoNuevo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ListadoPedidos } from "./features/cliente/ListadoPedidos";
import { PedidoCandidatos } from "./features/cliente/PedidoCandidatos";
import { TecnicoPerfil } from "./features/tecnico/TecnicoPerfil";
import { PedidosDisponibles } from "./features/tecnico/PedidosDisponibles";
import { TecnicoMisPedidos } from "./features/tecnico/TecnicoMisPedidos";
import { TecnicoFacturas } from "./features/tecnico/TecnicoFacturas";
import { AdminUsuarios } from "./features/admin/AdminUsuarios";
import { AdminSuscripciones } from "./features/admin/AdminSuscripciones";
import { AdminPedidos } from "./features/admin/AdminPedidos";

function App(props) {
  const themeOptions = {
    cssVariables: true,
    palette: {
      mode: /** @type {'light'} */ ("light"),
      primary: {
        main: "#367100",
      },
      secondary: {
        main: "#3B0071",
      },
    },
  };
  const theme = createTheme(themeOptions);
  // Permitir pasar initialEntries solo en test (BrowserRouter real lo ignora)
  const browserRouterProps = props.initialEntries
    ? { initialEntries: props.initialEntries }
    : {};

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <BrowserRouter {...browserRouterProps}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route
              path="/admin/suscripciones"
              element={<AdminSuscripciones />}
            />
            <Route path="/admin/pedidos" element={<AdminPedidos />} />

            <Route path="/register/cliente" element={<RegisterCliente />} />
            <Route path="/register/tecnico" element={<RegisterTecnico />} />
            <Route path="/cliente/nuevo-pedido" element={<PedidoNuevo />} />
            <Route path="/cliente/pedidos" element={<ListadoPedidos />} />
            <Route
              path="/cliente/pedidos/:pedidoId/candidatos"
              element={<PedidoCandidatos />}
            />
            <Route path="/tecnico/:id/perfil" element={<TecnicoPerfil />} />
            <Route
              path="/tecnico/pedidos-disponibles"
              element={<PedidosDisponibles />}
            />
            <Route
              path="/tecnico/mis-pedidos"
              element={<TecnicoMisPedidos />}
            />
            <Route path="/tecnico/facturas" element={<TecnicoFacturas />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
