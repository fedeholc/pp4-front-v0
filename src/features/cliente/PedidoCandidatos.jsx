import {
  CalendarMonth,
  CheckCircle,
  Comment,
  Person,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import * as api from "../../api";
import { Layout } from "../../components/Layout";
import { UserContext } from "../../contexts/UserContext";
import { PedidoCard } from "../../components/PedidoCard";
import { CandidatoCard } from "../../components/CandidatoCard";

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
                <PedidoCard pedido={pedido} displayButtons={false} />
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
