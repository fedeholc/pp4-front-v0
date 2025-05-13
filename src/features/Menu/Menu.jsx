import { Flex, Text, Button, Card, Box } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Drawer from "../../components/Drawer";
import { Layout } from "../../components/Layout";

export function Menu() {
  const { user, logout } = useContext(UserContext);
  return (
    <Layout>
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{ padding: "1rem 0.5rem 2rem 0.5rem", height: "100%" }}
        gap="3"
      >
        <Box className="card" style={{ padding: "2rem" }}>
          <Flex direction="column" align="center" justify="center" gap="4">
            <Text size="6" weight="bold">
              Menú Principal
            </Text>
            <Text size="4">
              Bienvenido, {user?.nombre || user?.email || "Usuario"}
            </Text>
            <Text size="3">Rol: {user?.rol || "-"}</Text>
            <Button size="3" color="red" onClick={logout}>
              Cerrar sesión
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Layout>
  );
}
