import {
  Alert,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import * as api from "../../api";
import { CandidatoCard } from "../../components/CandidatoCard";
import { Layout } from "../../components/Layout";
import { PedidoCardCliente } from "../../components/PedidoCardCliente";
import { UserContext } from "../../contexts/UserContext";
import { Person, CheckCircle } from "@mui/icons-material";
import { PedidoEstadoEnum } from "../../../types/schemas";

export function PedidoCandidatos() {
  const { token, user } = useContext(UserContext);

  /**@type {[import("../../../types").PedidoCompleto | null, React.Dispatch<React.SetStateAction<import("../../../types").PedidoCompleto | null>>]} */
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const pedidoId = useParams().pedidoId;
  /**@type {[import("../../../types").CandidatoVista | null, React.Dispatch<React.SetStateAction<import("../../../types").CandidatoVista | null>>]} */
  const [selectedTecnico, setSelectedTecnico] = useState(null);

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

  async function handleSelectTecnico(id) {
    // Aquí puedes manejar la selección de un candidato
    console.log("Candidato seleccionado:", id);
    try {
      let response = await api.updatePedido(
        pedido.id,
        {
          ...pedido,
          estado: PedidoEstadoEnum.enum.tecnico_seleccionado,
          tecnicoId: id,
        },
        token
      );
      if (response) {
        setSuccess(true);
        setError(null);
        setSelectedTecnico(pedido.candidatos.find((c) => c.id === id) || null);
      }
    } catch (error) {
      console.log("Error al cancelar el pedido:", error);
      setError("Error al cancelar el pedido. Inténtalo más tarde.");
    }
  }
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
                <PedidoCardCliente pedido={pedido} displayButtons={false} />
              </span>
            </Box>
          </>
        )}
        {pedido?.candidatos &&
          pedido.candidatos.length > 0 &&
          !selectedTecnico && (
            <Box mt={4}>
              <Typography variant="h5" fontWeight={700} mb={2}>
                Candidatos para el Pedido #{pedido.id}
              </Typography>
              <Stack spacing={2}>
                {pedido.candidatos.map((candidato) => (
                  <CandidatoCard
                    key={candidato.id}
                    candidato={candidato}
                    onSelectTecnico={handleSelectTecnico}
                  />
                ))}
              </Stack>
            </Box>
          )}
        {selectedTecnico && (
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
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Person color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight={700}>
                Técnico seleccionado
              </Typography>
            </Stack>
            <Alert severity="success" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Box>
                  <Typography fontWeight={500}>
                    Has seleccionado al técnico:
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {selectedTecnico?.nombre} {selectedTecnico?.apellido}
                  </Typography>
                </Box>
              </Stack>
            </Alert>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Typography>
                Le avisaremos a <b>{selectedTecnico?.nombre}</b> para que se
                ponga en contacto contigo.
              </Typography>
              <Typography>
                Si lo prefieres puedes comunicarte directamente con él a su{" "}
                <b>teléfono:</b>{" "}
                <span style={{ fontWeight: 700 }}>
                  {selectedTecnico?.telefono}
                </span>
                .
              </Typography>
            </Stack>
          </Paper>
        )}
      </Container>
    </Layout>
  );
}
