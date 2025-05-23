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

function App() {
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
