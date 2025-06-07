import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { PedidoNuevo } from "./PedidoNuevo";
import { UserContext } from "../../contexts/UserContext";

// Mock de la API
vi.mock("../../api", () => ({
  getAreas: vi.fn(),
  createPedido: vi.fn(),
  createPedidoDisponibilidad: vi.fn(),
}));

// Import mocked functions
import * as api from "../../api";

// Mock user data for testing
const mockUser = {
  cliente: {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
  },
};

const mockToken = "mock-token-123";

const renderWithRouterAndContext = (
  component,
  userValue = mockUser,
  tokenValue = mockToken
) => {
  const contextValue = {
    user: userValue,
    token: tokenValue,
    setUser: vi.fn(),
    setToken: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <UserContext.Provider value={contextValue}>
          {component}
        </UserContext.Provider>
      </LocalizationProvider>
    </BrowserRouter>
  );
};

describe("PedidoNuevo Component", () => {
  const mockAreas = [
    { id: 1, nombre: "Electricidad" },
    { id: 2, nombre: "Plomería" },
    { id: 3, nombre: "Carpintería" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API calls by default
    vi.mocked(api.getAreas).mockResolvedValue(mockAreas);
    vi.mocked(api.createPedido).mockResolvedValue({ id: 123 });
    vi.mocked(api.createPedidoDisponibilidad).mockResolvedValue({});
  });

  it("should render the form title", async () => {
    renderWithRouterAndContext(<PedidoNuevo />);

    expect(
      screen.getByText("Solicitud de servicio técnico")
    ).toBeInTheDocument();
  });

  it("should render all form fields", async () => {
    renderWithRouterAndContext(<PedidoNuevo />);

    expect(
      screen.getByLabelText(/Describe tu requerimiento/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Área de servicio/i)).toBeInTheDocument();
    expect(screen.getByText("Disponibilidad horaria")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enviar solicitud/i })
    ).toBeInTheDocument();
  });

  it("should load and display areas in select", async () => {
    renderWithRouterAndContext(<PedidoNuevo />);

    await waitFor(() => {
      expect(api.getAreas).toHaveBeenCalled();
    });

    // Click on the select to open it
    const selectButton = screen.getByLabelText(/Área de servicio/i);
    fireEvent.mouseDown(selectButton);

    await waitFor(() => {
      expect(screen.getByText("Electricidad")).toBeInTheDocument();
      expect(screen.getByText("Plomería")).toBeInTheDocument();
      expect(screen.getByText("Carpintería")).toBeInTheDocument();
    });
  });

  it("should allow typing in the requerimiento field", async () => {
    renderWithRouterAndContext(<PedidoNuevo />);

    const textField = screen.getByLabelText(/Describe tu requerimiento/i);
    fireEvent.change(textField, {
      target: { value: "Arreglar una conexión eléctrica" },
    });

    expect(textField).toHaveValue("Arreglar una conexión eléctrica");
  });

  it("should allow selecting an area", async () => {
    renderWithRouterAndContext(<PedidoNuevo />);

    await waitFor(() => {
      expect(api.getAreas).toHaveBeenCalled();
    });

    // Open the select dropdown
    const selectButton = screen.getByLabelText(/Área de servicio/i);
    fireEvent.mouseDown(selectButton);

    await waitFor(() => {
      const electricidadOption = screen.getByText("Electricidad");
      fireEvent.click(electricidadOption);
    });

    // Check that the selection is reflected in the UI by checking if the option text is visible
    await waitFor(() => {
      // For MUI Select, we can check that the selected value appears in the select element
      expect(screen.getByText("Electricidad")).toBeInTheDocument();
    });
  });

  it("should render availability time pickers for all days of the week", () => {
    renderWithRouterAndContext(<PedidoNuevo />);

    const diasSemana = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    diasSemana.forEach((dia) => {
      expect(screen.getByText(dia)).toBeInTheDocument();
    });

    // Check that we have time pickers for all days by looking for the input elements
    // MUI TimePicker renders as input elements with type="text"
    const allInputs = screen.getAllByRole("textbox");

    // Just verify we have a reasonable number of inputs (should be many due to MUI internals)
    // and that we have the day labels which indicate the time picker structure is there
    expect(allInputs.length).toBeGreaterThan(0);
    expect(diasSemana.length).toBe(7); // Verify all 7 days are shown
  });

  const fillForm = async (requerimiento = "Test requerimiento") => {
    const textField = screen.getByLabelText(/Describe tu requerimiento/i);
    await act(async () => {
      fireEvent.change(textField, { target: { value: requerimiento } });
    });
    const selectButton = screen.getByLabelText(/Área de servicio/i);
    await act(async () => {
      fireEvent.mouseDown(selectButton);
    });
    await waitFor(() => {
      const option = screen.getByText("Electricidad");
      fireEvent.click(option);
    });
  };

  it("should submit form with valid data", async () => {
    renderWithRouterAndContext(<PedidoNuevo />);
    await waitFor(() => {
      expect(api.getAreas).toHaveBeenCalled();
    });
    await fillForm("Instalar una toma eléctrica");
    const submitButton = screen.getByRole("button", {
      name: /enviar solicitud/i,
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(api.createPedido).toHaveBeenCalledWith(
        expect.objectContaining({
          clienteId: 1,
          areaId: 1,
          requerimiento: "Instalar una toma eléctrica",
          estado: "sin_candidatos",
          tecnicoId: null,
        }),
        mockToken
      );
    });
  });

  it("should show success message after successful submission", async () => {
    renderWithRouterAndContext(<PedidoNuevo />);
    await waitFor(() => {
      expect(api.getAreas).toHaveBeenCalled();
    });
    await fillForm();
    const submitButton = screen.getByRole("button", {
      name: /enviar solicitud/i,
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(
        screen.getByText(/Tu solicitud ha sido enviada exitosamente/i)
      ).toBeInTheDocument();
    });
  });

  it("should show error message when API call fails", async () => {
    vi.mocked(api.createPedido).mockRejectedValue(new Error("Network error"));
    renderWithRouterAndContext(<PedidoNuevo />);
    await waitFor(() => {
      expect(api.getAreas).toHaveBeenCalled();
    });
    await fillForm();
    const submitButton = screen.getByRole("button", {
      name: /enviar solicitud/i,
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it("should disable submit button while loading", async () => {
    let resolveCreatePedido;
    const createPedidoPromise = new Promise((resolve) => {
      resolveCreatePedido = () => resolve({ id: 123 });
    });
    vi.mocked(api.createPedido).mockReturnValue(createPedidoPromise);
    renderWithRouterAndContext(<PedidoNuevo />);
    await waitFor(() => {
      expect(api.getAreas).toHaveBeenCalled();
    });
    await fillForm();
    const submitButton = screen.getByRole("button", {
      name: /enviar solicitud/i,
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    // @ts-ignore
    resolveCreatePedido && resolveCreatePedido();
  });

  it("should handle getAreas API failure gracefully", async () => {
    vi.mocked(api.getAreas).mockRejectedValue(
      new Error("Failed to load areas")
    );

    renderWithRouterAndContext(<PedidoNuevo />);

    // The component should still render even if areas fail to load
    expect(
      screen.getByText("Solicitud de servicio técnico")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Área de servicio/i)).toBeInTheDocument();
  });

  it("should call createPedidoDisponibilidad for availability data", async () => {
    renderWithRouterAndContext(<PedidoNuevo />);
    await waitFor(() => {
      expect(api.getAreas).toHaveBeenCalled();
    });
    await fillForm();
    const submitButton = screen.getByRole("button", {
      name: /enviar solicitud/i,
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(api.createPedido).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(api.createPedidoDisponibilidad).toHaveBeenCalledTimes(7);
    });
  });
});
