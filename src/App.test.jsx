import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

// Mock all page components
vi.mock("./features/home/Home", () => ({ Home: () => <div>HomePage</div> }));
vi.mock("./features/login/Login", () => ({
  Login: () => <div>LoginPage</div>,
}));
vi.mock("./features/Menu/Menu", () => ({ Menu: () => <div>MenuPage</div> }));
vi.mock("./features/register/RegisterCliente", () => ({
  RegisterCliente: () => <div>RegisterClientePage</div>,
}));
vi.mock("./features/register/RegisterTecnico", () => ({
  RegisterTecnico: () => <div>RegisterTecnicoPage</div>,
}));
vi.mock("./features/cliente/PedidoNuevo", () => ({
  PedidoNuevo: () => <div>PedidoNuevoPage</div>,
}));
vi.mock("./features/cliente/ListadoPedidos", () => ({
  ListadoPedidos: () => <div>ListadoPedidosPage</div>,
}));
vi.mock("./features/cliente/PedidoCandidatos", () => ({
  PedidoCandidatos: () => <div>PedidoCandidatosPage</div>,
}));
vi.mock("./features/tecnico/TecnicoPerfil", () => ({
  TecnicoPerfil: () => <div>TecnicoPerfilPage</div>,
}));
vi.mock("./features/tecnico/PedidosDisponibles", () => ({
  PedidosDisponibles: () => <div>PedidosDisponiblesPage</div>,
}));
vi.mock("./features/tecnico/TecnicoMisPedidos", () => ({
  TecnicoMisPedidos: () => <div>TecnicoMisPedidosPage</div>,
}));
vi.mock("./features/ProtectedRoute", () => ({
  ProtectedRoute: ({ children }) => <div>Protected:{children}</div>,
}));

// Mock react-router to use MemoryRouter with initialEntries
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    BrowserRouter: ({ children, initialEntries }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    ),
  };
});

// Import App after all mocks
import App from "./App";

function renderWithRoute(route) {
  return render(<App initialEntries={[route]} />);
}

describe("App routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza Home en ruta /", () => {
    renderWithRoute("/");
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });

  it("renderiza Login en ruta /login", () => {
    renderWithRoute("/login");
    expect(screen.getByText("LoginPage")).toBeInTheDocument();
  });

  it("renderiza Menu protegido en /menu", () => {
    renderWithRoute("/menu");
    expect(screen.getByText(/Protected/)).toBeInTheDocument();
    expect(screen.getByText("MenuPage")).toBeInTheDocument();
  });

  it("renderiza RegisterCliente en /register/cliente", () => {
    renderWithRoute("/register/cliente");
    expect(screen.getByText("RegisterClientePage")).toBeInTheDocument();
  });

  it("renderiza RegisterTecnico en /register/tecnico", () => {
    renderWithRoute("/register/tecnico");
    expect(screen.getByText("RegisterTecnicoPage")).toBeInTheDocument();
  });

  it("renderiza PedidoNuevo en /cliente/nuevo-pedido", () => {
    renderWithRoute("/cliente/nuevo-pedido");
    expect(screen.getByText("PedidoNuevoPage")).toBeInTheDocument();
  });

  it("renderiza ListadoPedidos en /cliente/pedidos", () => {
    renderWithRoute("/cliente/pedidos");
    expect(screen.getByText("ListadoPedidosPage")).toBeInTheDocument();
  });

  it("renderiza PedidoCandidatos en /cliente/pedidos/:pedidoId/candidatos", () => {
    renderWithRoute("/cliente/pedidos/123/candidatos");
    expect(screen.getByText("PedidoCandidatosPage")).toBeInTheDocument();
  });

  it("renderiza TecnicoPerfil en /tecnico/:id/perfil", () => {
    renderWithRoute("/tecnico/42/perfil");
    expect(screen.getByText("TecnicoPerfilPage")).toBeInTheDocument();
  });

  it("renderiza PedidosDisponibles en /tecnico/pedidos-disponibles", () => {
    renderWithRoute("/tecnico/pedidos-disponibles");
    expect(screen.getByText("PedidosDisponiblesPage")).toBeInTheDocument();
  });

  it("renderiza TecnicoMisPedidos en /tecnico/mis-pedidos", () => {
    renderWithRoute("/tecnico/mis-pedidos");
    expect(screen.getByText("TecnicoMisPedidosPage")).toBeInTheDocument();
  });

  it("redirige a Home en ruta desconocida", () => {
    renderWithRoute("/ruta/desconocida");
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });
});
