import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { RegisterCliente } from "./RegisterCliente";
import { UserContext } from "../../contexts/UserContext";

// Mock api
vi.mock("../../api", () => ({
  register: vi.fn(),
  createCliente: vi.fn(),
}));
import * as api from "../../api";

describe("RegisterCliente", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillForm = async () => {
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
        target: { value: "123456" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Nombre/i), {
        target: { value: "Juan" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Apellido/i), {
        target: { value: "Pérez" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Teléfono/i), {
        target: { value: "123456789" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Dirección/i), {
        target: { value: "Calle Falsa 123" },
      });
    });
  };

  const renderWithContext = (ui) => {
    // Provide a minimal UserContext to satisfy Layout
    const contextValue = {
      user: null,
      token: null,
      setUser: vi.fn(),
      setToken: vi.fn(),
      logout: vi.fn(),
    };
    return render(
      <BrowserRouter>
        <UserContext.Provider value={contextValue}>{ui}</UserContext.Provider>
      </BrowserRouter>
    );
  };

  // Helper to get the main submit button (type=submit)
  const getSubmitButton = () =>
    screen
      .getAllByRole("button", { name: /Registrarme/i })
      .find((btn) => btn.getAttribute("type") === "submit");

  it("renderiza el formulario de registro", () => {
    renderWithContext(<RegisterCliente />);
    expect(screen.getByText(/Registro como Cliente/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Dirección/i)).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it("muestra error si la API de registro falla", async () => {
    vi.mocked(api.register).mockRejectedValue(new Error("Error de registro"));
    renderWithContext(<RegisterCliente />);
    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });
    expect(await screen.findByText(/Error de registro/i)).toBeInTheDocument();
  });

  it("muestra error si createCliente falla", async () => {
    vi.mocked(api.register).mockResolvedValue({ id: 1, token: "tok" });
    vi.mocked(api.createCliente).mockRejectedValue(new Error("Error cliente"));
    renderWithContext(<RegisterCliente />);
    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });
    expect(await screen.findByText(/Error cliente/i)).toBeInTheDocument();
  });

  it("muestra mensaje de éxito y botón para iniciar sesión si el registro es exitoso", async () => {
    vi.mocked(api.register).mockResolvedValue({ id: 1, token: "tok" });
    vi.mocked(api.createCliente).mockResolvedValue({ id: 2 });
    renderWithContext(<RegisterCliente />);
    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });
    expect(await screen.findByText(/Registro exitoso/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Iniciar Sesión/i })
    ).toBeInTheDocument();
  });

  it("deshabilita el botón mientras está cargando", async () => {
    let resolveRegister;
    vi.mocked(api.register).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve;
        })
    );
    renderWithContext(<RegisterCliente />);
    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });
    expect(getSubmitButton()).toBeDisabled();
    await act(async () => {
      resolveRegister({ id: 1, token: "tok" });
    });
  });
});
