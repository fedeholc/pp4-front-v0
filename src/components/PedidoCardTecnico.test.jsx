import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { PedidoCardTecnico } from "./PedidoCardTecnico";
import { UserContext } from "../contexts/UserContext";
import { PedidoEstadoEnum } from "../../types/schemas";

// Mock api
vi.mock("../api", () => ({
  updatePedido: vi.fn(),
}));
import * as api from "../api";

const pedidoBase = {
  id: 1,
  estado: PedidoEstadoEnum.Enum.finalizado,
  fechaCreacion: new Date(),
  area: { nombre: "Electricidad" },
  requerimiento: "Reparar enchufe",
  disponibilidad: [],
  candidatos: [],
  tecnico: null,
  tecnicoId: null,
  calificacion: 5,
  comentario: "Buen trabajo",
  respuesta: null,
  cliente: { nombre: "Juan", apellido: "Pérez" },
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

describe("PedidoCardTecnico", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza datos básicos del pedido", () => {
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoBase} displayButtons={false} />
    );
    expect(screen.getByText(/Pedido #1/)).toBeInTheDocument();
    expect(screen.getByText(/Electricidad/)).toBeInTheDocument();
    expect(screen.getByText(/Reparar enchufe/)).toBeInTheDocument();
    expect(screen.getByText(/Juan/)).toBeInTheDocument();
    expect(screen.getByText(/Pérez/)).toBeInTheDocument();
    expect(screen.getByText(/Buen trabajo/)).toBeInTheDocument();
    expect(screen.getByText(/No hay respuesta/)).toBeInTheDocument();
  });

  it("muestra el botón de responder calificación solo si corresponde", () => {
    // Si ya hay respuesta, el botón debe estar deshabilitado
    const pedido = { ...pedidoBase, respuesta: "Gracias!" };
    renderWithContext(
      <PedidoCardTecnico pedido={pedido} displayButtons={true} />
    );
    const btn = screen.getByRole("button", { name: /Responder Calificación/i });
    expect(btn).toBeDisabled();
  });

  it("permite abrir y cerrar el formulario de respuesta", () => {
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoBase} displayButtons={true} />
    );
    const btn = screen.getByRole("button", { name: /Responder Calificación/i });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(
      screen.getByText(/Responder al Comentario del Cliente/i)
    ).toBeInTheDocument();
    // Cerrar: selecciona el segundo botón Cancelar (el del formulario)
    const cancelarBtns = screen.getAllByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelarBtns[1]);
    expect(
      screen.queryByText(/Responder al Comentario del Cliente/i)
    ).not.toBeInTheDocument();
  });

  it("muestra error si se intenta guardar sin respuesta", async () => {
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoBase} displayButtons={true} />
    );
    const btn = screen.getByRole("button", { name: /Responder Calificación/i });
    fireEvent.click(btn);
    const guardarBtn = screen.getByRole("button", {
      name: /Guardar Respuesta/i,
    });
    await act(async () => {
      fireEvent.click(guardarBtn);
    });
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Por favor ingresa una respuesta");
  });

  it("guarda la respuesta correctamente", async () => {
    vi.spyOn(api, "updatePedido").mockResolvedValue({
      ...pedidoBase,
      respuesta: "¡Gracias!",
    });
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoBase} displayButtons={true} />
    );
    const btn = screen.getByRole("button", { name: /Responder Calificación/i });
    fireEvent.click(btn);
    const textarea = screen.getByPlaceholderText(
      /Escribe tu respuesta al cliente/i
    );
    fireEvent.change(textarea, { target: { value: "¡Gracias!" } });
    const guardarBtn = screen.getByRole("button", {
      name: /Guardar Respuesta/i,
    });
    await act(async () => {
      fireEvent.click(guardarBtn);
    });
    expect(api.updatePedido).toHaveBeenCalled();
    expect(
      await screen.findByText(/Respuesta guardada con éxito/i)
    ).toBeInTheDocument();
  });

  it("muestra error si falla la API al guardar respuesta", async () => {
    vi.spyOn(api, "updatePedido").mockRejectedValue(new Error("fail"));
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoBase} displayButtons={true} />
    );
    const btn = screen.getByRole("button", { name: /Responder Calificación/i });
    fireEvent.click(btn);
    const textarea = screen.getByPlaceholderText(
      /Escribe tu respuesta al cliente/i
    );
    fireEvent.change(textarea, { target: { value: "¡Gracias!" } });
    const guardarBtn = screen.getByRole("button", {
      name: /Guardar Respuesta/i,
    });
    await act(async () => {
      fireEvent.click(guardarBtn);
    });
    expect(api.updatePedido).toHaveBeenCalled();
    expect(
      await screen.findByText(/Error al guardar la respuesta/i)
    ).toBeInTheDocument();
  });
});
