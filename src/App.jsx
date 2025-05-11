import { Flex, Text, Theme } from "@radix-ui/themes";
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
    } catch (err) {
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
      <form onSubmit={handleSubmit} style={{ minWidth: 300 }}>
        <Text size="5" weight="bold">
          Iniciar sesión
        </Text>
        <div style={{ margin: "16px 0" }}>
          <label>
            Email
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ margin: "16px 0" }}>
          <label>
            Contraseña
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        {error && (
          <Text color="red" size="3">
            {error}
          </Text>
        )}
        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </form>
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
      <Text size="5">
        Pantalla de Registro ({tipo === "tecnico" ? "Técnico" : "Cliente"}) (por
        implementar)
      </Text>
    </Flex>
  );
}
