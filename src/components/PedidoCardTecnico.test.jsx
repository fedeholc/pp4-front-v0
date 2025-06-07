import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
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
  cliente: {
    nombre: "Juan",
    apellido: "Pérez",
  },
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
    expect(screen.getByText(/Pérez, Juan/)).toBeInTheDocument();
    expect(screen.getByText(/No calificado/)).toBeInTheDocument();
    expect(screen.getByText(/No hay comentario/)).toBeInTheDocument();
    expect(screen.getByText(/No hay respuesta/)).toBeInTheDocument();
  });

  it("muestra el botón de responder si displayButtons es true", () => {
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoBase} displayButtons={true} />
    );
    expect(
      screen.getByRole("button", { name: /Responder Calificación/i })
    ).toBeInTheDocument();
  });

  it("no muestra botones si displayButtons es false", () => {
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoBase} displayButtons={false} />
    );
    expect(
      screen.queryByRole("button", { name: /Responder Calificación/i })
    ).not.toBeInTheDocument();
  });

  it("deshabilita el botón de responder si no hay calificación", () => {
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoBase} displayButtons={true} />
    );
    expect(
      screen.getByRole("button", { name: /Responder Calificación/i })
    ).toBeDisabled();
  });

  it("deshabilita el botón de responder si ya hay respuesta", () => {
    const pedidoConRespuesta = {
      ...pedidoBase,
      calificacion: 5,
      comentario: "Excelente trabajo",
      respuesta: "Gracias por la calificación",
    };
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoConRespuesta} displayButtons={true} />
    );
    expect(
      screen.getByRole("button", { name: /Responder Calificación/i })
    ).toBeDisabled();
  });

  it("habilita el botón de responder si hay calificación pero no hay respuesta", () => {
    const pedidoCalificado = {
      ...pedidoBase,
      calificacion: 4,
      comentario: "Buen trabajo",
      respuesta: null,
    };
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoCalificado} displayButtons={true} />
    );
    expect(
      screen.getByRole("button", { name: /Responder Calificación/i })
    ).not.toBeDisabled();
  });

  it("muestra formulario de respuesta al hacer click en el botón", () => {
    const pedidoCalificado = {
      ...pedidoBase,
      calificacion: 4,
      comentario: "Buen trabajo",
      respuesta: null,
    };
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoCalificado} displayButtons={true} />
    );

    const responderBtn = screen.getByRole("button", {
      name: /Responder Calificación/i,
    });
    fireEvent.click(responderBtn);

    expect(
      screen.getByText(/Responder al Comentario del Cliente/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Escribe tu respuesta al cliente/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Guardar Respuesta/i })
    ).toBeInTheDocument();
    // Use getAllByRole to get both cancel buttons and check for the form one
    const cancelButtons = screen.getAllByRole("button", { name: /Cancelar/i });
    expect(cancelButtons.length).toBe(2); // Main button + form button
  });
  it("oculta formulario al hacer click en cancelar", async () => {
    const pedidoCalificado = {
      ...pedidoBase,
      calificacion: 4,
      comentario: "Buen trabajo",
      respuesta: null,
    };
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoCalificado} displayButtons={true} />
    );

    // Abrir formulario
    const responderBtn = screen.getByRole("button", {
      name: /Responder Calificación/i,
    });
    fireEvent.click(responderBtn);

    // Verify form is open
    expect(
      screen.getByText(/Responder al Comentario del Cliente/i)
    ).toBeInTheDocument();

    // Click the outlined cancel button inside the form (not the main toggle button)
    const cancelButtons = screen.getAllByRole("button", { name: /Cancelar/i });
    // The outlined cancel button is the second one (index 1)
    const formCancelBtn = cancelButtons.find((button) =>
      button.className.includes("MuiButton-outlined")
    );

    await act(async () => {
      fireEvent.click(formCancelBtn);
    });

    // Wait for the collapse animation to complete
    await waitForElementToBeRemoved(() =>
      screen.queryByText(/Responder al Comentario del Cliente/i)
    );

    expect(
      screen.queryByText(/Responder al Comentario del Cliente/i)
    ).not.toBeInTheDocument();
  });

  it("deshabilita el botón guardar cuando el texto está vacío", async () => {
    const pedidoCalificado = {
      ...pedidoBase,
      calificacion: 4,
      comentario: "Buen trabajo",
      respuesta: null,
    };
    renderWithContext(
      <PedidoCardTecnico pedido={pedidoCalificado} displayButtons={true} />
    );

    // Abrir formulario
    const responderBtn = screen.getByRole("button", {
      name: /Responder Calificación/i,
    });
    fireEvent.click(responderBtn);

    // The save button should be disabled when text is empty
    const guardarBtn = screen.getByRole("button", {
      name: /Guardar Respuesta/i,
    });

    expect(guardarBtn).toBeDisabled();

    // Add some text to enable the button
    const textField = screen.getByPlaceholderText(/Escribe tu respuesta/i);
    fireEvent.change(textField, { target: { value: "Una respuesta válida" } });

    expect(guardarBtn).toBeEnabled();

    // Clear the text - button should be disabled again
    fireEvent.change(textField, { target: { value: "" } });

    expect(guardarBtn).toBeDisabled();

    // Add only whitespace - button should still be disabled
    fireEvent.change(textField, { target: { value: "   " } });

    expect(guardarBtn).toBeDisabled();
  });

  it("guarda respuesta exitosamente", async () => {
    const pedidoCalificado = {
      ...pedidoBase,
      calificacion: 4,
      comentario: "Buen trabajo",
      respuesta: null,
    };

    vi.spyOn(api, "updatePedido").mockResolvedValue({
      ...pedidoCalificado,
      respuesta: "Gracias por tu comentario",
    });

    renderWithContext(
      <PedidoCardTecnico pedido={pedidoCalificado} displayButtons={true} />
    );

    // Abrir formulario
    const responderBtn = screen.getByRole("button", {
      name: /Responder Calificación/i,
    });
    fireEvent.click(responderBtn);

    // Escribir respuesta
    const textField = screen.getByPlaceholderText(
      /Escribe tu respuesta al cliente/i
    );
    fireEvent.change(textField, {
      target: { value: "Gracias por tu comentario" },
    });

    // Guardar
    const guardarBtn = screen.getByRole("button", {
      name: /Guardar Respuesta/i,
    });
    await act(async () => {
      fireEvent.click(guardarBtn);
    });

    expect(api.updatePedido).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        respuesta: "Gracias por tu comentario",
      }),
      "tok"
    );
    expect(
      await screen.findByText(/Respuesta guardada con éxito/i)
    ).toBeInTheDocument();
  });

  it("muestra error si falla al guardar respuesta", async () => {
    const pedidoCalificado = {
      ...pedidoBase,
      calificacion: 4,
      comentario: "Buen trabajo",
      respuesta: null,
    };

    vi.spyOn(api, "updatePedido").mockRejectedValue(new Error("Network error"));

    renderWithContext(
      <PedidoCardTecnico pedido={pedidoCalificado} displayButtons={true} />
    );

    // Abrir formulario
    const responderBtn = screen.getByRole("button", {
      name: /Responder Calificación/i,
    });
    fireEvent.click(responderBtn);

    // Escribir respuesta
    const textField = screen.getByPlaceholderText(
      /Escribe tu respuesta al cliente/i
    );
    fireEvent.change(textField, {
      target: { value: "Gracias por tu comentario" },
    });

    // Guardar
    const guardarBtn = screen.getByRole("button", {
      name: /Guardar Respuesta/i,
    });
    await act(async () => {
      fireEvent.click(guardarBtn);
    });

    expect(
      await screen.findByText(/Error al guardar la respuesta/i)
    ).toBeInTheDocument();
  });

  it("muestra disponibilidad cuando se expande", () => {
    const pedidoConDisponibilidad = {
      ...pedidoBase,
      disponibilidad: [
        { dia: "lunes", horaInicio: "09:00", horaFin: "17:00" },
        { dia: "martes", horaInicio: "10:00", horaFin: "18:00" },
      ],
    };

    renderWithContext(
      <PedidoCardTecnico
        // @ts-ignore
        pedido={pedidoConDisponibilidad}
        displayButtons={false}
      />
    );

    // Expandir disponibilidad
    const expandBtn = screen.getByLabelText(/Ver disponibilidad/i);
    fireEvent.click(expandBtn);

    expect(screen.getByText(/lunes de 09:00 a 17:00/)).toBeInTheDocument();
    expect(screen.getByText(/martes de 10:00 a 18:00/)).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay disponibilidad", () => {
    const pedidoSinDisponibilidad = {
      ...pedidoBase,
      disponibilidad: [],
    };

    renderWithContext(
      <PedidoCardTecnico
        pedido={pedidoSinDisponibilidad}
        displayButtons={false}
      />
    );

    // Expandir disponibilidad
    const expandBtn = screen.getByLabelText(/Ver disponibilidad/i);
    fireEvent.click(expandBtn);

    expect(
      screen.getByText(/No hay disponibilidad registrada/i)
    ).toBeInTheDocument();
  });

  it("deshabilita guardar respuesta cuando ya existe una", async () => {
    const pedidoConRespuesta = {
      ...pedidoBase,
      calificacion: 5,
      comentario: "Excelente trabajo",
      respuesta: "Gracias por la calificación",
    };

    renderWithContext(
      <PedidoCardTecnico pedido={pedidoConRespuesta} displayButtons={true} />
    );

    // El botón principal debe estar deshabilitado
    expect(
      screen.getByRole("button", { name: /Responder Calificación/i })
    ).toBeDisabled();
  });

  it("retorna null si no hay pedido", () => {
    const { container } = renderWithContext(
      <PedidoCardTecnico pedido={null} displayButtons={true} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("muestra el estado del pedido correctamente", () => {
    const pedidoFinalizado = {
      ...pedidoBase,
      estado: PedidoEstadoEnum.Enum.finalizado,
    };

    renderWithContext(
      <PedidoCardTecnico pedido={pedidoFinalizado} displayButtons={false} />
    );

    expect(screen.getByText(/Finalizado/)).toBeInTheDocument();
  });
});
