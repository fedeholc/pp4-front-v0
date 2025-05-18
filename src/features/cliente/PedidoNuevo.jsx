import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate } from "react-router";
import * as api from "../../api";
import "@src/App.css";
import { Layout } from "../../components/Layout";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { format, parse } from "date-fns";
import { UserContext } from "../../contexts/UserContext";

export function PedidoNuevo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    requerimiento: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { token, user } = useContext(UserContext);
  const [areas, setAreas] = useState([]);

  /**@type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    api
      .getAreas()
      .then(setAreas)
      .catch(() => setAreas([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    let pedidoId = null;
    try {
      const pedido = await api.createPedido(
        {
          clienteId: 1, // Cambiar por el ID del cliente actual
          areaId: parseInt(selectedArea),
          requerimiento: form.requerimiento,
          estado: "sin_candidatos",
          tecnicoId: null,
          fechaCreacion: new Date(),
          fechaCancelado: null,
          fechaCierre: null,
          calificacion: null,
          comentario: null,
          respuesta: null,
        },
        token
      );
      if (!pedido?.id) throw new Error("Error al crear el pedido");
      pedidoId = pedido.id;
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error al crear el pedido");
    } finally {
      setLoading(false);
    }

    //pedido disponibilidad
    //TODO: esto se puede mejorar, no tiene sentido hacer una request por cada día, habría que hacer una sola con todos los datos
    try {
      await Promise.all(
        disponibilidad.map((d) =>
          api.createPedidoDisponibilidad(
            {
              pedidoId: pedidoId, // Cambiar por el ID del pedido actual
              dia: d.dia,
              horaInicio: d.horaInicio,
              horaFin: d.horaFin,
              clienteId: user.cliente.id, // Cambiar por el ID del cliente actual
            },
            token
          )
        )
      );
    } catch (err) {
      setError(err.message || "Error al crear la disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  /**@type {import("../../../types").PedidoDisponibilidadDia[]} */
  const diasSemana = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  /**@typedef { {dia: import("../../../types").PedidoDisponibilidadDia, horaInicio: string, horaFin: string} } Disponibilidad */

  /**@type {[Disponibilidad[], React.Dispatch<React.SetStateAction<Disponibilidad[]>>]} */
  const [disponibilidad, setDisponibilidad] = useState(
    diasSemana.map((dia) => ({
      dia,
      horaInicio: "",
      horaFin: "",
    }))
  );
  const handleDisponibilidadChange = (dia, campo, valor) => {
    setDisponibilidad((prev) =>
      prev.map((d) => (d.dia === dia ? { ...d, [campo]: valor } : d))
    );
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ height: "100%" }}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={3}
          sx={{ padding: "1rem 2rem 2rem 2rem", height: "100%" }}
        >
          <Box p={1}>
            <Typography variant="h4" fontWeight="bold">
              Solicitud de servicio técnico
            </Typography>
          </Box>
          <Paper
            className="gradientBackground"
            variant="outlined"
            sx={{ padding: "2rem", margin: 0, width: "100%" }}
          >
            <form onSubmit={handleSubmit}>
              <Stack direction="column" spacing={3}>
                <TextField
                  label="Describe tu requerimiento"
                  name="requerimiento"
                  value={form.requerimiento}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
                <FormControl fullWidth>
                  <InputLabel id="select-label">Área de servicio</InputLabel>
                  <Select
                    labelId="select-label"
                    label="Área de servicio"
                    id="areas"
                    name="areas"
                    value={selectedArea}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedArea(value);
                    }}
                    renderValue={(selected) =>
                      areas.find((area) => area.id === selected)?.nombre || ""
                    }
                  >
                    {areas.map((area) => (
                      <MenuItem key={area.id} value={area.id}>
                        {area.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Disponibilidad horaria
                  </Typography>
                  <Stack spacing={3}>
                    {disponibilidad.map((d) => (
                      <Stack
                        key={d.dia}
                        spacing={2}
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "start", sm: "center" }}
                      >
                        <Typography sx={{ minWidth: 90 }}>
                          {d.dia.charAt(0).toUpperCase() + d.dia.slice(1)}
                        </Typography>
                        <TimePicker
                          label="Inicio"
                          ampm={false}
                          value={
                            d.horaInicio
                              ? parse(d.horaInicio, "HH:mm", new Date())
                              : null
                          }
                          sx={{ flexGrow: 1, width: "100%" }}
                          onChange={(value) =>
                            handleDisponibilidadChange(
                              d.dia,
                              "horaInicio",
                              value ? format(value, "HH:mm") : ""
                            )
                          }
                          slotProps={{ textField: { size: "small" } }}
                        />
                        <TimePicker
                          label="Fin"
                          ampm={false}
                          sx={{ flexGrow: 1, width: "100%" }}
                          value={
                            d.horaFin
                              ? parse(d.horaFin, "HH:mm", new Date())
                              : null
                          }
                          onChange={(value) =>
                            handleDisponibilidadChange(
                              d.dia,
                              "horaFin",
                              value ? format(value, "HH:mm") : ""
                            )
                          }
                          slotProps={{ textField: { size: "small" } }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>
                <Button
                  type="submit"
                  sx={{ marginTop: "1rem" }}
                  size="large"
                  variant="contained"
                  disabled={loading}
                >
                  Enviar solicitud
                </Button>
              </Stack>
            </form>
          </Paper>
          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Stack
              direction="column"
              spacing={4}
              alignItems="center"
              sx={{ marginTop: "1rem" }}
            >
              <Alert severity="success">
                Tu solicitud ha sido enviada exitosamente. Te avisaremos cuando
                haya candidatos para atender tu pedido.
              </Alert>
              <Button
                className="button"
                size="large"
                variant="outlined"
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>
    </Layout>
  );
}
