import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { UserContext } from "./contexts/UserContext";
import { UserProvider } from "./contexts/UserProvider";
import { Home } from "./features/home/Home";
import { Login } from "./features/login/Login";
import { Menu } from "./features/Menu/Menu";
import { RegisterCliente } from "./features/register/RegisterCliente";
import { RegisterTecnico } from "./features/register/RegisterTecnico";
function App() {
  const { user } = useContext(UserContext);

  return (
    <Theme accentColor="grass" grayColor="gray" radius="large">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/menu"
            element={user && user?.id ? <Menu /> : <Login />}
          />
          <Route path="/register/cliente" element={<RegisterCliente />} />
          <Route path="/register/tecnico" element={<RegisterTecnico />} />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
}

export default App;
