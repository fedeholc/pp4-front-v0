import {
  AccessTime,
  Assignment,
  CalendarMonth,
  CheckCircle,
  Comment,
  ExpandLess,
  ExpandMore,
  Group,
  Person,
  Star,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { PEDIDO_ESTADOS_TEXTO } from "../../types/const";
import { UserContext } from "../contexts/UserContext";
/**
 * @param {Object} props
 * @param {import("../../types").PedidoCompleto} props.pedido
 * @param {boolean} props.displayButtons
 */
export function PedidoCardTecnico({ pedido, displayButtons }) {
  const { token } = useContext(UserContext);

  const [showDisponibilidad, setShowDisponibilidad] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!pedido) return null;

  let responderDisabled = true;
  if (pedido.calificacion && !pedido.respuesta) {
    responderDisabled = false;
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
            <Person fontSize="small" color="primary" />
            <Typography variant="body2">
              <b>Cliente solicitante:</b> {pedido.cliente.apellido},{" "}
              {pedido.cliente.nombre}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Star fontSize="small" color="warning" />
            <Typography variant="body2">
              <b>Tu calificación:</b>{" "}
              {pedido.calificacion ? pedido.calificacion : "No calificado"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Comment fontSize="small" color="secondary" />
            <Typography variant="body2">
              <b>Comentario del cliente:</b>{" "}
              {pedido.comentario ? pedido.comentario : "No hay comentario"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Comment fontSize="small" color="success" />
            <Typography variant="body2">
              <b>Tu respuesta:</b>{" "}
              {pedido.respuesta ? pedido.respuesta : "No hay respuesta"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {displayButtons && (
        <>
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
              disabled={responderDisabled}
              variant="contained"
              size="medium"
              color="warning"
              startIcon={<Star />}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Responder calficación
            </Button>
          </Stack>

          {error && (
            <Box mt={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {success && (
            <Box mt={2}>
              <Alert severity="success">{success}</Alert>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}
