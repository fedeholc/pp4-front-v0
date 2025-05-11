import { Label } from "@radix-ui/react-label";
import { Box, Button, Callout, Flex, Text, TextField } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useState } from "react";
import * as api from "./api";
import "./App.css";

export function RegisterCliente() {
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
      // 1. Registrar usuario (rol: cliente)
      const user = await api.register({
        email: form.email,
        password: form.password,
        rol: "cliente",
      });
      if (!user?.id) throw new Error("Error al registrar usuario");
      // 2. Crear cliente
      await api.createCliente(
        {
          usuarioId: user.id,
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          direccion: form.direccion,
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
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "60vh" }}
    >
      <Box width="350px">
        <Text size="6" weight="bold" mb="4">
          Registro como Cliente
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Label htmlFor="email">Email</Label>
            <TextField.Root
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              size="3"
            />

            <Label htmlFor="password">Contraseña</Label>
            <TextField.Root
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              size="3"
            />

            <Label htmlFor="nombre">Nombre</Label>
            <TextField.Root
              id="nombre"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              size="3"
            />

            <Label htmlFor="apellido">Apellido</Label>

            <TextField.Root
              id="apellido"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              size="3"
            ></TextField.Root>

            <Label htmlFor="telefono">Teléfono</Label>
            <TextField.Root
              size="3"
              id="telefono"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />

            <Label htmlFor="direccion">Dirección</Label>
            <TextField.Root
              size="3"
              id="direccion"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
            />

            <Button type="submit" size="3" loading={loading} disabled={loading}>
              Registrarse
            </Button>
            {error && <Callout.Root color="red">{error}</Callout.Root>}
            {success && (
              <Callout.Root color="green">
                Registro exitoso. Ya puedes iniciar sesión.
              </Callout.Root>
            )}
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
