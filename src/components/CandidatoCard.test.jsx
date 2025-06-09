import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CandidatoCard } from "./CandidatoCard";
import { BrowserRouter } from "react-router";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const candidatoBase = {
  id: 5,
  nombre: "Juan",
  apellido: "Pérez",
  caracteristicas: "Rápido y prolijo",
  fechaRegistro: new Date("2024-01-01"),
  calificaciones: [4, 2, 4, 2],
};

describe("CandidatoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  it("renderiza datos básicos del candidato", () => {
    renderWithRouter(
      <CandidatoCard candidato={candidatoBase} onSelectTecnico={vi.fn()} />
    );
    expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
    expect(screen.getByText(/Rápido y prolijo/)).toBeInTheDocument();
    expect(screen.getByText(/Fecha de registro:/)).toBeInTheDocument();
    expect(screen.getByText("(4)")).toBeInTheDocument();
  });

  it("renderiza el botón VER PERFIL y SELECCIONAR", () => {
    renderWithRouter(
      <CandidatoCard candidato={candidatoBase} onSelectTecnico={vi.fn()} />
    );
    expect(
      screen.getByRole("button", { name: /ver perfil/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /seleccionar/i })
    ).toBeInTheDocument();
  });

  it("navega al perfil del técnico al hacer click en VER PERFIL", () => {
    renderWithRouter(
      <CandidatoCard candidato={candidatoBase} onSelectTecnico={vi.fn()} />
    );
    const btn = screen.getByRole("button", { name: /ver perfil/i });
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/tecnico/5/perfil");
  });

  it("llama a onSelectTecnico con el id correcto al hacer click en SELECCIONAR", () => {
    const onSelectTecnico = vi.fn();
    renderWithRouter(
      <CandidatoCard
        candidato={candidatoBase}
        onSelectTecnico={onSelectTecnico}
      />
    );
    const btn = screen.getByRole("button", { name: /seleccionar/i });
    fireEvent.click(btn);
    expect(onSelectTecnico).toHaveBeenCalledWith(5);
  });
});
