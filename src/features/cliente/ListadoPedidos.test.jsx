import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { ListadoPedidos } from "./ListadoPedidos";
import { UserContext } from "../../contexts/UserContext";

vi.mock("../../api", () => ({
  getPedidos: vi.fn(),
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

describe("ListadoPedidos Component", () => {
  const mockPedidos = [
    {
      id: 1,
      requerimiento: "Reparar luz",
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
      cliente: {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        telefono: "",
        direccion: "",
        fechaRegistro: new Date(),
      },
      disponibilidad: [],
      clienteId: 1,
      areaId: 1,
    },
    {
      id: 2,
      requerimiento: "Arreglar canilla",
      estado: /** @type {"finalizado"} */ ("finalizado"),
      area: { id: 2, nombre: "Plomería" },
      tecnicoId: 5,
      fechaRegistro: new Date(),
      fechaCreacion: new Date(),
      candidatos: [],
      calificaciones: [5, 4],
      calificacion: 5,
      comentario: "Trabajo excelente",
      respuesta: "Gracias!",
      cliente: {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        telefono: "",
        direccion: "",
        fechaRegistro: new Date(),
      },
      disponibilidad: [],
      clienteId: 1,
      areaId: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getPedidos).mockResolvedValue(mockPedidos);
  });

  it("muestra el estado de carga", async () => {
    renderWithContext(<ListadoPedidos />);
    expect(screen.getByText(/Cargando pedidos/i)).toBeInTheDocument();
    await waitFor(() => expect(api.getPedidos).toHaveBeenCalled());
  });

  it("muestra mensaje de error si no hay token", async () => {
    renderWithContext(<ListadoPedidos />, mockUser, null);
    expect(
      await screen.findByText(/No estás autenticado/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje de error si la API falla", async () => {
    vi.mocked(api.getPedidos).mockRejectedValue(new Error("API error"));
    renderWithContext(<ListadoPedidos />);
    expect(
      await screen.findByText(/Error al cargar los pedidos/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje si no hay pedidos", async () => {
    vi.mocked(api.getPedidos).mockResolvedValue([]);
    renderWithContext(<ListadoPedidos />);
    expect(
      await screen.findByText(/No tienes pedidos realizados/i)
    ).toBeInTheDocument();
  });

  it("renderiza la lista de pedidos", async () => {
    renderWithContext(<ListadoPedidos />);
    expect(await screen.findByText(/Mis Pedidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Reparar luz/i)).toBeInTheDocument();
    expect(screen.getByText(/Arreglar canilla/i)).toBeInTheDocument();
  });

  it("filtra los pedidos por estado", async () => {
    renderWithContext(<ListadoPedidos />);
    await screen.findByText(/Reparar luz/i);
    const select = screen.getByLabelText(/Estado/i);
    await act(async () => {
      fireEvent.mouseDown(select);
    });
    // Buscar el MenuItem correcto (el de la lista desplegable, no el de la tarjeta)
    const finalizadoOptions = screen.getAllByText(/Finalizado/i);
    const menuOption = finalizadoOptions.find(
      (el) => el.getAttribute("role") === "option"
    );
    await act(async () => {
      fireEvent.click(menuOption || finalizadoOptions[0]);
    });
    // Solo debe aparecer el pedido finalizado
    expect(screen.queryByText(/Reparar luz/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Arreglar canilla/i)).toBeInTheDocument();
  });
});
