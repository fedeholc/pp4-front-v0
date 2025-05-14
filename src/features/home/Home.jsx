import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router";
import "@src/App.css";
import { Layout } from "../../components/Layout";

export function Home() {
  const navigate = useNavigate();
  return (
    <Layout>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        gap={4}
      >
        <Stack direction="column" gap={4} alignItems="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "var(--mui-palette-primary-dark)" }}
          >
            Bienvenido a Asistec
          </Typography>
          <Paper
            className="gradientBackground"
            variant="outlined"
            sx={{ p: 4 }}
          >
            <Stack direction="column" gap={3}>
              <Button
                className="button"
                size="large"
                variant="contained"
                onClick={() => navigate("/register/cliente")}
              >
                Registrarme como cliente
              </Button>
              <Button
                className="button"
                size="large"
                variant="contained"
                onClick={() => navigate("/register/tecnico")}
              >
                Registrarme como técnico
              </Button>
              <Button
                className="button"
                size="large"
                variant="outlined"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Layout>
  );
}
