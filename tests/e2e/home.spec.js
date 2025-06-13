import { test, expect } from "@playwright/test";

test("home page loads correctly", async ({ page }) => {
  await page.goto("/");

  // Verificar que el título principal esté presente
  await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();

  // Verificar que los botones de registro estén presentes
  await expect(page.getByText("Registrarme como cliente")).toBeVisible();
  await expect(page.getByText("Registrarme como técnico")).toBeVisible();
  await expect(page.getByText("Iniciar sesión")).toBeVisible();
});

test("navigation to client registration works", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();
  const clientButton = page.getByRole("button", {
    name: /Registrarme como cliente/i,
  });
  await expect(clientButton).toBeVisible();
  await page.waitForTimeout(100);
  if (browserName === "webkit") {
    await clientButton.click({ force: true });
  } else {
    await clientButton.click();
  }
  await expect(page).toHaveURL("/register/cliente");
});

test("navigation to technician registration works", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();
  const techButton = page.getByRole("button", {
    name: /Registrarme como técnico/i,
  });
  await expect(techButton).toBeVisible();
  await page.waitForTimeout(100);
  if (browserName === "webkit") {
    await techButton.click({ force: true });
  } else {
    await techButton.click();
  }
  await expect(page).toHaveURL("/register/tecnico");
});

test("navigation to login works", async ({ page, browserName }) => {
  await page.goto("/");
  await expect(page.getByText("Bienvenido a Asistec")).toBeVisible();
  const loginButton = page.getByRole("button", { name: /Iniciar sesión/i });
  await expect(loginButton).toBeVisible();
  await page.waitForTimeout(100);
  if (browserName === "webkit") {
    await loginButton.click({ force: true });
  } else {
    await loginButton.click();
  }
  await expect(page).toHaveURL("/login");
});
