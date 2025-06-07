import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { PedidoCandidatos } from "./PedidoCandidatos";
import { UserContext } from "../../contexts/UserContext";

// Mock de la API
vi.mock("../../api", () => ({
  getPedidos: vi.fn(),
  updatePedido: vi.fn(),
}));

import * as api from "../../api";

const mockUser = {
  cliente: {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
  },
};
const mockToken = "mock-token-123";

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

describe("PedidoCandidatos Component", () => {
  const mockPedido = {
    id: 10,
    requerimiento: "Arreglar enchufe",
    estado: /** @type {"sin_candidatos"} */ ("sin_candidatos"), // string literal válido para el enum
    tecnicoId: null,
    area: { id: 1, nombre: "Electricidad" },
    candidatos: [
      {
        id: 101,
        nombre: "Carlos",
        apellido: "Gómez",
        telefono: "123456",
        calificaciones: [5, 4, 5],
        fechaRegistro: new Date(),
      },
      {
        id: 102,
        nombre: "Ana",
        apellido: "López",
        telefono: "654321",
        calificaciones: [4, 4],
        fechaRegistro: new Date(),
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getPedidos).mockResolvedValue([mockPedido]);
    vi.mocked(api.updatePedido).mockResolvedValue({
      ...mockPedido,
      estado: "tecnico_seleccionado",
      tecnicoId: 101,
    });
  });

  it("muestra el estado de carga", async () => {
    renderWithContext(<PedidoCandidatos />);
    expect(screen.getByText(/Cargando pedidos/i)).toBeInTheDocument();
    await waitFor(() => expect(api.getPedidos).toHaveBeenCalled());
  });

  it("muestra mensaje de error si no hay token", async () => {
    renderWithContext(<PedidoCandidatos />, mockUser, null);
    expect(
      await screen.findByText(/No estás autenticado/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje de error si la API falla", async () => {
    vi.mocked(api.getPedidos).mockRejectedValue(new Error("API error"));
    renderWithContext(<PedidoCandidatos />);
    expect(
      await screen.findByText(/Error al cargar los pedidos/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje si no hay datos del pedido", async () => {
    vi.mocked(api.getPedidos).mockResolvedValue([]);
    renderWithContext(<PedidoCandidatos />);
    expect(
      await screen.findByText(/No hay datos del pedido/i)
    ).toBeInTheDocument();
  });

  it("renderiza la información del pedido y los candidatos", async () => {
    renderWithContext(<PedidoCandidatos />);
    expect(await screen.findByText(/Arreglar enchufe/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Candidatos para el Pedido #10/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Carlos Gómez/i)).toBeInTheDocument();
    expect(screen.getByText(/Ana López/i)).toBeInTheDocument();
  });

  it("permite seleccionar un técnico y muestra feedback", async () => {
    renderWithContext(<PedidoCandidatos />);
    await screen.findByText(/Carlos Gómez/i);
    const selectBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.match(/Seleccionar/i));
    fireEvent.click(selectBtn);
    await waitFor(() => {
      expect(api.updatePedido).toHaveBeenCalled();
      expect(screen.getByText(/Técnico seleccionado/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Has seleccionado al técnico/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Carlos Gómez/i)).toBeInTheDocument();
    });
  });

  it("muestra error si falla la selección de técnico", async () => {
    vi.mocked(api.updatePedido).mockRejectedValue(
      new Error("Error al seleccionar")
    );
    renderWithContext(<PedidoCandidatos />);
    await screen.findByText(/Carlos Gómez/i);
    const selectBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.match(/Seleccionar/i));
    fireEvent.click(selectBtn);
    await waitFor(() => {
      expect(api.updatePedido).toHaveBeenCalled();
      expect(
        screen.getByText(/Error al cancelar el pedido/i)
      ).toBeInTheDocument();
    });
  });
});
