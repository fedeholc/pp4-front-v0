import { useContext, useEffect, useState } from "react";
import * as api from "../../api";
import { UserContext } from "../../contexts/UserContext";
import { Layout } from "../../components/Layout";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { PedidoEstadoEnum } from "../../../types/schemas";
import { PEDIDO_ESTADOS_TEXTO } from "../../../types/const";
import {
  CheckCircle,
  Cancel,
  Star,
  Person,
  Comment,
  Assignment,
  Group,
  CalendarMonth,
  AccessTime,
} from "@mui/icons-material";

export function ListadoPedidos() {
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
      .getPedidos(token, { clienteId: user.cliente.id })
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
  }, [token, user.cliente.id]);

  // Filtrar pedidos según el estado seleccionado
  const pedidosFiltrados = filter
    ? pedidos.filter((p) => p.estado === filter)
    : pedidos;

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
          Mis Pedidos
        </Typography>
        <Divider></Divider>
        <Stack
          flexDirection={"row"}
          flexWrap={"wrap"}
          alignItems={"center"}
          mt={2}
          mb={2}
          gap={1}
        >
          <Typography>Filtrar por estado del pedido:</Typography>
          <FormControl size="small" sx={{ flexGrow: 1 }}>
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
        {pedidosFiltrados.length > 0 && (
          <Box>
            {pedidosFiltrados.map((pedido) => (
              <span key={pedido.id}>
                <PedidoCard pedido={pedido} />
              </span>
            ))}
          </Box>
        )}
      </Container>
    </Layout>
  );
}

/**
 * @param {Object} props
 * @param {import("../../../types").PedidoCompleto} props.pedido
 */
function PedidoCard({ pedido }) {
  if (!pedido) return null;

  let cancelDisabled = true;
  if (
    pedido.estado === PedidoEstadoEnum.Enum.sin_candidatos ||
    pedido.estado === PedidoEstadoEnum.Enum.con_candidatos
  ) {
    cancelDisabled = false;
  }

  let calificarTecnicoDisabled = true;
  if (pedido.tecnicoId && !pedido.calificacion) {
    calificarTecnicoDisabled = false;
  }

  let candidatosDisabled = true;
  if (
    pedido.estado === "con_candidatos" &&
    pedido.candidatos &&
    pedido.candidatos.length > 0
  ) {
    candidatosDisabled = false;
  }

  return (
    <Paper
      className="gradientBackground"
      elevation={4}
      variant="outlined"
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        background: "linear-gradient(345deg, #eaff0005, #eaff0010)",
        boxShadow: 3,
        border: "1px solid #e0e0e0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Assignment color="primary" />
        <Typography variant="h6" fontWeight={700}>
          Pedido #{pedido.id}
        </Typography>
        <Box flexGrow={1} />
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircle
            color={
              pedido.estado === PedidoEstadoEnum.Enum.finalizado ||
              pedido.estado === PedidoEstadoEnum.Enum.calificado
                ? "success"
                : "disabled"
            }
          />
          <Typography variant="body2" color="text.secondary">
            {PEDIDO_ESTADOS_TEXTO[pedido.estado]}
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Stack spacing={1} flex={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonth fontSize="small" color="action" />
            <Typography variant="body2">
              <b>Fecha:</b>{" "}
              {new Date(pedido.fechaCreacion).toLocaleDateString()}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Group fontSize="small" color="action" />
            <Typography variant="body2">
              <b>Área:</b> {pedido.area.nombre}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Comment fontSize="small" color="action" />
            <Typography variant="body2">
              <b>Requerimiento:</b> {pedido.requerimiento}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2">
              <b>Disponibilidad:</b>
            </Typography>
          </Stack>
          {pedido.disponibilidad?.length === 0 && (
            <Typography pl={4} color="text.secondary">
              No hay disponibilidad registrada.
            </Typography>
          )}
          {pedido?.disponibilidad?.map((d, index) => (
            <Typography pl={4} key={index} color="text.secondary">
              {d.dia} de {d.horaInicio} a {d.horaFin}
            </Typography>
          ))}
        </Stack>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Stack spacing={1} flex={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Group fontSize="small" color="primary" />
            <Typography variant="body2">
              <b>Candidatos:</b> {pedido.candidatos.length}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Person fontSize="small" color="primary" />
            <Typography variant="body2">
              <b>Técnico:</b>{" "}
              {pedido.tecnico
                ? `${pedido.tecnico.nombre} ${pedido.tecnico.apellido}`
                : "No asignado"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Star fontSize="small" color="warning" />
            <Typography variant="body2">
              <b>Calificación:</b>{" "}
              {pedido.calificacion ? pedido.calificacion : "No calificado"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Comment fontSize="small" color="secondary" />
            <Typography variant="body2">
              <b>Comentario:</b>{" "}
              {pedido.comentario ? pedido.comentario : "No hay comentario"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Comment fontSize="small" color="success" />
            <Typography variant="body2">
              <b>Respuesta técnico:</b>{" "}
              {pedido.respuesta ? pedido.respuesta : "No hay respuesta"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack
        direction="row"
        justifyContent={{ xs: "center", sm: "flex-end" }}
        flexWrap="wrap"
        gap={2}
        mt={2}
      >
        <Button
          className="button"
          disabled={candidatosDisabled}
          variant="outlined"
          size="medium"
          color="primary"
          startIcon={<Group />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Ver Candidatos
        </Button>
        <Button
          className="button"
          disabled={calificarTecnicoDisabled}
          variant="contained"
          size="medium"
          color="warning"
          startIcon={<Star />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Calificar Técnico
        </Button>
        <Button
          size="medium"
          className="button"
          disabled={cancelDisabled}
          variant="contained"
          color="secondary"
          startIcon={<Cancel />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Cancelar Pedido
        </Button>
      </Stack>
    </Paper>
  );
}
