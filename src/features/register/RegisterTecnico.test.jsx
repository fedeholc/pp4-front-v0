import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { RegisterTecnico } from "./RegisterTecnico";
import { UserContext } from "../../contexts/UserContext";

// Mock api
vi.mock("../../api", () => ({
  register: vi.fn(),
  createTecnico: vi.fn(),
  createTecnicoArea: vi.fn(),
  getAreas: vi.fn(),
}));
import * as api from "../../api";

describe("RegisterTecnico", () => {
  const mockAreas = [
    { id: 1, nombre: "Electricidad" },
    { id: 2, nombre: "Plomería" },
    { id: 3, nombre: "Carpintería" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getAreas by default
    vi.mocked(api.getAreas).mockResolvedValue(mockAreas);
  });

  const fillForm = async () => {
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: "tecnico@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
        target: { value: "123456" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Nombre/i), {
        target: { value: "Carlos" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Apellido/i), {
        target: { value: "García" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Teléfono/i), {
        target: { value: "987654321" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Dirección/i), {
        target: { value: "Av. Principal 456" },
      });
      fireEvent.change(screen.getByPlaceholderText(/Características/i), {
        target: { value: "Técnico especializado en instalaciones eléctricas" },
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

  it("renderiza el formulario de registro", async () => {
    renderWithContext(<RegisterTecnico />);

    expect(screen.getByText(/Registro como Técnico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Dirección/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Características/i)).toBeInTheDocument();
    expect(screen.getByText(/Áreas de trabajo/i)).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it("carga las áreas de trabajo al inicializar", async () => {
    renderWithContext(<RegisterTecnico />);

    // Wait for areas to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(api.getAreas).toHaveBeenCalledTimes(1);
  });

  it("maneja el error al cargar áreas sin fallar", async () => {
    vi.mocked(api.getAreas).mockRejectedValue(
      new Error("Error al cargar áreas")
    );

    renderWithContext(<RegisterTecnico />);

    // Wait for areas to load (should fail gracefully)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(api.getAreas).toHaveBeenCalledTimes(1);
    // The component should still render without crashing
    expect(screen.getByText(/Registro como Técnico/i)).toBeInTheDocument();
  });

  it("muestra error si la API de registro falla", async () => {
    vi.mocked(api.register).mockRejectedValue(new Error("Error de registro"));
    renderWithContext(<RegisterTecnico />);

    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });

    expect(await screen.findByText(/Error de registro/i)).toBeInTheDocument();
  });

  it("muestra error si createTecnico falla", async () => {
    vi.mocked(api.register).mockResolvedValue({ id: 1, token: "tok" });
    vi.mocked(api.createTecnico).mockRejectedValue(new Error("Error técnico"));
    renderWithContext(<RegisterTecnico />);

    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });

    expect(await screen.findByText(/Error técnico/i)).toBeInTheDocument();
  });

  it("muestra error si createTecnicoArea falla", async () => {
    vi.mocked(api.register).mockResolvedValue({ id: 1, token: "tok" });
    vi.mocked(api.createTecnico).mockResolvedValue({ id: 2 });
    vi.mocked(api.createTecnicoArea).mockRejectedValue(new Error("Error área"));
    renderWithContext(<RegisterTecnico />);

    await fillForm();

    // Simular la selección de áreas mediante click en el select y después en las opciones
    await act(async () => {
      const areasSelect = screen.getByRole("combobox");
      fireEvent.mouseDown(areasSelect);
    });

    // Wait for options to appear and click on the first one
    await act(async () => {
      const electricidadOption = await screen.findByRole("option", {
        name: "Electricidad",
      });
      fireEvent.click(electricidadOption);
    });

    // Close the dropdown by pressing Escape
    await act(async () => {
      fireEvent.keyDown(document.activeElement || document.body, {
        key: "Escape",
        code: "Escape",
      });
    });

    // Wait for the dropdown to close and the button to be available
    await waitFor(() => {
      expect(getSubmitButton()).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(getSubmitButton());
    });

    expect(await screen.findByText(/Error área/i)).toBeInTheDocument();
  });

  it("muestra mensaje de éxito y botón para iniciar sesión si el registro es exitoso", async () => {
    vi.mocked(api.register).mockResolvedValue({ id: 1, token: "tok" });
    vi.mocked(api.createTecnico).mockResolvedValue({ id: 2 });
    vi.mocked(api.createTecnicoArea).mockResolvedValue({ id: 3 });
    renderWithContext(<RegisterTecnico />);

    await fillForm();

    // Simular la selección de áreas mediante click en el select y después en las opciones
    await act(async () => {
      const areasSelect = screen.getByRole("combobox");
      fireEvent.mouseDown(areasSelect);
    });

    // Wait for options to appear and click on the first one
    await act(async () => {
      const electricidadOption = await screen.findByRole("option", {
        name: "Electricidad",
      });
      fireEvent.click(electricidadOption);
    });

    // Close the dropdown by pressing Escape
    await act(async () => {
      fireEvent.keyDown(document.activeElement || document.body, {
        key: "Escape",
        code: "Escape",
      });
    });

    // Wait for the dropdown to close and the button to be available
    await waitFor(() => {
      expect(getSubmitButton()).toBeInTheDocument();
    });

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
    renderWithContext(<RegisterTecnico />);

    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });

    expect(getSubmitButton()).toBeDisabled();

    await act(async () => {
      resolveRegister({ id: 1, token: "tok" });
    });
  });

  it("registra técnico con rol correcto", async () => {
    vi.mocked(api.register).mockResolvedValue({ id: 1, token: "tok" });
    vi.mocked(api.createTecnico).mockResolvedValue({ id: 2 });
    renderWithContext(<RegisterTecnico />);

    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });

    expect(api.register).toHaveBeenCalledWith({
      email: "tecnico@example.com",
      password: "123456",
      rol: "tecnico",
    });
  });

  it("envía los datos correctos del técnico", async () => {
    vi.mocked(api.register).mockResolvedValue({ id: 1, token: "tok" });
    vi.mocked(api.createTecnico).mockResolvedValue({ id: 2 });
    renderWithContext(<RegisterTecnico />);

    await fillForm();
    await act(async () => {
      fireEvent.click(getSubmitButton());
    });

    expect(api.createTecnico).toHaveBeenCalledWith(
      {
        usuarioId: 1,
        nombre: "Carlos",
        apellido: "García",
        telefono: "987654321",
        direccion: "Av. Principal 456",
        caracteristicas: "Técnico especializado en instalaciones eléctricas",
        fechaRegistro: expect.any(Date),
      },
      "tok"
    );
  });

  it("registra las áreas seleccionadas", async () => {
    vi.mocked(api.register).mockResolvedValue({ id: 1, token: "tok" });
    vi.mocked(api.createTecnico).mockResolvedValue({ id: 2 });
    vi.mocked(api.createTecnicoArea).mockResolvedValue({ id: 3 });
    renderWithContext(<RegisterTecnico />);

    await fillForm();

    // Simular la selección de la primera área
    await act(async () => {
      const areasSelect = screen.getByRole("combobox");
      fireEvent.mouseDown(areasSelect);
    });

    await act(async () => {
      const electricidadOption = await screen.findByRole("option", {
        name: "Electricidad",
      });
      fireEvent.click(electricidadOption);
    });

    // Re-open to select second area - the select stays open for multiple selection
    await act(async () => {
      const plomeriaOption = screen.getByRole("option", { name: "Plomería" });
      fireEvent.click(plomeriaOption);
    });

    // Close the dropdown by pressing Escape
    await act(async () => {
      fireEvent.keyDown(document.activeElement || document.body, {
        key: "Escape",
        code: "Escape",
      });
    });

    // Wait for the dropdown to close and the button to be available
    await waitFor(() => {
      expect(getSubmitButton()).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(getSubmitButton());
    });

    expect(api.createTecnicoArea).toHaveBeenCalledTimes(2);
    expect(api.createTecnicoArea).toHaveBeenCalledWith(
      { tecnicoId: 2, areaId: 1 },
      "tok"
    );
    expect(api.createTecnicoArea).toHaveBeenCalledWith(
      { tecnicoId: 2, areaId: 2 },
      "tok"
    );
  });
});
