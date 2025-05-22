import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserProvider.jsx";
import "./vite-hmr.js"; // Importamos la configuración HMR

// Usamos StrictMode solo en producción para evitar recargas dobles en desarrollo
const isDevelopment = import.meta.env.DEV;

const root = createRoot(document.getElementById("root"));
root.render(
  isDevelopment ? (
    <UserProvider>
      <App />
    </UserProvider>
  ) : (
    <StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </StrictMode>
  )
);

// Configuración explícita para HMR
if (import.meta.hot) {
  import.meta.hot.accept();
}
