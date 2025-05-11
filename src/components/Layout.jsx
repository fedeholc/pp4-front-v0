import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Container,
  DropdownMenu,
  IconButton,
  Link,
  TabNav,
  Text,
} from "@radix-ui/themes";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";
import "./Layout.css";
export function Layout({ children }) {
  const pathname = window.location.pathname;
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);
  console.log(pathname);
  return (
    <div className="layout">
      <nav className="nav">
        {" "}
        <Container
          className="container"
          style={{ padding: "0", marginTop: "0.5rem" }}
        >
          <div className="nav-row">
            <TabNav.Root size="2">
              <TabNav.Link asChild active={pathname === "/"}>
                <Link href="/">Inicio</Link>
              </TabNav.Link>
              <TabNav.Link asChild active={pathname === "/menu"}>
                <Link href="/menu">Menú Principal</Link>
              </TabNav.Link>
            </TabNav.Root>
            <div className="hamburger">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton size="2" variant="soft">
                    <HamburgerMenuIcon width="15" height="15" />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" variant="soft" color="indigo">
                  <DropdownMenu.Item onClick={() => navigate("/")}>
                    Inicio
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Cerrar Sesión
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>
        </Container>
      </nav>
      <main className="main">{children}</main>

      <footer className="footer">
        <Container className="container">
          <Text size="2">Asistec 2025</Text>
        </Container>
      </footer>
    </div>
  );
}
