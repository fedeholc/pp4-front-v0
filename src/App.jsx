import { Flex, Text, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import "./App.css";
import { Home } from "./Home";
import { RegisterCliente } from "./RegisterCliente";

function App() {
  return (
    <Theme accentColor="grass" grayColor="gray" radius="full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register/:tipo" element={<RegisterScreen />} />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
}

export default App;


function LoginScreen() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "60vh" }}
    >
      <Text size="5">Pantalla de Login (por implementar)</Text>
    </Flex>
  );
}

export function RegisterScreen() {
  const { tipo } = useParams();
  if (tipo === "cliente") return <RegisterCliente />;
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "60vh" }}
    >
      <Text size="5">
        Pantalla de Registro ({tipo === "tecnico" ? "Técnico" : "Cliente"}) (por
        implementar)
      </Text>
    </Flex>
  );
}
