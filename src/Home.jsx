import { Button, Flex, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useNavigate } from "react-router";
import "./App.css";

export function Home() {
  const navigate = useNavigate();
  return (
    <Flex
      direction="column"
      gap="4"
      width="100%"
      align="center"
      justify="center"
      style={{ minHeight: "60vh" }}
    >
      <Text size="6" weight="bold">
        Bienvenido a la plataforma
      </Text>
      <Flex gap="3">
        <Button size="3" onClick={() => navigate("/login")}>
          Iniciar sesión
        </Button>
        <Button
          size="3"
          variant="soft"
          onClick={() => navigate("/register/cliente")}
        >
          Registrarse como cliente
        </Button>
        <Button
          size="3"
          variant="soft"
          onClick={() => navigate("/register/tecnico")}
        >
          Registrarse como técnico
        </Button>
      </Flex>
    </Flex>
  );
}
