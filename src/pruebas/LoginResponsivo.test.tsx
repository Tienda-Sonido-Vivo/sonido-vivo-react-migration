// @vitest-environment jsdom

import { test, expect, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import "@testing-library/jest-dom/vitest";

import Login from "../paginas/Login";

import type { Usuario } from "../interfaces/Usuario";

test("la página Login contiene las clases responsive de Bootstrap", () => {
  const usuarios: Usuario[] = [
    {
      run: "123456789",
      nombre: "Juan",
      apellidos: "Pérez Gómez",
      email: "admin@demo.cl",
      fechaNacimiento: "1985-03-12",
      region: "Metropolitana de Santiago",
      comuna: "Santiago",
      direccion: "Calle Falsa 123",
      rol: "Administrador",
      estado: "Activo",
      clave: "1234",
    },
  ];

  const onIniciarSesion = vi.fn();

  // Renderizamos la página Login.
  render(
    <MemoryRouter>
      <Login
        usuarios={usuarios}
        onIniciarSesion={onIniciarSesion}
      />
    </MemoryRouter>
  );

  // Buscamos el título para localizar la columna que lo contiene.
  const titulo = screen.getByRole("heading", {
    name: "Iniciar Sesión",
  });

  const columna = titulo.closest(".col-12");

  // Comprobamos que encontramos la columna.
  expect(columna).not.toBeNull();

  // Comprobamos que contiene las clases responsive esperadas.
  expect(columna?.classList.contains("col-12")).toBe(true);
  expect(columna?.classList.contains("col-md-6")).toBe(true);
  expect(columna?.classList.contains("col-lg-5")).toBe(true);
});