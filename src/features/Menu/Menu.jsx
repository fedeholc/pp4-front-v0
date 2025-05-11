import { Flex, Text, Button, Card } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export function Menu() {
  const { user, logout } = useContext(UserContext);
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "60vh" }}
      gap="4"
    >
      <Card variant="ghost" className="card" style={{ padding: "2rem" }}>
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
      </Card>
    </Flex>
  );
}
