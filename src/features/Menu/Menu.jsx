import { useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { UserContext } from "../../contexts/UserContext";
import { Layout } from "../../components/Layout";
import {
  Toolbox,
  MoneyWavy,
  ReceiptX,
  FileMagnifyingGlass,
  StarHalf,
} from "@phosphor-icons/react";
import { Container, Paper } from "@mui/material";

export function Menu() {
  const { user } = useContext(UserContext);

  console.log("User in Menu:", user);
  function MenuCliente() {
    return (
      <Paper
        className="gradientBackground"
        variant="outlined"
        sx={{ padding: "2rem" }}
      >
        <Container maxWidth="sm">
          <Grid
            container
            alignContent={"center"}
            justifyContent={"center"}
            spacing={4}
            columns={{ xs: 1, sm: 2 }}
          >
            <Grid>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <Toolbox size={60} weight="duotone" />
                <Button className="button" size="large" variant="contained">
                  Solicitar servicio técnico
                </Button>
              </Stack>
            </Grid>
            <Grid>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <ReceiptX size={60} weight="duotone" />
                <Button className="button" size="large" variant="contained">
                  Cancelar servicio
                </Button>
              </Stack>
            </Grid>
            <Grid>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <FileMagnifyingGlass size={60} weight="duotone" />
                <Button className="button" size="large" variant="contained">
                  Ver historial de servicios
                </Button>
              </Stack>
            </Grid>
            <Grid>
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
      <Card className="card" sx={{ padding: "2rem" }}>
        <Toolbox size={60} weight="duotone" />
        <Button className="button" size="large" variant="contained">
          Ver servicios solicitados
        </Button>

        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          <MoneyWavy size={60} weight="duotone" />
          <Button className="button" size="large" variant="contained">
            Pagar membresía
          </Button>
        </Stack>

        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          <FileMagnifyingGlass size={60} weight="duotone" />
          <Button className="button" size="large" variant="contained">
            Ver historial de servicios
          </Button>
        </Stack>
      </Card>
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
