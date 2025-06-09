// Mock de useParams debe ir antes de cualquier import que use react-router
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => ({ id: "10" }),
  };
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { TecnicoPerfil } from "./TecnicoPerfil";
import { UserContext } from "../../contexts/UserContext";

// Mock de la API
vi.mock("../../api", () => ({
  getTecnico: vi.fn(),
}));
import * as api from "../../api";

const mockToken = "mock-token-tecnico";
const renderWithContext = (component, tokenValue = mockToken) => {
  const contextValue = {
    user: { tecnico: { id: 10 } },
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

describe("TecnicoPerfil Component", () => {
  // En los mocks de pedidos, aseguro que estado sea un string literal del enum
  const mockTecnico = {
    id: 10,
    nombre: "Carlos",
    apellido: "Gómez",
    telefono: "123456",
    direccion: "Calle Falsa 123",
    caracteristicas: "Especialista en electricidad y plomería",
    fechaRegistro: new Date(),
    areas: [
      { areaId: 1, nombre: "Electricidad" },
      { areaId: 2, nombre: "Plomería" },
    ],
    pedidos: [
      {
        id: 1,
        requerimiento: "Reparar enchufe",
        estado: /** @type {"finalizado"} */ ("finalizado"),
        areaNombre: "Electricidad",
        clienteNombre: "Juan",
        clienteApellido: "Pérez",
        fechaCreacion: new Date(),
        calificacion: 5,
        comentario: "Excelente trabajo!",
      },
      {
        id: 2,
        requerimiento: "Arreglar canilla",
        estado: /** @type {"calificado"} */ ("calificado"),
        areaNombre: "Plomería",
        clienteNombre: "Ana",
        clienteApellido: "López",
        fechaCreacion: new Date(),
        calificacion: 4,
        comentario: null,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getTecnico).mockResolvedValue(mockTecnico);
  });

  it("muestra el estado de carga", async () => {
    renderWithContext(<TecnicoPerfil />);
    expect(
      screen.getByText(/Cargando perfil del técnico/i)
    ).toBeInTheDocument();
    await waitFor(() => expect(api.getTecnico).toHaveBeenCalled());
  });

  it("muestra mensaje de error si no hay token o id", async () => {
    // Sin token
    renderWithContext(<TecnicoPerfil />, null);
    expect(
      await screen.findByText(/No se pudo cargar el perfil del técnico/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje de error si la API falla", async () => {
    vi.mocked(api.getTecnico).mockRejectedValue(new Error("API error"));
    renderWithContext(<TecnicoPerfil />);
    expect(
      await screen.findByText(/Error al cargar el perfil del técnico/i)
    ).toBeInTheDocument();
  });

  it("renderiza el perfil del técnico with datos completos", async () => {
    renderWithContext(<TecnicoPerfil />);
    // Use role-based query for heading
    const heading = await screen.findByRole("heading", { name: /perfil/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(/Carlos Gómez/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Especialista en electricidad y plomería/i)
    ).toBeInTheDocument();
    // Use getAllByText for repeated area names
    expect(screen.getAllByText(/Electricidad/i).length).toBeGreaterThanOrEqual(
      2
    );
    expect(screen.getAllByText(/Plomería/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Reparar enchufe/i)).toBeInTheDocument();
    expect(screen.getByText(/Arreglar canilla/i)).toBeInTheDocument();
    expect(screen.getByText(/Excelente trabajo!/i)).toBeInTheDocument();
    expect(screen.getByText(/Basado en 2 calificaciones/i)).toBeInTheDocument();
  });

  it("muestra mensaje si el técnico no tiene trabajos realizados", async () => {
    vi.mocked(api.getTecnico).mockResolvedValue({
      ...mockTecnico,
      pedidos: [],
    });
    renderWithContext(<TecnicoPerfil />);
    expect(
      await screen.findByText(/Este técnico aún no tiene trabajos realizados/i)
    ).toBeInTheDocument();
  });
});
