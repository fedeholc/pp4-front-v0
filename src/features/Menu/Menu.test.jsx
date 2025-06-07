import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { Menu } from "./Menu";
import { UserContext } from "../../contexts/UserContext";

// Mock de react-router para el hook useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouterAndContext = (component, user) => {
  // Provide default/mock implementations for required context values
  const contextValue = {
    user,
    token: "",
    setUser: vi.fn(),
    setToken: vi.fn(),
    logout: vi.fn(),
  };
  return render(
    <BrowserRouter>
      <UserContext.Provider value={contextValue}>
        {component}
      </UserContext.Provider>
    </BrowserRouter>
  );
};

describe("Menu Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("debe renderizar el título del menú", () => {
    renderWithRouterAndContext(<Menu />, { rol: "cliente" });
    expect(
      screen.getByRole("heading", { name: "Menú Principal" })
    ).toBeInTheDocument();
  });

  it("muestra botones de cliente si el rol es cliente", () => {
    renderWithRouterAndContext(<Menu />, { rol: "cliente" });
    expect(screen.getByText(/Solicitar\s*servicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Mis pedidos/i)).toBeInTheDocument();
    // No debe mostrar botones de técnico
    expect(
      screen.queryByText(/Ver pedidos disponibles/i)
    ).not.toBeInTheDocument();
  });

  it("muestra botones de técnico si el rol es tecnico", () => {
    renderWithRouterAndContext(<Menu />, {
      rol: "tecnico",
      tecnico: { id: 42 },
    });
    expect(screen.getByText(/Ver pedidos disponibles/i)).toBeInTheDocument();
    expect(screen.getByText(/Mis Pedidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Pagar membresía/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver Mi Perfil/i)).toBeInTheDocument();
    // No debe mostrar botones de cliente
    expect(screen.queryByText(/Solicitar\s*servicio/i)).not.toBeInTheDocument();
  });

  it("navega correctamente al hacer click en los botones de cliente", () => {
    renderWithRouterAndContext(<Menu />, { rol: "cliente" });
    fireEvent.click(screen.getByText(/Solicitar\s*servicio/i));
    expect(mockNavigate).toHaveBeenCalledWith("/cliente/nuevo-pedido");
    fireEvent.click(screen.getByText(/Mis pedidos/i));
    expect(mockNavigate).toHaveBeenCalledWith("/cliente/pedidos");
  });

  it("navega correctamente al hacer click en los botones de técnico", () => {
    renderWithRouterAndContext(<Menu />, {
      rol: "tecnico",
      tecnico: { id: 99 },
    });
    fireEvent.click(screen.getByText(/Ver pedidos disponibles/i));
    expect(mockNavigate).toHaveBeenCalledWith("/tecnico/pedidos-disponibles");
    fireEvent.click(screen.getByText(/Mis Pedidos/i));
    expect(mockNavigate).toHaveBeenCalledWith("/tecnico/mis-pedidos");
    fireEvent.click(screen.getByText(/Ver Mi Perfil/i));
    expect(mockNavigate).toHaveBeenCalledWith("/tecnico/99/perfil");
  });
});
