import { useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { UserContext } from "../../contexts/UserContext";
import { Layout } from "../../components/Layout";
import WorkTwoToneIcon from "@mui/icons-material/WorkTwoTone";
import {
  Toolbox,
  MoneyWavy,
  ReceiptX,
  FileMagnifyingGlass,
  StarHalf,
  Wrench,
} from "@phosphor-icons/react";
import { Container, Paper } from "@mui/material";
import { useNavigate } from "react-router";

export function Menu() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("User in Menu:", user);
  function MenuCliente() {
    return (
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
        <Container maxWidth="sm">
          <Grid
            container
            alignContent={"center"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={4}
            columns={{ xs: 1, sm: 2 }}
          >
            <Grid size={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <Toolbox size={60} weight="duotone" />
                <Button
                  className="button"
                  size="large"
                  variant="contained"
                  onClick={() => navigate("/cliente/nuevo-pedido")}
                >
                  Solicitar servicio
                </Button>
              </Stack>
            </Grid>
            <Grid size={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <ReceiptX size={60} weight="duotone" />
                <Button className="button" size="large" variant="contained">
                  Cancelar pedido
                </Button>
              </Stack>
            </Grid>
            <Grid size={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <FileMagnifyingGlass size={60} weight="duotone" />
                <Button
                  className="button"
                  size="large"
                  variant="contained"
                  onClick={() => navigate("/cliente/pedidos")}
                >
                  Mis pedidos
                </Button>
              </Stack>
            </Grid>
            <Grid size={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <StarHalf size={60} weight="duotone" />
                <Button className="button" size="large" variant="contained">
                  Calificar técnico
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    );
  }
  function MenuTecnico() {
    return (
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
        <Container maxWidth="sm">
          <Grid
            container
            alignContent={"center"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={4}
            columns={{ xs: 1, sm: 2 }}
          >
            <Grid size={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <Toolbox size={60} weight="duotone" />
                <Button
                  className="button"
                  size="large"
                  variant="contained"
                  onClick={() => navigate("/tecnico/pedidos-disponibles")}
                >
                  Ver pedidos disponibles
                </Button>
              </Stack>
            </Grid>
            <Grid size={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <Wrench size={60} weight="duotone" />

                <Button
                  className="button"
                  size="large"
                  onClick={() => navigate("/tecnico/mis-pedidos")}
                  variant="contained"
                >
                  Mis Pedidos
                </Button>
              </Stack>
            </Grid>
            <Grid size={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <MoneyWavy size={60} weight="duotone" />
                <Button className="button" size="large" variant="contained">
                  Pagar membresía
                </Button>
              </Stack>
            </Grid>
            <Grid size={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <FileMagnifyingGlass size={60} weight="duotone" />
                <Button className="button" size="large" variant="contained">
                  Historial de servicios
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    );
  }

  return (
    <Layout>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={3}
        sx={{ padding: "1rem 0.5rem 2rem 0.5rem", height: "100%" }}
      >
        <Typography variant="h4" fontWeight="bold">
          Menú Principal
        </Typography>
        <Typography variant="h6">
          Bienvenido, {user?.email || "Usuario"}
        </Typography>
        <Typography variant="body1">Rol: {user?.rol || "-"}</Typography>
        {user?.rol === "cliente" && <MenuCliente />}
        {user?.rol === "tecnico" && <MenuTecnico />}
      </Stack>
    </Layout>
  );
}
