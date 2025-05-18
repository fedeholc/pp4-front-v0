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
} from "@mui/material";
import { PedidoEstadoEnum } from "../../../types/schemas";
export function ListadoPedidos() {
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

  console.log("Pedidos:", pedidos);
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ height: "100%" }}>
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
        {pedidos.length > 0 && (
          <Box>
            {pedidos.map((pedido) => (
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

  return (
    <Paper
      className="gradientBackground"
      variant="outlined"
      sx={{ padding: 2, marginBottom: 2 }}
    >
      <Typography>Pedido ID: {pedido.id}</Typography>
      <Typography>
        Fecha de solicitud:{" "}
        {new Date(pedido.fechaCreacion).toLocaleDateString()}
      </Typography>
      <Typography>Area: {pedido.area.nombre}</Typography>
      <Typography>Requerimiento: {pedido.requerimiento}</Typography>
      <Typography>Disponibilidad: </Typography>

      {pedido.disponibilidad?.length === 0 && (
        <Typography pl={2}>No hay disponibilidad registrada.</Typography>
      )}
      {pedido?.disponibilidad?.map((d, index) => (
        <Typography pl={2} key={index}>
          {d.dia} de {d.horaInicio} a {d.horaFin}
        </Typography>
      ))}
      <Typography>
        Estado: {pedido.estado.replace(/_/g, " ").toLowerCase()}
      </Typography>
      <Typography>
        Técnico:{" "}
        {pedido.tecnico
          ? `${pedido.tecnico.nombre} ${pedido.tecnico.apellido}`
          : "No asignado"}
      </Typography>
      <Typography>
        Calificación del técnico:{" "}
        {pedido.calificacion ? pedido.calificacion : "No calificado"}
      </Typography>
      <Typography>
        Comentario sobre el técnico:{" "}
        {pedido.comentario ? pedido.comentario : "No hay comentario"}
      </Typography>
      <Typography>
        Respuesta del técnico:{" "}
        {pedido.respuesta ? pedido.respuesta : "No hay respuesta"}
      </Typography>
      <Stack
        direction="row"
        justifyContent={"flex-end"}
        spacing={2}
        marginTop={2}
      >
        <Button
          className="button"
          disabled={calificarTecnicoDisabled}
          variant="contained"
        >
          Calificar Técnico
        </Button>
        <Button
          size="small"
          className="button"
          disabled={cancelDisabled}
          variant="contained"
        >
          Cancelar Pedido
        </Button>
      </Stack>
    </Paper>
  );
}
