import { Button, Card, Flex, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useNavigate } from "react-router";
import "@src/App.css";

export function Home() {
  const navigate = useNavigate();
  return (
    <Flex direction="column" align="center" justify="center" height={"100dvh"}>
      <Card className="card" style={{ padding: "2rem" }}>
        <Flex direction="column" gap="4" align="center">
          <Text size="6" weight="bold">
            Bienvenido a Asistec
          </Text>
          <Flex direction="column" gap="3">
            <Button
              className="button"
              size="3"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>
            <Button
              className="button"
              size="3"
              variant="outline"
              onClick={() => navigate("/register/cliente")}
            >
              Registrarse como cliente
            </Button>
            <Button
              className="button"
              size="3"
              variant="outline"
              onClick={() => navigate("/register/tecnico")}
            >
              Registrarse como técnico
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
