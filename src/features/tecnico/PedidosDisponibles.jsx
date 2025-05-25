import {
  Alert,
  Box,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PEDIDO_ESTADOS_TEXTO } from "../../../types/const";
import { PedidoEstadoEnum, PedidoSchema } from "../../../types/schemas";
import * as api from "../../api";
import { Layout } from "../../components/Layout";
import { PedidoCardCliente } from "../../components/PedidoCardCliente";
import { UserContext } from "../../contexts/UserContext";
import { PedidoDisponibleCard } from "../../components/PedidoDisponibleCard";

export function PedidosDisponibles() {
  const { token, user } = useContext(UserContext);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    setSuccess(false);
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    api
      .getPedidos(token, {})
      .then((data) => {
        setLoading(false);
        setSuccess(true);
        setPedidos(data);
      })
      .catch(() => {
        setPedidos([]);
        setError("Error al cargar los pedidos. Inténtalo más tarde.");
        setSuccess(false);
      });
  }, [token, user.tecnico.id]);

  // Filtrar pedidos según el estado seleccionado
  const pedidosFiltrados = pedidos.filter((p) => {
    return (
      p.estado === PedidoEstadoEnum.Enum.con_candidatos ||
      p.estado === PedidoEstadoEnum.Enum.sin_candidatos
    );
  });

  console.log("Pedidos:", pedidos);
  return (
    <Layout>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Box padding={4}>
          {loading && !error && <Typography>Cargando pedidos...</Typography>}
          {error && <Alert severity="error">{error}</Alert>}
          {success && pedidos.length === 0 && (
            <Alert severity="info">No tienes pedidos realizados.</Alert>
          )}
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Pedidos disponibles
        </Typography>
        <Divider></Divider>

        {pedidosFiltrados.length > 0 && (
          <Box paddingTop={4}>
            {pedidosFiltrados.map((pedido) => (
              <span key={pedido.id}>
                <PedidoDisponibleCard
                  pedido={pedido}
                  displayButtons={true}
                  setPedidos={setPedidos}
                />
              </span>
            ))}
          </Box>
        )}
      </Container>
    </Layout>
  );
}
