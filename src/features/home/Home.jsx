import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useNavigate } from "react-router";
import "@src/App.css";
import { Layout } from "../../components/Layout";

export function Home() {
  const navigate = useNavigate();
  return (
    <Layout>
      <Flex direction="column" align="center" justify="center" height={"100%"} gap="4">
        <Box className="card"  style={{ padding: "2rem" }}>
          <Flex direction="column" gap="4" align="center">
            <Text size="6" weight="bold">
              Bienvenido a Asistec
            </Text>
            <Flex direction="column" gap="3">
              <Button
                className="button"
                size="3"
                onClick={() => navigate("/register/cliente")}
              >
                Registrarme como cliente
              </Button>
              <Button
                className="button"
                size="3"
                onClick={() => navigate("/register/tecnico")}
              >
                Registrarme como técnico
              </Button>
              <Button
                className="button"
                size="3"
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Layout>
  );
}
