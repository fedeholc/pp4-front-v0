import { Flex, Text, Button, Card, Box, Grid } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Drawer from "../../components/Drawer";
import { Layout } from "../../components/Layout";
import {
  Toolbox,
  MoneyWavy,
  ReceiptX,
  FileMagnifyingGlass,
  StarHalf,
} from "@phosphor-icons/react";

export function Menu() {
  const { user } = useContext(UserContext);

  function MenuCliente() {
    return (
      <Box className="card" style={{ padding: "2rem" }}>
        <Grid columns={{ xs: "1", sm: "2" }} gap="4">
          <Flex direction="column" align="center" justify="center" gap="4">
            <Toolbox size={60} weight="duotone" />
            <Button className="button" size="3">
              Solicitar servicio técnico
            </Button>
          </Flex>
          <Flex direction="column" align="center" justify="center" gap="4">
            <ReceiptX size={60} weight="duotone" />

            <Button className="button" size="3">
              Cancelar servicio
            </Button>
          </Flex>
          <Flex direction="column" align="center" justify="center" gap="4">
            <FileMagnifyingGlass size={60} weight="duotone" />

            <Button className="button" size="3">
              Ver historial de servicios
            </Button>
          </Flex>
          <Flex direction="column" align="center" justify="center" gap="4">
            <StarHalf size={60} weight="duotone" />

            <Button className="button" size="3">
              Calificar técnico
            </Button>
          </Flex>
        </Grid>
      </Box>
    );
  }
  function MenuTecnico() {
    return (
      <Box className="card" style={{ padding: "2rem" }}>
        <Grid columns={{ xs: "1", sm: "2" }} gap="4">
          <Flex direction="column" align="center" justify="center" gap="4">
            <Toolbox size={60} weight="duotone" />
            <Button className="button" size="3">
              Ver servicios solicitados
            </Button>
          </Flex>
          <Flex direction="column" align="center" justify="center" gap="4">
            <MoneyWavy size={60} weight="duotone" />

            <Button className="button" size="3">
              Pagar membresía
            </Button>
          </Flex>
          <Flex direction="column" align="center" justify="center" gap="4">
            <FileMagnifyingGlass size={60} weight="duotone" />

            <Button className="button" size="3">
              Ver historial de servicios
            </Button>
          </Flex>
        </Grid>
      </Box>
    );
  }

  return (
    <Layout>
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{ padding: "1rem 0.5rem 2rem 0.5rem", height: "100%" }}
        gap="3"
      >
        <Text size="6" weight="bold">
          Menú Principal
        </Text>
        <Text size="4">
          Bienvenido, {user?.nombre || user?.email || "Usuario"}
        </Text>
        <Text size="3">Rol: {user?.rol || "-"}</Text>
        {user?.rol === "cliente" && <MenuCliente />}
        {user?.rol === "tecnico" && <MenuTecnico />}
      </Flex>
    </Layout>
  );
}
