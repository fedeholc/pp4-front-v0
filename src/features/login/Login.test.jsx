import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { Login } from "./Login";
import { UserContext } from "../../contexts/UserContext";

// Mock api
vi.mock("../../api", () => ({
  login: vi.fn(),
}));
import * as api from "../../api";

// Mock de react-router para el hook useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithContext = (ui, ctx = {}) => {
  const contextValue = {
    user: null,
    token: null,
    logout: vi.fn(),
    setUser: vi.fn(),
    setToken: vi.fn(),
    ...ctx,
  };
  return render(
    <BrowserRouter>
      <UserContext.Provider value={contextValue}>{ui}</UserContext.Provider>
    </BrowserRouter>
  );
};

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el formulario de login", () => {
    renderWithContext(<Login />);
    expect(screen.getByRole("heading", { name: /Iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ingresar/i })).toBeInTheDocument();
  });

  it("muestra error si la API falla", async () => {
    vi.mocked(api.login).mockRejectedValue(new Error("Error de conexión"));
    renderWithContext(<Login />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "fail@example.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "123456" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Ingresar/i }));
    });
    expect(await screen.findByText(/Error de conexión/i)).toBeInTheDocument();
  });

  it("muestra error si las credenciales son inválidas", async () => {
    // @ts-ignore
    vi.mocked(api.login).mockResolvedValue({});
    renderWithContext(<Login />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "bad@example.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "badpass" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Ingresar/i }));
    });
    expect(await screen.findByText(/Credenciales inválidas/i)).toBeInTheDocument();
  });

  it("llama a setUser, setToken y navega si el login es exitoso", async () => {
    const setUser = vi.fn();
    const setToken = vi.fn();
    vi.mocked(api.login).mockResolvedValue({ token: "tok", user: { id: 1, rol: "cliente" } });
    renderWithContext(<Login />, { setUser, setToken });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "ok@example.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "123456" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Ingresar/i }));
    });
    expect(setUser).toHaveBeenCalledWith({ id: 1, rol: "cliente" });
    expect(setToken).toHaveBeenCalledWith("tok");
    expect(mockNavigate).toHaveBeenCalledWith("/menu");
  });

  it("deshabilita el botón mientras está cargando", async () => {
    let resolveLogin;
    vi.mocked(api.login).mockImplementation(
      () => new Promise((resolve) => { resolveLogin = resolve; })
    );
    renderWithContext(<Login />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "ok@example.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "123456" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Ingresar/i }));
    });
    expect(screen.getByRole("button", { name: /Ingresar/i })).toBeDisabled();
    await act(async () => {
      resolveLogin({ token: "tok", user: { id: 1, rol: "cliente" } });
    });
  });
});
