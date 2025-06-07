import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { PedidoCardCliente } from "./PedidoCardCliente";
import { UserContext } from "../contexts/UserContext";
import { PedidoEstadoEnum } from "../../types/schemas";

// Mock api
vi.mock("../api", () => ({
  updatePedido: vi.fn(),
}));
import * as api from "../api";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const pedidoBase = {
  id: 1,
  estado: PedidoEstadoEnum.Enum.sin_candidatos,
  fechaCreacion: new Date(),
  area: { nombre: "Electricidad" },
  requerimiento: "Reparar enchufe",
  disponibilidad: [],
  candidatos: [],
  tecnico: null,
  tecnicoId: null,
  calificacion: null,
  comentario: null,
  respuesta: null,
};

const renderWithContext = (ui, ctx = {}) => {
  const contextValue = {
    user: null,
    token: "tok",
    setUser: vi.fn(),
    setToken: vi.fn(),
    logout: vi.fn(),
    ...ctx,
  };
  return render(
    <BrowserRouter>
      <UserContext.Provider value={contextValue}>{ui}</UserContext.Provider>
    </BrowserRouter>
  );
};

describe("PedidoCardCliente", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza datos básicos del pedido", () => {
    renderWithContext(
      <PedidoCardCliente pedido={pedidoBase} displayButtons={false} />
    );
    expect(screen.getByText(/Pedido #1/)).toBeInTheDocument();
    expect(screen.getByText(/Electricidad/)).toBeInTheDocument();
    expect(screen.getByText(/Reparar enchufe/)).toBeInTheDocument();
    expect(screen.getByText(/No asignado/)).toBeInTheDocument();
  });

  it("muestra los botones si displayButtons es true", () => {
    renderWithContext(
      <PedidoCardCliente pedido={pedidoBase} displayButtons={true} />
    );
    expect(
      screen.getByRole("button", { name: /Ver Candidatos/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Calificar Técnico/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cancelar Pedido/i })
    ).toBeInTheDocument();
  });

  it("navega al ver candidatos", () => {
    // Usar un pedido con estado y candidatos válidos para habilitar el botón
    const pedido = {
      ...pedidoBase,
      estado: PedidoEstadoEnum.Enum.con_candidatos,
      candidatos: [{ id: 10, nombre: "Tec" }],
    };
    renderWithContext(
      <PedidoCardCliente pedido={pedido} displayButtons={true} />
    );
    const btn = screen.getByRole("button", { name: /Ver Candidatos/i });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/cliente/pedidos/1/candidatos");
  });

  it("deshabilita el botón de cancelar si no corresponde", () => {
    renderWithContext(
      <PedidoCardCliente
        pedido={{ ...pedidoBase, estado: PedidoEstadoEnum.Enum.finalizado }}
        displayButtons={true}
      />
    );
    expect(
      screen.getByRole("button", { name: /Cancelar Pedido/i })
    ).toBeDisabled();
  });

  it("cancela el pedido y muestra mensaje de éxito", async () => {
    vi.spyOn(api, "updatePedido").mockResolvedValue({
      ...pedidoBase,
      estado: PedidoEstadoEnum.Enum.cancelado,
    });
    renderWithContext(
      <PedidoCardCliente pedido={pedidoBase} displayButtons={true} />
    );
    const btn = screen.getByRole("button", { name: /Cancelar Pedido/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(api.updatePedido).toHaveBeenCalled();
    expect(
      await screen.findByText(/Pedido cancelado con éxito/i)
    ).toBeInTheDocument();
  });

  it("muestra error si falla cancelar el pedido", async () => {
    vi.spyOn(api, "updatePedido").mockRejectedValue(new Error("fail"));
    renderWithContext(
      <PedidoCardCliente pedido={pedidoBase} displayButtons={true} />
    );
    const btn = screen.getByRole("button", { name: /Cancelar Pedido/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(
      await screen.findByText(/Error al cancelar el pedido/i)
    ).toBeInTheDocument();
  });

  it("permite calificar técnico si corresponde", async () => {
    const pedido = {
      ...pedidoBase,
      tecnico: { nombre: "Juan", apellido: "Pérez", telefono: "123" },
      tecnicoId: 2,
      calificacion: null,
      estado: PedidoEstadoEnum.Enum.finalizado,
    };
    vi.spyOn(api, "updatePedido").mockResolvedValue({
      ...pedido,
      calificacion: 5,
    });
    renderWithContext(
      <PedidoCardCliente pedido={pedido} displayButtons={true} />
    );
    const calificarBtn = screen.getByRole("button", {
      name: /Calificar Técnico/i,
    });
    fireEvent.click(calificarBtn);
    // Seleccionar calificación
    const stars = screen.getAllByRole("radio");
    fireEvent.click(stars[4]); // 5 estrellas
    const guardarBtn = screen.getByRole("button", {
      name: /Guardar Calificación/i,
    });
    await act(async () => {
      fireEvent.click(guardarBtn);
    });
    expect(api.updatePedido).toHaveBeenCalled();
    expect(
      await screen.findByText(/Calificación guardada con éxito/i)
    ).toBeInTheDocument();
  });

  it("muestra error si no se selecciona calificación", async () => {
    const pedido = {
      ...pedidoBase,
      tecnico: { nombre: "Juan", apellido: "Pérez", telefono: "123" },
      tecnicoId: 2,
      calificacion: null,
      estado: PedidoEstadoEnum.Enum.finalizado,
    };
    renderWithContext(
      <PedidoCardCliente pedido={pedido} displayButtons={true} />
    );
    const calificarBtn = screen.getByRole("button", {
      name: /Calificar Técnico/i,
    });
    fireEvent.click(calificarBtn);
    const guardarBtn = screen.getByRole("button", {
      name: /Guardar Calificación/i,
    });
    await act(async () => {
      fireEvent.click(guardarBtn);
    });
    // Buscar el mensaje de error en el alert
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Por favor selecciona una calificación");
  });
});
