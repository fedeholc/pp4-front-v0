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
import { Lock, Email } from "@mui/icons-material";

export function Login() {
  const { setUser, setToken } = useContext(UserContext);
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
        setUser(res.user);
        setToken(res.token);
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
        sx={{ height: "100%",  }}
      >
        <Box p={1}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Iniciar sesión
          </Typography>
        </Box>
        <Paper
          className="gradientBackground"
          elevation={4}
          variant="outlined"
          sx={{
            p: 5,
            borderRadius: 4,
            minWidth: { xs: 320, sm: 400 },
            background: "linear-gradient(345deg, #eaff0005, #eaff0010)",
            boxShadow: 1,
            border: "1px solid #e0e0e0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Email color="action" />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="medium"
                  placeholder="Email"
                  fullWidth
                  autoFocus
                />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Lock color="action" />
                <TextField
                  id="password"
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="medium"
                  placeholder="Contraseña"
                  fullWidth
                />
              </Stack>
              <Button
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  mt: 2,
                  py: 1.2,
                  fontSize: "1.1rem",
                }}
                className="button"
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
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
