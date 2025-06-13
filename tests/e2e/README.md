# Tests E2E con Playwright

Este directorio contiene los tests end-to-end (E2E) para la aplicación Asistec, utilizando Playwright.

## Estructura

- `smoke.spec.js` - Tests básicos para verificar que la aplicación carga correctamente
- `home.spec.js` - Tests específicos para la página de inicio y navegación

## Comandos disponibles

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests con interfaz visual
npm run test:e2e:ui

# Ejecutar tests en modo debug
npm run test:e2e:debug

# Ejecutar tests con navegador visible
npm run test:e2e:headed

# Ver el reporte de tests
npm run test:report
```

## Ejecución por navegador

```bash
# Solo Chrome/Chromium
npm run test:e2e -- --project=chromium

# Solo Firefox
npm run test:e2e -- --project=firefox

# Solo Safari/WebKit
npm run test:e2e -- --project=webkit
```

## Ejecución de archivos específicos

```bash
# Ejecutar solo tests de la página de inicio
npm run test:e2e tests/e2e/home.spec.js

# Ejecutar solo tests de smoke
npm run test:e2e tests/e2e/smoke.spec.js
```

## Configuración

La configuración de Playwright se encuentra en `playwright.config.js` en la raíz del proyecto.

- **Puerto de desarrollo**: 5173 (Vite dev server)
- **Navegadores configurados**: Chromium, Firefox, WebKit
- **Reportes**: HTML (se abre automáticamente después de ejecutar)

## Buenas prácticas

1. **Selectores estables**: Usar `data-testid` cuando sea posible
2. **Assertions claras**: Usar expects específicos y descriptivos
3. **Tests independientes**: Cada test debe poder ejecutarse de forma aislada
4. **Cleanup**: Limpiar datos de test si es necesario
5. **Timeouts apropiados**: Ajustar timeouts según la necesidad del test
