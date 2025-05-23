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
import { PedidoEstadoEnum } from "../../../types/schemas";
import * as api from "../../api";
import { Layout } from "../../components/Layout";
import { PedidoCardCliente } from "../../components/PedidoCardCliente";
import { UserContext } from "../../contexts/UserContext";
import { PedidoCardTecnico } from "../../components/PedidoCardTecnico";

export function TecnicoMisPedidos() {
  const { token, user } = useContext(UserContext);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [filter, setFilter] = useState("");

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
      .getPedidos(token, { tecnicoId: user.tecnico.id })
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
  const pedidosFiltrados = filter
    ? pedidos.filter((p) => p.estado === filter)
    : pedidos;

  console.log("Pedidos:", pedidos);
  return (
    <Layout>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Typography paddingTop={4} variant="h4" component="h1" gutterBottom>
          Mis Pedidos
        </Typography>
        <Divider></Divider>

        <Stack
          flexDirection={"row"}
          flexWrap={"wrap"}
          alignItems={"center"}
          justifyContent={"end"}
          mt={2}
          mb={2}
          gap={1}
        >
          <Typography>Filtrar por estado del pedido:</Typography>
          <FormControl size="small" sx={{ flexGrow: 0 }}>
            <InputLabel id="estado-filtro-label">Estado</InputLabel>
            <Select
              labelId="estado-filtro-label"
              id="estado-filtro"
              value={filter}
              sx={{ minWidth: "160px" }}
              label="Estado"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.values(PedidoEstadoEnum.Enum).map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {PEDIDO_ESTADOS_TEXTO[estado] || estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Box padding={4}>
          {loading && !error && <Typography>Cargando pedidos...</Typography>}
          {error && <Alert severity="error">{error}</Alert>}
          {success && pedidos.length === 0 && (
            <Alert severity="info">No tienes pedidos realizados.</Alert>
          )}
        </Box>
        {pedidosFiltrados.length > 0 && (
          <Box>
            {pedidosFiltrados.map((pedido) => (
              <span key={pedido.id}>
                <PedidoCardTecnico pedido={pedido} displayButtons={true} />
              </span>
            ))}
          </Box>
        )}
      </Container>
    </Layout>
  );
}
