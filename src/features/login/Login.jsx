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
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import "@src/App.css";
import * as api from "../../api";
import { UserContext } from "../../contexts/UserContext";
import { Layout } from "../../components/Layout";

export function Login() {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login({ email, password });
      if (res.token && res.user) {
        login(res.user, res.token);
        navigate("/menu");
      } else {
        setError("Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión o credenciales inválidas");
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
        style={{ height: "100%" }}
      >
        <Box p="1">
          <Text size="6" weight="bold">
            Iniciar sesión
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
              <label htmlFor="email">Email</label>
              <TextField.Root
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="3"
                placeholder="Email"
              />
              <label htmlFor="password">Contraseña</label>
              <TextField.Root
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="3"
                placeholder="Contraseña"
              />
              <Button
                style={{ marginTop: "1rem" }}
                className="button"
                type="submit"
                size="3"
                loading={loading}
                disabled={loading}
              >
                Ingresar
              </Button>
              {error && <Callout.Root color="red">{error}</Callout.Root>}
            </Flex>
          </form>
        </Box>
      </Flex>
    </Layout>
  );
}
