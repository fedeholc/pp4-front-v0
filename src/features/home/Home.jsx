import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router";
import "@src/App.css";
import { Layout } from "../../components/Layout";
import { Person, Group, Login } from "@mui/icons-material";
import LogoAsistec from "../../assets/logo-asistec.jpg";

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
        gap={2}
        sx={{
          /*           background: "linear-gradient(345deg, #eaff0005, #eaff0010)",
           */ padding: 1,
        }}
      >
        <Stack direction="column" gap={4} alignItems="center">
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "var(--mui-palette-primary-dark)",
              mb: 1,
              textShadow: "0 2px 8px #eaff0033",
            }}
          >
            Bienvenido a Asistec
          </Typography>
          <img
            height={100}
            style={{ borderRadius: "1rem" }}
            src={LogoAsistec}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, textAlign: "center", maxWidth: 500 }}
          >
            Solicitá servicios técnicos de manera rápida, segura y profesional.
            Elige tu rol para comenzar:
          </Typography>
          <Paper
            className="gradientBackground"
            elevation={4}
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: 4,
              background: "linear-gradient(345deg, #eaff0005, #eaff0010)",
              boxShadow: 1,
              border: "1px solid #e0e0e0",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Stack direction="column" gap={3} sx={{ width: "100%" }}>
              <Button
                className="button"
                size="large"
                variant="contained"
                onClick={() => navigate("/register/cliente")}
                startIcon={<Person />}
                sx={{ borderRadius: 2, fontWeight: 600, width: "100%" }}
              >
                Registrarme como cliente
              </Button>
              <Button
                className="button"
                size="large"
                variant="contained"
                color="secondary"
                onClick={() => navigate("/register/tecnico")}
                startIcon={<Group />}
                sx={{ borderRadius: 2, fontWeight: 600, width: "100%" }}
              >
                Registrarme como técnico
              </Button>
              <Button
                className="button"
                size="large"
                variant="outlined"
                onClick={() => navigate("/login")}
                startIcon={<Login />}
                sx={{ borderRadius: 2, fontWeight: 600, width: "100%" }}
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
