// @vitest-environment jsdom

import { test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

import FormularioLogin from "../componentes/organismos/FormularioLogin";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("FormularioLogin muestra un error cuando el correo tiene un formato inválido", () => {
  const onIniciarSesion = vi.fn().mockResolvedValue({
    run: "556677889",
    nombre: "Ana",
    apellidos: "Martínez Díaz",
    email: "usuario@demo.cl",
    region: "Metropolitana de Santiago",
    comuna: "Ñuñoa",
    direccion: "Avenida Siempre Viva 123",
    rol: "Cliente" as const,
    estado: "Activo" as const,
  });

  vi.spyOn(window, "alert").mockImplementation(() => {});

  const { container } = render(
    <MemoryRouter>
      <FormularioLogin onIniciarSesion={onIniciarSesion} />
    </MemoryRouter>,
  );

  const campoCorreo = container.querySelector('input[name="correo"]') as HTMLInputElement;
  const campoClave = container.querySelector('input[name="clave"]') as HTMLInputElement;

  fireEvent.change(campoCorreo, { target: { value: "correo-invalido" } });
  fireEvent.change(campoClave, { target: { value: "ClaveSegura123" } });
  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

  expect(window.alert).toHaveBeenCalledWith(
    "El correo no tiene un formato válido. Ejemplo: nombre@correo.cl",
  );
  expect(onIniciarSesion).not.toHaveBeenCalled();
});
