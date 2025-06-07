import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PedidoDisponibleCard } from "./PedidoDisponibleCard";
import { UserContext } from "../contexts/UserContext";
import { PedidoEstadoEnum } from "../../types/schemas";

// Mock api
vi.mock("../api", () => ({
  createPedidoCandidato: vi.fn(),
  updatePedido: vi.fn(),
}));
import * as api from "../api";

const pedidoBase = {
  id: 1,
  estado: PedidoEstadoEnum.Enum.sin_candidatos,
  fechaCreacion: new Date(),
  area: { nombre: "Electricidad" },
  requerimiento: "Reparar enchufe",
  disponibilidad: [{ dia: "lunes", horaInicio: "10:00", horaFin: "12:00" }],
  candidatos: [],
  cliente: { nombre: "Ana", apellido: "García" },
};

const user = { tecnico: { id: 99 } };

const renderWithContext = (ui, ctx = {}) => {
  const contextValue = {
    user,
    token: "tok",
    setUser: vi.fn(),
    setToken: vi.fn(),
    logout: vi.fn(),
    ...ctx,
  };
  return render(
    <UserContext.Provider value={contextValue}>{ui}</UserContext.Provider>
  );
};

describe("PedidoDisponibleCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza datos básicos del pedido", () => {
    renderWithContext(
      // @ts-ignore
      <PedidoDisponibleCard
        // @ts-ignore
        pedido={pedidoBase}
        displayButtons={false}
        setPedidos={vi.fn()}
      />
    );
    expect(screen.getByText(/Pedido #1/)).toBeInTheDocument();
    expect(screen.getByText(/Electricidad/)).toBeInTheDocument();
    expect(screen.getByText(/Reparar enchufe/)).toBeInTheDocument();
    expect(screen.getByText(/García, Ana/)).toBeInTheDocument();
  });

  it("muestra el botón Postularme si no está postulado", () => {
    renderWithContext(
      // @ts-ignore
      <PedidoDisponibleCard
        // @ts-ignore
        pedido={pedidoBase}
        displayButtons={true}
        setPedidos={vi.fn()}
      />
    );
    const btn = screen.getByRole("button", { name: /Postularme/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it("muestra el botón Ya estás postulado si ya es candidato", () => {
    const pedido = {
      ...pedidoBase,
      candidatos: [{ tecnicoId: user.tecnico.id }],
    };
    renderWithContext(
      // @ts-ignore
      <PedidoDisponibleCard
        // @ts-ignore
        pedido={pedido}
        displayButtons={true}
        setPedidos={vi.fn()}
      />
    );
    const btn = screen.getByRole("button", { name: /Ya estás postulado/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("postula correctamente y muestra mensaje de éxito", async () => {
    vi.spyOn(api, "createPedidoCandidato").mockResolvedValue({});
    vi.spyOn(api, "updatePedido").mockResolvedValue({});
    const setPedidos = vi.fn((fn) => fn([pedidoBase]));
    renderWithContext(
      // @ts-ignore
      <PedidoDisponibleCard
        // @ts-ignore
        pedido={pedidoBase}
        displayButtons={true}
        setPedidos={setPedidos}
      />
    );
    const btn = screen.getByRole("button", { name: /Postularme/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(api.createPedidoCandidato).toHaveBeenCalled();
    expect(api.updatePedido).toHaveBeenCalled();
    expect(
      await screen.findByText(/Postulación realizada con éxito/i)
    ).toBeInTheDocument();
  });

  it("muestra error si falla la postulación", async () => {
    vi.spyOn(api, "createPedidoCandidato").mockRejectedValue(new Error("fail"));
    const setPedidos = vi.fn();
    renderWithContext(
      // @ts-ignore
      <PedidoDisponibleCard
        // @ts-ignore
        pedido={pedidoBase}
        displayButtons={true}
        setPedidos={setPedidos}
      />
    );
    const btn = screen.getByRole("button", { name: /Postularme/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    const alert = await screen.findByText(/Error al postularse al pedido/i);
    expect(alert).toBeInTheDocument();
  });

  /* it("muestra la disponibilidad al expandir", () => {
    renderWithContext(
      // @ts-ignore
      <PedidoDisponibleCard
        // @ts-ignore
        pedido={pedidoBase}
        displayButtons={true}
        setPedidos={vi.fn()}
      />
    );
    const btn = screen.getByLabelText(/Ver disponibilidad/i);
    fireEvent.click(btn);
    expect(screen.getByText(/Lunes de 10:00 a 12:00/)).toBeInTheDocument();
  }); */
});
