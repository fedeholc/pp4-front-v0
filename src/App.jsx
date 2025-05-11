import { Button, Flex, Text, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import "./App.css";
import { Home } from "./Home";
import { RegisterCliente } from "./RegisterCliente";
import { RegisterTecnico } from "./RegisterTecnico";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MenuPrincipal } from "./MenuPrincipal";
import * as api from "./api";
import {
  Box,
  Card,
  TextField,
  Button as RadixButton,
  Callout,
} from "@radix-ui/themes";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <Theme accentColor="grass" grayColor="gray" radius="large">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <LoginScreen
                onLogin={(u, t) => {
                  setUser(u);
                  setToken(t);
                }}
              />
            }
          />
          <Route
            path="/menu"
            element={
              user ? (
                <MenuPrincipal user={user} onLogout={handleLogout} />
              ) : (
                <LoginScreen
                  onLogin={(u, t) => {
                    setUser(u);
                    setToken(t);
                  }}
                />
              )
            }
          />
          <Route path="/register/:tipo" element={<RegisterScreen />} />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
}

export default App;

function LoginScreen({ onLogin }) {
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
        onLogin(res.user, res.token);
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
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "60vh" }}
    >
      <Box p="5">
        <Text size="6" weight="bold">
          Iniciar sesión
        </Text>
      </Box>
      <Card
        variant="ghost"
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
      </Card>
    </Flex>
  );
}

export function RegisterScreen() {
  const { tipo } = useParams();
  if (tipo === "cliente") return <RegisterCliente />;
  if (tipo === "tecnico") return <RegisterTecnico />;
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "60vh" }}
    >
      <Text size="6" weight="bold">
        ERROR
      </Text>
    </Flex>
  );
}
