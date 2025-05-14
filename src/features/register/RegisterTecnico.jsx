import { Label } from "@radix-ui/react-label";
import {
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useState, useEffect } from "react";
import * as api from "../../api";
import "@src/App.css";
import { Layout } from "../../components/Layout";
import { useNavigate } from "react-router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function RegisterTecnico() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    caracteristicas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  //TODO: no me convence el componente de selección multiple, ver si hay otro mejor o hacer uno propio
  
  useEffect(() => {
    // Obtener áreas al montar
    api
      .getAreas()
      .then(setAreas)
      .catch(() => setAreas([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAreasChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedAreas(options.map((opt) => Number(opt.value)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // 1. Registrar usuario (rol: tecnico)
      const user = await api.register({
        email: form.email,
        password: form.password,
        rol: "tecnico",
      });
      if (!user?.id) throw new Error("Error al registrar usuario");
      // 2. Crear técnico
      const tecnico = await api.createTecnico(
        {
          usuarioId: user.id,
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          direccion: form.direccion,
          caracteristicas: form.caracteristicas,
          fechaRegistro: new Date(),
        },
        user.token
      );
      // 3. Asignar áreas seleccionadas
      await Promise.all(
        selectedAreas.map((areaId) =>
          api.createTecnicoArea({ tecnicoId: tecnico.id, areaId }, user.token)
        )
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
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="3"
        style={{ padding: "1rem 0.5rem 2rem 0.5rem", height: "100%" }}
      >
        <Box p="1">
          <Text size="6" weight="bold">
            Registro como Técnico
          </Text>
        </Box>
        <Box
          className="card"
          style={{
            padding: "2rem",
            margin: "0",
          }}
        >
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
              />
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
              <Label htmlFor="caracteristicas">Características</Label>
              <TextField.Root
                size="3"
                id="caracteristicas"
                name="caracteristicas"
                placeholder="Características"
                value={form.caracteristicas}
                onChange={handleChange}
                required
              />
              <Label htmlFor="areas">Áreas de especialidad</Label>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="soft"
                    type="button"
                    style={{ textAlign: "left", minHeight: 40 }}
                  >
                    Seleccionar áreas
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  sideOffset={5}
                  align="start"
                  style={{
                    minWidth: 220,
                    maxHeight: 250,
                    overflowY: "auto",
                    overflowX: "hidden",
                    background: "white",
                    borderRadius: 8,
                    padding: "1rem",
                    border: "1px solid #ccc",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  }}
                >
                  {areas.map((area) => (
                    <DropdownMenu.Item
                      key={area.id}
                      asChild
                      onSelect={(e) => e.preventDefault()}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: 6,
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAreas.includes(area.id)}
                          onPointerDown={(e) => e.stopPropagation()}
                          onChange={() => {
                            setSelectedAreas((prev) =>
                              prev.includes(area.id)
                                ? prev.filter((id) => id !== area.id)
                                : [...prev, area.id]
                            );
                          }}
                        />
                        {area.nombre}
                      </label>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <Button
                style={{ marginTop: "1rem" }}
                type="submit"
                size="3"
                loading={loading}
                disabled={loading}
              >
                Registrarse
              </Button>
            </Flex>
          </form>
        </Box>
        {error && <Callout.Root color="red">{error}</Callout.Root>}
        {success && (
          <Flex
            direction={"column"}
            gap="4"
            align="center"
            style={{ marginTop: "1rem" }}
          >
            <Callout.Root color="green">
              Registro exitoso. Ya puedes iniciar sesión.
            </Callout.Root>
            <Button
              className="button"
              size="3"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </Button>
          </Flex>
        )}
      </Flex>
    </Layout>
  );
}
