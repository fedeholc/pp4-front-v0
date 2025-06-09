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
  TextField, // Added TextField
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
// import { useNavigate } from "react-router"; // Removed unused import
import { PEDIDO_ESTADOS_TEXTO } from "../../types/const";
import { UserContext } from "../contexts/UserContext";
import * as api from "../api"; // Added api import
import { PedidoEstadoEnum } from "../../types/schemas"; // Added PedidoEstadoEnum import
import { ClienteInfoModal } from "./ClienteInfoModal";
/**
 * @param {Object} props
 * @param {import("../../types").PedidoCompleto} props.pedido
 * @param {boolean} props.displayButtons
 */
export function PedidoCardTecnico({ pedido, displayButtons }) {
  const { token } = useContext(UserContext);

  const [showDisponibilidad, setShowDisponibilidad] = useState(false);
  const [showResponderForm, setShowResponderForm] = useState(false); // New state
  const [respuestaTecnico, setRespuestaTecnico] = useState(""); // New state
  const [isRespondiendo, setIsRespondiendo] = useState(false); // New state

  // Estados para el modal del cliente
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [clienteCompleto, setClienteCompleto] = useState(null);
  const [clienteEmail, setClienteEmail] = useState("");
  const [loadingCliente, setLoadingCliente] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!pedido) return null;

  const responderDisabled = !(pedido.calificacion && !pedido.respuesta);

  async function handleGuardarRespuesta() {
    if (!respuestaTecnico.trim()) {
      setError("Por favor ingresa una respuesta.");
      return;
    }
    try {
      setIsRespondiendo(true);
      setError("");
      setSuccess("");

      const pedidoActualizado = {
        ...pedido,
        respuesta: respuestaTecnico.trim(),
        // Consider if PedidoEstadoEnum.Enum.finalizado or another state is more appropriate
        // estado: PedidoEstadoEnum.Enum.calificado, // Or a new state like 'respondido'
      };

      const response = await api.updatePedido(
        pedido.id,
        pedidoActualizado,
        token
      );

      if (response) {
        setSuccess("Respuesta guardada con éxito.");
        setShowResponderForm(false);
        // Update local pedido state to reflect the change
        // This will also re-evaluate `responderDisabled` correctly
        pedido.respuesta = respuestaTecnico.trim();
      }
    } catch (err) {
      console.error("Error al guardar la respuesta:", err);
      setError("Error al guardar la respuesta. Inténtalo más tarde.");
    } finally {
      setIsRespondiendo(false);
    }
  }

  // Función para obtener los datos completos del cliente
  async function handleVerCliente() {
    if (!pedido.cliente?.usuarioId) {
      setError("No se puede obtener la información del cliente.");
      return;
    }

    try {
      setLoadingCliente(true);
      setError("");

      // Obtener el usuario del cliente para conseguir el email
      const usuario = await api.getUsuario(pedido.cliente.usuarioId, token);

      setClienteCompleto(pedido.cliente);
      setClienteEmail(usuario.email || "");
      setShowClienteModal(true);
    } catch (err) {
      console.error("Error al obtener datos del cliente:", err);
      setError("Error al cargar la información del cliente.");
    } finally {
      setLoadingCliente(false);
    }
  }

  return (
    <>
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
                <b>Cliente solicitante:</b>{" "}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  }}
                  onClick={handleVerCliente}
                >
                  {pedido.cliente.apellido}, {pedido.cliente.nombre}
                </Typography>
                {loadingCliente && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {" (cargando...)"}
                  </Typography>
                )}
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
                onClick={() => setShowResponderForm(!showResponderForm)}
              >
                {showResponderForm ? "Cancelar" : "Responder Calificación"}
              </Button>
            </Stack>

            {/* Sección de Respuesta del Técnico */}
            <Collapse in={showResponderForm} timeout="auto" unmountOnExit>
              <Box
                mt={3}
                p={3}
                sx={{
                  backgroundColor: "rgba(0, 123, 255, 0.05)",
                  borderRadius: 2,
                  border: "1px solid rgba(0, 123, 255, 0.2)",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Comment color="primary" />
                  Responder al Comentario del Cliente
                </Typography>

                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" gutterBottom fontWeight={600}>
                      Tu Respuesta *
                    </Typography>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Escribe tu respuesta al cliente..."
                      value={respuestaTecnico}
                      onChange={(e) => setRespuestaTecnico(e.target.value)}
                      variant="outlined"
                      sx={{ backgroundColor: "white" }}
                      disabled={isRespondiendo}
                    />
                  </Box>
                  {error && (
                    <Box mt={2}>
                      <Alert severity="error" role="alert">
                        {error}
                      </Alert>
                    </Box>
                  )}
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowResponderForm(false);
                        setRespuestaTecnico("");
                        setError("");
                      }}
                      disabled={isRespondiendo}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleGuardarRespuesta}
                      disabled={
                        isRespondiendo ||
                        !respuestaTecnico.trim() ||
                        !!pedido.respuesta
                      }
                      startIcon={<CheckCircle />}
                    >
                      {isRespondiendo ? "Guardando..." : "Guardar Respuesta"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Collapse>

            {success && (
              <Box mt={2}>
                <Alert severity="success">{success}</Alert>
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Modal de información del cliente */}
      <ClienteInfoModal
        open={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        cliente={clienteCompleto}
        clienteEmail={clienteEmail}
      />
    </>
  );
}
