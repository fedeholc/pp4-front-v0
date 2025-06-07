import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { Home } from "./Home";
import { UserProvider } from "../../contexts/UserProvider";

// Mock de react-router para el hook useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouterAndContext = (component) => {
  return render(
    <BrowserRouter>
      <UserProvider>{component}</UserProvider>
    </BrowserRouter>
  );
};

describe("Home Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should render the home page title", () => {
    renderWithRouterAndContext(<Home />);

    expect(screen.getByText("Bienvenido a Asistec")).toBeInTheDocument();
  });

  it("should render client and technician buttons", () => {
    renderWithRouterAndContext(<Home />);

    expect(screen.getByText(/Registrarme como cliente/)).toBeInTheDocument();
    expect(screen.getByText(/Registrarme como técnico/)).toBeInTheDocument();
  });

  it("should navigate to client registration when client button is clicked", () => {
    renderWithRouterAndContext(<Home />);

    const clientButton = screen.getByText(/Registrarme como cliente/);
    fireEvent.click(clientButton);

    expect(mockNavigate).toHaveBeenCalledWith("/register/cliente");
  });

  it("should navigate to technician registration when technician button is clicked", () => {
    renderWithRouterAndContext(<Home />);

    const technicianButton = screen.getByText(/Registrarme como técnico/);
    fireEvent.click(technicianButton);

    expect(mockNavigate).toHaveBeenCalledWith("/register/tecnico");
  });
});
