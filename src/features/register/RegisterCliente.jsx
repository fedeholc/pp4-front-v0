import { useState } from "react";
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
import { Paper } from "@mui/material";
import { Person, Email, Lock, Phone, Home } from "@mui/icons-material";

export function RegisterCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const user = await api.register({
        email: form.email,
        password: form.password,
        rol: "cliente",
      });
      if (!user?.id) throw new Error("Error al registrar usuario");
      await api.createCliente(
        {
          usuarioId: user.id,
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          direccion: form.direccion,
          fechaRegistro: new Date(),
        },
        user.token
      );
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
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
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Registro como Cliente
            </Typography>
          </Box>
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
              width: "100%",
              maxWidth: 500,
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack direction="column" gap={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email color="primary" />
                  <FormLabel htmlFor="email">Email</FormLabel>
                </Stack>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  size="medium"
                  fullWidth
                />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Lock color="primary" />
                  <FormLabel htmlFor="password">Contraseña</FormLabel>
                </Stack>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  required
                  size="medium"
                  fullWidth
                />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Person color="primary" />
                  <FormLabel htmlFor="nombre">Nombre</FormLabel>
                </Stack>
                <TextField
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  size="medium"
                  fullWidth
                />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Person color="primary" />
                  <FormLabel htmlFor="apellido">Apellido</FormLabel>
                </Stack>
                <TextField
                  id="apellido"
                  name="apellido"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  size="medium"
                  fullWidth
                />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone color="primary" />
                  <FormLabel htmlFor="telefono">Teléfono</FormLabel>
                </Stack>
                <TextField
                  id="telefono"
                  name="telefono"
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  size="medium"
                  fullWidth
                />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Home color="primary" />
                  <FormLabel htmlFor="direccion">Dirección</FormLabel>
                </Stack>
                <TextField
                  id="direccion"
                  name="direccion"
                  placeholder="Dirección"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  size="medium"
                  fullWidth
                />
                <Button
                  type="submit"
                  sx={{ marginTop: "1rem", borderRadius: 2, fontWeight: 600 }}
                  size="large"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  startIcon={<Person />}
                >
                  Registrarme
                </Button>
              </Stack>
            </form>
          </Paper>
          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Stack
              direction="column"
              spacing={4}
              alignItems="center"
              sx={{ marginTop: "1rem", width: "100%" }}
            >
              <Alert severity="success" sx={{ width: "100%" }}>
                Registro exitoso. Ya puedes iniciar sesión.
              </Alert>
              <Button
                className="button"
                size="large"
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{ borderRadius: 2, fontWeight: 600, width: "100%" }}
                startIcon={<Lock />}
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
