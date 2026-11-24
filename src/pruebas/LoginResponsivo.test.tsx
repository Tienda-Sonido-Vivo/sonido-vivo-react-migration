// @vitest-environment jsdom

import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

import Login from "../paginas/Login";

test("la página Login contiene las clases responsive de Bootstrap", () => {
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

  render(
    <MemoryRouter>
      <Login onIniciarSesion={onIniciarSesion} />
    </MemoryRouter>,
  );

  const titulo = screen.getByRole("heading", {
    name: "Iniciar Sesión",
  });

  const columna = titulo.closest(".col-12");

  expect(columna).not.toBeNull();
  expect(columna?.classList.contains("col-12")).toBe(true);
  expect(columna?.classList.contains("col-md-6")).toBe(true);
  expect(columna?.classList.contains("col-lg-5")).toBe(true);
});
