import { Flex, Text, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useState } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import "./App.css";
import { Home } from "./features/home/Home";
import { Menu } from "./features/Menu/Menu";
import { Login } from "./features/login/Login";
import { RegisterCliente } from "./features/register/RegisterCliente";
import { RegisterTecnico } from "./features/register/RegisterTecnico";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <Theme accentColor="grass" grayColor="gray" radius="large">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <Login
                onLogin={(u, t) => {
                  setUser(u);
                  setToken(t);
                }}
              />
            }
          />
          <Route
            path="/menu"
            element={
              user ? (
                <Menu user={user} onLogout={handleLogout} />
              ) : (
                <Login
                  onLogin={(u, t) => {
                    setUser(u);
                    setToken(t);
                  }}
                />
              )
            }
          />
          <Route path="/register/cliente" element={<RegisterCliente />} />
          <Route path="/register/tecnico" element={<RegisterTecnico />} />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
}

export default App;
