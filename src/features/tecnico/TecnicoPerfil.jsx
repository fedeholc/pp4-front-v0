import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { PEDIDO_ESTADOS_TEXTO } from "../../../types/const";
import * as api from "../../api";
import { Layout } from "../../components/Layout";
import { UserContext } from "../../contexts/UserContext";

export function TecnicoPerfil() {
  const params = useParams();
  const { token } = useContext(UserContext);
  const [tecnico, setTecnico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    if (!token || !params.id) {
      setError("No se pudo cargar el perfil del técnico.");
      setLoading(false);
      return;
    }

    api
      .getTecnico(parseInt(params.id), token)
      .then((data) => {
        setTecnico(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar el perfil del técnico. Inténtalo más tarde.");
        setLoading(false);
      });
  }, [token, params.id]);

  // Calcular estadísticas de calificaciones
  const calcularEstadisticas = () => {
    if (!tecnico?.pedidos) return { promedio: 0, total: 0, calificaciones: [] };

    const pedidosCalificados = tecnico.pedidos.filter(
      (p) => p.calificacion !== null
    );
    const calificaciones = pedidosCalificados.map((p) => p.calificacion);
    const total = calificaciones.length;
    const promedio =
      total > 0 ? calificaciones.reduce((sum, cal) => sum + cal, 0) / total : 0;

    return { promedio, total, calificaciones };
  };

  const { promedio, total } = calcularEstadisticas();

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ height: "100%" }}>
          <Typography paddingTop={4}>Cargando perfil del técnico...</Typography>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ height: "100%" }}>
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Typography paddingTop={4} variant="h4" component="h1" gutterBottom>
          Perfil del Técnico
        </Typography>
        <Divider />

        {tecnico && (
          <Box sx={{ mt: 3 }}>
            {/* Información del técnico */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar
                    sx={{ width: 80, height: 80, bgcolor: "primary.main" }}
                  >
                    {tecnico.nombre?.charAt(0)}
                    {tecnico.apellido?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {tecnico.nombre} {tecnico.apellido}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      {tecnico.caracteristicas || "Sin descripción"}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Teléfono:</strong>{" "}
                        {tecnico.telefono || "No disponible"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Dirección:</strong>{" "}
                        {tecnico.direccion || "No disponible"}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Fecha de registro:</strong>{" "}
                      {tecnico.fechaRegistro
                        ? new Date(tecnico.fechaRegistro).toLocaleDateString()
                        : "No disponible"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Áreas de especialización */}
            {tecnico.areas && tecnico.areas.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Áreas de especialización
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    {tecnico.areas.map((area) => (
                      <Chip
                        key={area.areaId}
                        label={area.nombre}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Calificaciones y estadísticas */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Calificaciones y reseñas
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h4" color="primary">
                    {promedio.toFixed(1)}
                  </Typography>
                  <Box>
                    <Rating
                      value={promedio}
                      readOnly
                      precision={0.1}
                      size="large"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Basado en {total} calificaciones
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Historial de trabajos */}
            {tecnico.pedidos && tecnico.pedidos.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Historial de trabajos
                  </Typography>
                  <Stack spacing={2}>
                    {tecnico.pedidos.map((pedido) => (
                      <Card key={pedido.id} variant="outlined">
                        <CardContent>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                {pedido.requerimiento}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Cliente: {pedido.clienteNombre}{" "}
                                {pedido.clienteApellido}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Área: {pedido.areaNombre}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Fecha:{" "}
                                {new Date(
                                  pedido.fechaCreacion
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Stack
                              spacing={1}
                              alignItems={{ xs: "flex-start", sm: "flex-end" }}
                            >
                              <Chip
                                label={
                                  PEDIDO_ESTADOS_TEXTO[pedido.estado] ||
                                  pedido.estado
                                }
                                color={
                                  pedido.estado === "finalizado" ||
                                  pedido.estado === "calificado"
                                    ? "success"
                                    : "default"
                                }
                                size="small"
                              />
                              {pedido.calificacion && (
                                <Box>
                                  <Rating
                                    value={pedido.calificacion}
                                    readOnly
                                    size="small"
                                  />
                                  <Typography variant="caption" display="block">
                                    {pedido.calificacion}/5
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Stack>
                          {pedido.comentario && (
                            <Typography
                              variant="body2"
                              sx={{ fontStyle: "italic", mt: 2 }}
                            >
                              "{pedido.comentario}"
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {(!tecnico.pedidos || tecnico.pedidos.length === 0) && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Este técnico aún no tiene trabajos realizados.
              </Alert>
            )}
          </Box>
        )}
      </Container>
    </Layout>
  );
}
