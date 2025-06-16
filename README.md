# Práctica profesionalizante IV: proyecto integrador <!-- omit in toc -->

## Trabajo Práctico Integrador <!-- omit in toc -->

### Equipo:

- **Federico Holc** (comisión B)
- **Iris Zamora** (comisión A)
- **Martín López** (comisión B)
- **Agustina Kopistinski** (comisión A)

### Repositorios:

- **Frontend**: [https://github.com/fedeholc/pp4-front-v0](https://github.com/fedeholc/pp4-front-v0)
- **Backend**: [https://github.com/fedeholc/pp4-backend-v0](https://github.com/fedeholc/pp4-backend-v0)

Una versión dockerizada y con deploy a AWS (realizada para el Seminario de Actualización dev ops) puede encontrarse en el siguiente repositorio:

- https://github.com/fedeholc/devops-tpi-infra/

En la documentación del mismo se explica cómo correr el proyecto con Docker. La explicación que sigue es para correr el proyecto sin Docker, de manera local.

## Cómo correr el frontend

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/fedeholc/pp4-front-v0.git
   ```

2. Entrar al directorio del proyecto:

   ```bash
   cd pp4-front-v0
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir el navegador en `http://localhost:5173` para ver la aplicación en acción.

## 🚀 Scripts disponibles

### Desarrollo

```bash
npm run dev          # Servidor de desarrollo (Vite)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

### Testing

#### Unit Tests (Vitest)

```bash
npm run test         # Tests en modo watch
npm run test:run     # Tests una sola vez
npm run test:ui      # Interface visual para tests
npm run coverage     # Reporte de cobertura
```

#### E2E Tests (Playwright)

```bash
npm run test:e2e           # Todos los tests E2E
npm run test:e2e:ui        # Interface visual de Playwright
npm run test:e2e:debug     # Debug de tests
npm run test:e2e:headed    # Tests con navegador visible
npm run test:report        # Ver reporte de Playwright
```

## 🧪 Estrategia de Testing

Este proyecto utiliza una estrategia de testing completa:

- **Unit Tests**: Vitest + Testing Library para componentes y lógica
- **E2E Tests**: Playwright para flujos completos de usuario
- **Coverage**: Reportes automáticos de cobertura de código

### Estructura de Tests

```
src/
├── **/*.test.jsx        # Unit tests junto a componentes
└── test/setup.js        # Configuración de Vitest

tests/
└── e2e/                 # Tests End-to-End
    ├── *.spec.js        # Tests de Playwright
    └── README.md        # Documentación de E2E tests
```

## 🛠️ Stack Tecnológico

- **React 19** - Framework frontend
- **Vite** - Build tool y dev server
- **Material-UI** - Componentes UI
- **React Router 7** - Enrutamiento
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **ESLint** - Linting

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── contexts/           # Contextos de React
├── features/           # Características por módulo
├── utils/              # Utilidades
└── assets/             # Recursos estáticos
```

## 🔧 Configuración

- **Vite**: `vite.config.js`
- **Vitest**: Configurado en `vite.config.js`
- **Playwright**: `playwright.config.js`
- **ESLint**: `eslint.config.js`
