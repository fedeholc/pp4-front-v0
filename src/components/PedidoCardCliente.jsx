import {
  AccessTime,
  Assignment,
  CalendarMonth,
  Cancel,
  CheckCircle,
  Comment,
  ExpandLess,
  ExpandMore,
  Group,
  Person,
  Star,
  Email, // Added
  Phone, // Added
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PEDIDO_ESTADOS_TEXTO } from "../../types/const";
import { PedidoEstadoEnum } from "../../types/schemas";
import { useNavigate } from "react-router";
import * as api from "../api";
import { UserContext } from "../contexts/UserContext";
/**
 * @param {Object} props
 * @param {import("../../types").PedidoCompleto} props.pedido
 * @param {boolean} props.displayButtons
 */
export function PedidoCardCliente({ pedido, displayButtons }) {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const [showDisponibilidad, setShowDisponibilidad] = useState(false);
  const [showCalificacion, setShowCalificacion] = useState(false);
  const [calificacionValue, setCalificacionValue] = useState(0);
  const [comentarioCalificacion, setComentarioCalificacion] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cancelDisabled, setCancelDisabled] = useState(true);
  const [candidatosDisabled, setCandidatosDisabled] = useState(true);
  const [isPedidoCancelled, setIsPedidoCancelled] = useState(false);
  const [isCalificando, setIsCalificando] = useState(false);
  const [showTecnicoDetails, setShowTecnicoDetails] = useState(false); // Added state

  useEffect(() => {
    if (!pedido) return null;

    if (
      pedido.estado === PedidoEstadoEnum.Enum.sin_candidatos ||
      pedido.estado === PedidoEstadoEnum.Enum.con_candidatos
    ) {
      if (isPedidoCancelled === false) {
        setCancelDisabled(false);
      } else {
        setCancelDisabled(true);
      }
    }

    if (
      pedido.estado === PedidoEstadoEnum.Enum.con_candidatos &&
      pedido.candidatos &&
      pedido.candidatos.length > 0 &&
      isPedidoCancelled === false
    ) {
      setCandidatosDisabled(false);
    } else {
      setCandidatosDisabled(true);
    }
  }, [pedido, cancelDisabled, isPedidoCancelled]);

  if (!pedido) return null;

  let calificarTecnicoDisabled = true;
  if (pedido.tecnicoId && !pedido.calificacion) {
    calificarTecnicoDisabled = false;
  }

  async function handleCancelPedido(id) {
    try {
      setCancelDisabled(true);
      setIsPedidoCancelled(true);
      let response = await api.updatePedido(
        id,
        { ...pedido, estado: PedidoEstadoEnum.enum.cancelado },
        token
      );
      if (response) {
        setSuccess("Pedido cancelado con éxito.");
        setError(null);
      }
    } catch (error) {
      console.log("Error al cancelar el pedido:", error);
      setCancelDisabled(false);
      setError("Error al cancelar el pedido. Inténtalo más tarde.");
    }
  }

  async function handleCalificarTecnico() {
    if (calificacionValue === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    try {
      setIsCalificando(true);
      setError("");

      const pedidoActualizado = {
        ...pedido,
        calificacion: calificacionValue,
        comentario: comentarioCalificacion.trim() || null,
        estado: PedidoEstadoEnum.enum.calificado,
      };

      const response = await api.updatePedido(
        pedido.id,
        pedidoActualizado,
        token
      );

      if (response) {
        setSuccess("Calificación guardada con éxito");
        setShowCalificacion(false);
        // Actualizar el pedido local para reflejar los cambios
        pedido.calificacion = calificacionValue;
        pedido.comentario = comentarioCalificacion.trim() || null;
        pedido.estado = PedidoEstadoEnum.enum.calificado;
      }
    } catch (error) {
      console.log("Error al calificar técnico:", error);
      setError("Error al guardar la calificación. Inténtalo más tarde.");
    } finally {
      setIsCalificando(false);
    }
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
              {pedido.tecnico ? (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowTecnicoDetails((prev) => !prev)}
                  sx={{
                    textTransform: "none",
                    p: 0,
                    minWidth: 0,
                    fontWeight: "inherit",
                    color: "inherit",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                  aria-expanded={showTecnicoDetails}
                  aria-controls="tecnico-details-collapse"
                >
                  {`${pedido.tecnico.nombre} ${pedido.tecnico.apellido}`}
                  {showTecnicoDetails ? (
                    <ExpandLess sx={{ ml: 0.5 }} />
                  ) : (
                    <ExpandMore sx={{ ml: 0.5 }} />
                  )}
                </Button>
              ) : (
                "No asignado"
              )}
            </Typography>
          </Stack>
          {pedido.tecnico && (
            <Collapse
              in={showTecnicoDetails}
              timeout="auto"
              unmountOnExit
              id="tecnico-details-collapse"
            >
              <Stack spacing={1} pl={4} mt={1} mb={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">
                    {pedido.tecnico.telefono || "No disponible"}
                  </Typography>
                </Stack>
              </Stack>
            </Collapse>
          )}
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
              disabled={candidatosDisabled}
              variant="outlined"
              size="medium"
              color="primary"
              startIcon={<Group />}
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() =>
                navigate(`/cliente/pedidos/${pedido.id}/candidatos`)
              }
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
              onClick={() => setShowCalificacion(!showCalificacion)}
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
              onClick={() => handleCancelPedido(pedido.id)}
            >
              Cancelar Pedido
            </Button>
          </Stack>

          {/* Sección de calificación */}
          <Collapse in={showCalificacion} timeout="auto" unmountOnExit>
            <Box
              mt={3}
              p={3}
              sx={{
                backgroundColor: "rgba(255, 193, 7, 0.05)",
                borderRadius: 2,
                border: "1px solid rgba(255, 193, 7, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Star color="warning" />
                Calificar a {pedido.tecnico?.nombre} {pedido.tecnico?.apellido}
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" gutterBottom fontWeight={600}>
                    Calificación *
                  </Typography>
                  <Rating
                    value={calificacionValue}
                    onChange={(event, newValue) => {
                      setCalificacionValue(newValue || 0);
                    }}
                    size="large"
                    precision={1}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom fontWeight={600}>
                    Comentario (opcional)
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Comparte tu experiencia con el técnico..."
                    value={comentarioCalificacion}
                    onChange={(e) => setComentarioCalificacion(e.target.value)}
                    variant="outlined"
                    sx={{ backgroundColor: "white" }}
                  />
                </Box>

                {/* Mostrar error solo dentro del formulario de calificación */}
                {error && (
                  <Alert severity="error" role="alert">
                    {error}
                  </Alert>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowCalificacion(false);
                      setCalificacionValue(0);
                      setComentarioCalificacion("");
                      setError("");
                    }}
                    disabled={isCalificando}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleCalificarTecnico}
                    disabled={isCalificando}
                    startIcon={<Star />}
                  >
                    {isCalificando ? "Guardando..." : "Guardar Calificación"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Collapse>

          {/* Mostrar error de cancelación fuera del formulario de calificación */}
          {error && !showCalificacion && (
            <Box mt={2}>
              <Alert severity="error" role="alert">
                {error}
              </Alert>
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
