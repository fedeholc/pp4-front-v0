import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { UserProvider } from "../contexts/UserProvider";
import { Layout } from "../components/Layout";

// Helper function para renderizar componentes con contexto
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <UserProvider>{component}</UserProvider>
    </BrowserRouter>
  );
};

describe("Layout Component", () => {
  it("should render without crashing", () => {
    expect(() => {
      renderWithProviders(
        <Layout>
          <div>Test content</div>
        </Layout>
      );
    }).not.toThrow();
  });

  it("should render child content", () => {
    renderWithProviders(
      <Layout>
        <div data-testid="test-content">Test content</div>
      </Layout>
    );

    // Verifica que el contenido hijo se renderice
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });
});
