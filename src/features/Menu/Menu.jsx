import { Flex, Text, Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export function Menu({ user, onLogout }) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "60vh" }}
      gap="4"
    >
      <Text size="6" weight="bold">
        Menú Principal
      </Text>
      <Text size="4">
        Bienvenido, {user?.nombre || user?.email || "Usuario"}
      </Text>
      <Text size="3">Rol: {user?.rol || "-"}</Text>
      {/* Aquí puedes agregar más opciones de menú según el rol */}
      <Button size="3" color="red" onClick={onLogout}>
        Cerrar sesión
      </Button>
    </Flex>
  );
}
