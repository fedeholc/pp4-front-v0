import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { PedidosDisponibles } from "./PedidosDisponibles";
import { UserContext } from "../../contexts/UserContext";

// Mock de la API
vi.mock("../../api", () => ({
  getPedidos: vi.fn(),
}));
import * as api from "../../api";

// Mock del componente hijo para simplificar
vi.mock("../../components/PedidoDisponibleCard", () => ({
  PedidoDisponibleCard: ({ pedido }) => (
    <div data-testid={`pedido-card-${pedido.id}`}>{pedido.requerimiento}</div>
  ),
}));

const mockUser = {
  tecnico: {
    id: 10,
    nombre: "Carlos",
    apellido: "Gómez",
    email: "carlos@example.com",
  },
};
const mockToken = "mock-token-tecnico";

const renderWithContext = (
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
      <UserContext.Provider value={contextValue}>
        {component}
      </UserContext.Provider>
    </BrowserRouter>
  );
};

describe("PedidosDisponibles Component", () => {
  const mockPedidos = [
    {
      id: 1,
      requerimiento: "Reparar enchufe",
      estado: /** @type {"sin_candidatos"} */ ("sin_candidatos"),
      area: { id: 1, nombre: "Electricidad" },
      tecnicoId: null,
      fechaRegistro: new Date(),
      fechaCreacion: new Date(),
      candidatos: [],
      calificaciones: [],
      calificacion: null,
      comentario: null,
      respuesta: null,
      cliente: null,
      disponibilidad: [],
      clienteId: 2,
      areaId: 1,
    },
    {
      id: 2,
      requerimiento: "Arreglar canilla",
      estado: /** @type {"con_candidatos"} */ ("con_candidatos"),
      area: { id: 2, nombre: "Plomería" },
      tecnicoId: null,
      fechaRegistro: new Date(),
      fechaCreacion: new Date(),
      candidatos: [],
      calificaciones: [],
      calificacion: null,
      comentario: null,
      respuesta: null,
      cliente: null,
      disponibilidad: [],
      clienteId: 3,
      areaId: 2,
    },
    {
      id: 3,
      requerimiento: "Instalar lámpara",
      estado: /** @type {"finalizado"} */ ("finalizado"),
      area: { id: 2, nombre: "Plomería" },
      tecnicoId: 10,
      fechaRegistro: new Date(),
      fechaCreacion: new Date(),
      candidatos: [],
      calificaciones: [],
      calificacion: 5,
      comentario: "Trabajo excelente",
      respuesta: "Gracias!",
      cliente: null,
      disponibilidad: [],
      clienteId: 4,
      areaId: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getPedidos).mockResolvedValue(mockPedidos);
  });

  it("muestra el estado de carga", async () => {
    renderWithContext(<PedidosDisponibles />);
    expect(screen.getByText(/Cargando pedidos/i)).toBeInTheDocument();
    await waitFor(() => expect(api.getPedidos).toHaveBeenCalled());
  });

  it("muestra mensaje de error si no hay token", async () => {
    renderWithContext(<PedidosDisponibles />, mockUser, null);
    expect(
      await screen.findByText(/No estás autenticado/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje de error si la API falla", async () => {
    vi.mocked(api.getPedidos).mockRejectedValue(new Error("API error"));
    renderWithContext(<PedidosDisponibles />);
    expect(
      await screen.findByText(/Error al cargar los pedidos/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje si no hay pedidos disponibles", async () => {
    vi.mocked(api.getPedidos).mockResolvedValue([]);
    renderWithContext(<PedidosDisponibles />);
    expect(
      await screen.findByText(/No tienes pedidos realizados/i)
    ).toBeInTheDocument();
  });

  it("renderiza solo los pedidos disponibles (sin_candidatos y con_candidatos)", async () => {
    renderWithContext(<PedidosDisponibles />);
    await screen.findByText(/Pedidos disponibles/i);
    // Deben aparecer los pedidos 1 y 2, pero no el 3
    expect(screen.getByTestId("pedido-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("pedido-card-2")).toBeInTheDocument();
    expect(screen.queryByTestId("pedido-card-3")).not.toBeInTheDocument();
  });
});
