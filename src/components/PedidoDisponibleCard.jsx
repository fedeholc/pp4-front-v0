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
import { useContext, useEffect, useState } from "react";
import { PEDIDO_ESTADOS_TEXTO } from "../../types/const";
import * as api from "../api";
import { UserContext } from "../contexts/UserContext";
import { PedidoEstadoEnum } from "../../types/schemas";
/**
 * @param {Object} props
 * @param {import("../../types").PedidoCompleto} props.pedido
 * @param {boolean} props.displayButtons
 * @param {function} props.setPedidos
 */
export function PedidoDisponibleCard({ pedido, displayButtons, setPedidos }) {
  const { token, user } = useContext(UserContext);

  const [showDisponibilidad, setShowDisponibilidad] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [postularDisabled, setPostularDisabled] = useState(false);

  useEffect(() => {
    if (!pedido) return null;

    if (pedido.candidatos.find((c) => c.tecnicoId === user.tecnico.id)) {
      setPostularDisabled(true);
    }
  }, [pedido, postularDisabled, user.tecnico.id]);

  if (!pedido) return null;

  async function handlePostularPedido(id) {
    try {
      setPostularDisabled(true);

      let response = await api.createPedidoCandidato(
        { tecnicoId: user.tecnico.id, pedidoId: id },
        token
      );
      setPedidos((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              candidatos: [...p.candidatos, { tecnicoId: user.tecnico.id }],
              estado: PedidoEstadoEnum.Enum.con_candidatos,
            };
          }
          return p;
        })
      );

      // Guardar también en la base de datos
      const updateResponse = await api.updatePedido(
        id,
        {
          ...pedido,
          estado: PedidoEstadoEnum.Enum.con_candidatos,
        },
        token
      );

      if (response && updateResponse) {
        setPostularDisabled(true);
        setSuccess(true);
        setError(null);
      }
    } catch (error) {
      console.log("Error al postuarlse al pedido:", error);
      setPostularDisabled(false);
      setError("Error al postularse al pedido. Inténtalo más tarde.");
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
              <b>Cliente solicitante:</b> {pedido.cliente.apellido},{" "}
              {pedido.cliente.nombre}
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
              size="medium"
              className="button"
              disabled={postularDisabled}
              variant="contained"
              color="secondary"
              startIcon={<Star />}
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => handlePostularPedido(pedido.id)}
            >
              {postularDisabled ? "Ya estás postulado" : "Postularme"}
            </Button>
          </Stack>
          {error && (
            <Box mt={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {success && (
            <Box mt={2}>
              <Alert severity="success">Postulación realizada con éxito.</Alert>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}
