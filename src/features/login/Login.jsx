import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router";
import * as api from "../../api";
import { UserContext } from "../../contexts/UserContext";
import "@src/App.css";
import { Layout } from "../../components/Layout";
import { Paper } from "@mui/material";

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
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={3}
        sx={{ height: "100%" }}
      >
        <Box p={1}>
          <Typography variant="h4" fontWeight="bold">
            Iniciar sesión
          </Typography>
        </Box>
          <Paper className="gradientBackground" variant="outlined" sx={{ p: 4, }}>
          <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={3}>
              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="medium"
                placeholder="Email"
              />
              <TextField
                id="password"
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="medium"
                placeholder="Contraseña"
              />
              <Button
                sx={{ marginTop: "1rem" }}
                className="button"
                type="submit"
                size="large"
                variant="contained"
                disabled={loading}
              >
                Ingresar
              </Button>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Layout>
  );
}
