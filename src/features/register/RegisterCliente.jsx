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
            <Typography variant="h4" fontWeight="bold">
              Registro como Cliente
            </Typography>
          </Box>
          <Paper
            className="gradientBackground"
            variant="outlined"
            sx={{ padding: "2rem", margin: 0, width: "100%" }}
          >
            <form onSubmit={handleSubmit}>
              <Stack direction="column" spacing={3}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  size="medium"
                />
                <FormLabel htmlFor="password">Contraseña</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  required
                  size="medium"
                />
                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                <TextField
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  size="medium"
                />
                <FormLabel htmlFor="apellido">Apellido</FormLabel>
                <TextField
                  id="apellido"
                  name="apellido"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  size="medium"
                />
                <FormLabel htmlFor="telefono">Teléfono</FormLabel>
                <TextField
                  id="telefono"
                  name="telefono"
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  size="medium"
                />
                <FormLabel htmlFor="direccion">Dirección</FormLabel>
                <TextField
                  id="direccion"
                  name="direccion"
                  placeholder="Dirección"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  size="medium"
                />
                <Button
                  type="submit"
                  sx={{ marginTop: "1rem" }}
                  size="large"
                  variant="contained"
                  disabled={loading}
                >
                  Registrarme
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
                Registro exitoso. Ya puedes iniciar sesión.
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
