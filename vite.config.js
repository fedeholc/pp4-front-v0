import { defineConfig } from "vite";
import path from "path"; // Importa el módulo 'path' de Node.js
import { fileURLToPath } from "url"; // Importa el módulo 'url' de Node.js
//import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxInject: `import React from 'react'`,
  },
  assetsInclude: ["**/*.ttf", "**/*.woff", "**/*.woff2"],
  resolve: {
    alias: {
      // Define tus aliases aquí
      "@src": path.resolve(__dirname, "./src"), // Alias para la carpeta 'src'
    },
  },
});
