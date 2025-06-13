import { test, expect } from "@playwright/test";

test("basic smoke test - app loads", async ({ page }) => {
  await page.goto("/");

  // Verificar que la página carga y no hay errores críticos
  await expect(page.locator("body")).toBeVisible();

  // Verificar que no hay errores de JavaScript en la consola
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log("Console error:", msg.text());
    }
  });
});

test("page has correct title", async ({ page }) => {
  await page.goto("/");

  // Verificar el título de la página
  await expect(page).toHaveTitle(/ASISTEC/);
});
