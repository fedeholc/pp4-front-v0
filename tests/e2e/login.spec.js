import { test, expect } from "@playwright/test";

test("Login Cliente", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - heading "Bienvenido a Asistec" [level=3]
    - img
    - heading "Solicitá servicios técnicos de manera rápida, segura y profesional. Elige tu rol para comenzar:" [level=6]
    - button "Registrarme como cliente"
    - button "Registrarme como técnico"
    - button "Iniciar sesión"
    `);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("cliente@test.com");
  await page.getByRole("textbox", { name: "Email" }).press("Tab");
  await page.getByRole("textbox", { name: "Contraseña" }).fill("1234");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(
    page.getByRole("heading", { name: "Menú Principal" })
  ).toBeVisible();
});
