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
  Collapse,
  IconButton,
  Rating,
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
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useParams } from "react-router";

export function PedidoCandidatos() {
  const { token, user } = useContext(UserContext);

  /**@type {[import("../../../types").PedidoCompleto | null, React.Dispatch<React.SetStateAction<import("../../../types").PedidoCompleto | null>>]} */
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const pedidoId = useParams().pedidoId;

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
      .getPedidos(token, { clienteId: user.cliente.id, id: pedidoId })
      .then((data) => {
        setLoading(false);
        setSuccess(true);
        setPedido(data[0]);
      })
      .catch(() => {
        setPedido(null);
        setError("Error al cargar los pedidos. Inténtalo más tarde.");
        setSuccess(false);
      });
  }, [token, user.cliente.id, pedidoId]);

  return (
    <Layout>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Box padding={4}>
          {loading && !error && <Typography>Cargando pedidos...</Typography>}
          {error && <Alert severity="error">{error}</Alert>}
          {success && !pedido && (
            <Alert severity="info">No hay datos del pedido.</Alert>
          )}
        </Box>
        {pedido && (
          <>
            <Box>
              <span key={pedido.id}>
                <PedidoCard pedido={pedido} />
              </span>
            </Box>
          </>
        )}
        {pedido?.candidatos && pedido.candidatos.length > 0 && (
          <Box mt={4}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Candidatos para el Pedido #{pedido.id}
            </Typography>
            <Stack spacing={2}>
              {pedido.candidatos.map((candidato) => (
                <CandidatoCard key={candidato.id} candidato={candidato} />
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Layout>
  );
}

/**
 * @param {Object} props
 * @param {import("../../../types").CandidatoVista} props.candidato
 */
function CandidatoCard({ candidato }) {
  let average =
    candidato.calificaciones.reduce(
      (acc, calificacion) => acc + calificacion,
      0
    ) /
    2 /
    candidato.calificaciones.length;
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
        boxShadow: 1,
        border: "1px solid #e0e0e0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" mb={1}>
        <Stack flexDirection={"row"} alignItems={"center"} gap="1rem">
          <Person color="primary" />
          <Typography variant="h6" fontWeight={700}>
            {candidato.nombre} {candidato.apellido}
          </Typography>
        </Stack>
        <Box flexGrow={1} />
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Calificación
          </Typography>

          <Rating
            name="half-rating-read"
            value={average}
            precision={0.5}
            readOnly
            size="small"
            sx={{ ml: 1 }}
          />
          <Typography
            sx={{ marginLeft: "0.2rem" }}
            color="text.secondary"
            variant="body2"
          >
            ({candidato.calificaciones.length})
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Stack spacing={2} flex={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonth fontSize="small" color="action" />
            <Typography variant="body2">
              <b>Fecha de registro:</b> {candidato.fechaRegistro.toString()}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Comment fontSize="small" color="action" />
            <Typography variant="body2">
              <b>Características del servicio:</b> {candidato.caracteristicas}
            </Typography>
          </Stack>
        </Stack>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Stack
          spacing={2}
          flex={1}
          justifyContent="center"
          direction={{ xs: "row", sm: "column" }}
          alignItems={"flex-end"}
        >
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            sx={{ borderRadius: 2, fontWeight: 600, minWidth: 140 }}
            startIcon={<Person />}
          >
            VER PERFIL
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ borderRadius: 2, fontWeight: 600, minWidth: 140 }}
            startIcon={<CheckCircle />}
          >
            SELECCIONAR
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

/**
 * @param {Object} props
 * @param {import("../../../types").PedidoCompleto} props.pedido
 */
function PedidoCard({ pedido }) {
  const [showDisponibilidad, setShowDisponibilidad] = useState(false);
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
        boxShadow: 1,
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
              pedido.estado === "finalizado" || pedido.estado === "calificado"
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
        <Stack spacing={2} flex={2}>
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
            <IconButton
              size="small"
              onClick={() => setShowDisponibilidad((v) => !v)}
              aria-label={
                showDisponibilidad
                  ? "Ocultar disponibilidad"
                  : "Ver disponibilidad"
              }
            >
              {showDisponibilidad ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
          <Collapse
            style={{ marginTop: "0rem" }}
            in={showDisponibilidad}
            timeout="auto"
            unmountOnExit
          >
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
          </Collapse>
        </Stack>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Stack spacing={2} flex={2}>
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
