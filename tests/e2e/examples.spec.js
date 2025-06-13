import { test, expect } from "@playwright/test";

test.describe("Playwright Testing Examples", () => {
  test("Example: API testing with Playwright", async ({ request }) => {
    // Ejemplo de cómo probar APIs con Playwright
    // const response = await request.get('/api/health');
    // expect(response.status()).toBe(200);

    // Por ahora, solo verificamos que la función request esté disponible
    expect(request).toBeDefined();
  });

  test("Example: Taking screenshots", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();

    // Tomar screenshot de la página completa
    await page.screenshot({
      path: "test-results/homepage-full.png",
      fullPage: true,
    });

    // Tomar screenshot de un elemento específico
    const mainContent = page.locator("main");
    if ((await mainContent.count()) > 0) {
      await mainContent.screenshot({ path: "test-results/main-content.png" });
    }
  });

  test("Example: Testing forms and input", async ({ page }) => {
    await page.goto("/");

    // Si hubiera un formulario, así es como lo probarías:
    // await page.fill('[data-testid="email-input"]', 'test@example.com');
    // await page.fill('[data-testid="password-input"]', 'password123');
    // await page.click('[data-testid="submit-button"]');
    // await expect(page.getByText('Login successful')).toBeVisible();

    // Por ahora, solo verificamos que podemos interactuar con botones
    const clientButton = page.getByRole("button", {
      name: /Registrarme como cliente/i,
    });
    await expect(clientButton).toBeVisible();
  });

  test("Example: Network interception", async ({ page }) => {
    // Interceptar requests de red
    await page.route("**/api/**", (route) => {
      console.log("API call intercepted:", route.request().url());
      route.continue();
    });

    await page.goto("/");
    await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();
  });

  test("Example: Testing localStorage and sessionStorage", async ({ page }) => {
    await page.goto("/");

    // Establecer datos en localStorage
    await page.evaluate(() => {
      localStorage.setItem("test-key", "test-value");
      sessionStorage.setItem("session-key", "session-value");
    });

    // Verificar que los datos se guardaron
    const localStorageValue = await page.evaluate(() =>
      localStorage.getItem("test-key")
    );
    const sessionStorageValue = await page.evaluate(() =>
      sessionStorage.getItem("session-key")
    );

    expect(localStorageValue).toBe("test-value");
    expect(sessionStorageValue).toBe("session-value");
  });

  test("Example: Testing with different user agents", async ({ page }) => {
    // Simular un bot o crawler
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    });

    await page.goto("/");
    await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();
  });

  test("Example: Testing keyboard navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();

    // Navegar usando Tab para probar accesibilidad
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Verificar que el foco está en un elemento interactivo
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  //test.skip("Example: Testing file uploads", async ({ page }) => {
    // Este test está skippeado porque no tenemos un formulario de upload
    // await page.goto('/upload');
    // const fileInput = page.locator('input[type="file"]');
    // await fileInput.setInputFiles('path/to/test-file.jpg');
    // await page.click('[data-testid="upload-button"]');
    // await expect(page.getByText('File uploaded successfully')).toBeVisible();
  //});

  test("Example: Testing drag and drop", async ({ page }) => {
    await page.goto("/");

    // Ejemplo de drag and drop (si hubiera elementos draggables)
    // const source = page.locator('[data-testid="draggable-item"]');
    // const target = page.locator('[data-testid="drop-zone"]');
    // await source.dragTo(target);

    // Por ahora, solo verificamos que la página carga
    await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();
  });
});
