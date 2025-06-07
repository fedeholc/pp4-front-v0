import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TecnicoFacturas } from "./TecnicoFacturas";
import * as api from "../../api";
import { UserContext } from "../../contexts/UserContext";

// Mock the API
vi.mock("../../api");

// Mock components that might cause issues in tests
vi.mock("../../components/Layout", () => ({
  Layout: ({ children }) => <div data-testid="layout">{children}</div>,
}));

// Helper function to render with context
const renderWithContext = (component, contextValue = {}) => {
  const defaultContext = {
    user: { id: 1, tecnico: { id: 1 } },
    token: "test-token",
    setUser: vi.fn(),
    setToken: vi.fn(),
    logout: vi.fn(),
    ...contextValue,
  };

  return render(
    <UserContext.Provider value={defaultContext}>
      {component}
    </UserContext.Provider>
  );
};

const mockFacturas = [
  {
    id: 1,
    usuarioId: 1,
    fecha: new Date("2025-05-15"),
    descripcion: "Cuota de membresía mensual",
    total: 10,
    metodoPago: /** @type {"tarjeta"} */ ("tarjeta"),
  },
  {
    id: 2,
    usuarioId: 1,
    fecha: null,
    descripcion: "Cuota de membresía mensual",
    total: 10,
    metodoPago: null,
  },
];

describe("TecnicoFacturas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly and shows loading state", () => {
    vi.mocked(api.getFacturas).mockImplementation(() => new Promise(() => {}));

    renderWithContext(<TecnicoFacturas />);

    expect(screen.getByText("Mis Facturas")).toBeInTheDocument();
    expect(screen.getByText("Cargando facturas...")).toBeInTheDocument();
    expect(
      screen.getByText(/Cuota de membresía: \$10\.00/)
    ).toBeInTheDocument();
  });

  it("displays error when not authenticated", async () => {
    renderWithContext(<TecnicoFacturas />, { token: null });

    await waitFor(() => {
      expect(screen.getByText(/No estás autenticado/)).toBeInTheDocument();
    });
  });

  it("displays facturas correctly", async () => {
    vi.mocked(api.getFacturas).mockResolvedValue(mockFacturas);

    renderWithContext(<TecnicoFacturas />);

    await waitFor(() => {
      expect(screen.getByText("Factura #1")).toBeInTheDocument();
      expect(screen.getByText("Factura #2")).toBeInTheDocument();
    });

    // Check paid invoice
    expect(screen.getByText("Pagada")).toBeInTheDocument();
    expect(screen.getByText("Tarjeta")).toBeInTheDocument();

    // Check pending invoice
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText("Pagar ahora")).toBeInTheDocument();
  });

  it("opens payment dialog when clicking pay button", async () => {
    vi.mocked(api.getFacturas).mockResolvedValue(mockFacturas);

    renderWithContext(<TecnicoFacturas />);

    await waitFor(() => {
      expect(screen.getByText("Pagar ahora")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Pagar ahora"));

    await waitFor(() => {
      expect(
        screen.getByText("Procesar Pago - Factura #2")
      ).toBeInTheDocument();
      expect(screen.getByText("Tarjeta de crédito/débito")).toBeInTheDocument();
      expect(screen.getByText("Transferencia bancaria")).toBeInTheDocument();
    });
  });

  it("processes payment successfully", async () => {
    vi.mocked(api.getFacturas)
      .mockResolvedValueOnce(mockFacturas)
      .mockResolvedValueOnce(mockFacturas); // Second call after payment
    vi.mocked(api.updateFactura).mockResolvedValue({});

    renderWithContext(<TecnicoFacturas />);

    await waitFor(() => {
      expect(screen.getByText("Pagar ahora")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Pagar ahora"));

    await waitFor(() => {
      expect(screen.getByText("Confirmar Pago")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Confirmar Pago"));

    await waitFor(
      () => {
        expect(api.updateFactura).toHaveBeenCalledWith(
          2,
          expect.objectContaining({
            metodoPago: "tarjeta",
          }),
          "test-token"
        );
      },
      { timeout: 3000 }
    );
  });

  it("creates new invoice successfully", async () => {
    vi.mocked(api.getFacturas)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]); // Second call after creation
    vi.mocked(api.createFactura).mockResolvedValue({});

    renderWithContext(<TecnicoFacturas />);

    await waitFor(() => {
      expect(screen.getByText("Nueva Factura")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Nueva Factura"));

    // Wait for payment dialog to open
    await waitFor(() => {
      expect(
        screen.getByText("Procesar Pago - Nueva Factura")
      ).toBeInTheDocument();
    });

    // Click confirm payment button
    fireEvent.click(screen.getByText("Confirmar Pago"));

    await waitFor(
      () => {
        expect(api.createFactura).toHaveBeenCalledWith(
          expect.objectContaining({
            usuarioId: 1,
            descripcion: "Cuota de membresía mensual",
            total: 10,
          }),
          "test-token"
        );
      },
      { timeout: 3000 }
    );
  });

  it("shows info message when no invoices exist", async () => {
    vi.mocked(api.getFacturas).mockResolvedValue([]);

    renderWithContext(<TecnicoFacturas />);

    await waitFor(() => {
      expect(screen.getByText(/No tienes facturas aún/)).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(api.getFacturas).mockRejectedValue(new Error("API Error"));

    renderWithContext(<TecnicoFacturas />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error al cargar las facturas/)
      ).toBeInTheDocument();
    });
  });

  it("changes payment method in dialog", async () => {
    vi.mocked(api.getFacturas).mockResolvedValue(mockFacturas);

    renderWithContext(<TecnicoFacturas />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Pagar ahora"));
    });

    await waitFor(() => {
      const transferRadio = screen.getByLabelText(/Transferencia bancaria/);
      fireEvent.click(transferRadio);
      expect(transferRadio).toBeChecked();
    });
  });

  it("disables payment dialog actions while processing", async () => {
    vi.mocked(api.getFacturas).mockResolvedValue(mockFacturas);
    vi.mocked(api.updateFactura).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithContext(<TecnicoFacturas />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Pagar ahora"));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText("Confirmar Pago"));
    });

    await waitFor(() => {
      expect(screen.getByText("Procesando...")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeDisabled();
    });
  });
});
