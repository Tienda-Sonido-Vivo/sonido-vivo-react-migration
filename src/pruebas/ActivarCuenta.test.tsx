// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";

import ActivarCuenta from "../paginas/ActivarCuenta";
import { completarActivacion } from "../servicios/authServicio";

vi.mock("../servicios/authServicio", () => ({
  completarActivacion: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("prepara el token desde la URL y activa la cuenta", async () => {
  vi.mocked(completarActivacion).mockResolvedValue();

  const { container } = render(
    <MemoryRouter initialEntries={["/activar-cuenta?token=token-prueba"]}>
      <ActivarCuenta />
    </MemoryRouter>,
  );

  const token = container.querySelector(
    'input[name="token"]',
  ) as HTMLInputElement;
  const nuevaClave = container.querySelector(
    'input[name="nuevaClave"]',
  ) as HTMLInputElement;
  const confirmarClave = container.querySelector(
    'input[name="confirmarClave"]',
  ) as HTMLInputElement;

  expect(token.value).toBe("token-prueba");

  fireEvent.change(nuevaClave, { target: { value: "1234" } });
  fireEvent.change(confirmarClave, { target: { value: "1234" } });
  fireEvent.click(screen.getByRole("button", { name: "Activar cuenta" }));

  await waitFor(() => {
    expect(completarActivacion).toHaveBeenCalledWith(
      "token-prueba",
      "1234",
    );
  });

  expect(
    await screen.findByText("Cuenta activada correctamente."),
  ).toBeInTheDocument();
});
