// @vitest-environment jsdom

import { test, expect, vi, afterEach } from "vitest";

import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import "@testing-library/jest-dom/vitest";

import FormularioLogin from "../componentes/organismos/FormularioLogin";

import type { Usuario } from "../interfaces/Usuario";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("FormularioLogin muestra un mensaje de error cuando el correo es inválido", () => {
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

  vi.spyOn(window, "alert").mockImplementation(() => {});

  const { container } = render(
    <MemoryRouter>
      <FormularioLogin
        usuarios={usuarios}
        onIniciarSesion={onIniciarSesion}
      />
    </MemoryRouter>
  );

  // Buscamos los campos por su atributo name.
  // Se hace así porque los label actuales no tienen htmlFor
  // y los inputs no tienen id.
  const campoCorreo = container.querySelector(
    'input[name="correo"]'
  ) as HTMLInputElement;

  const campoClave = container.querySelector(
    'input[name="clave"]'
  ) as HTMLInputElement;

  fireEvent.change(campoCorreo, {
    target: { value: "correo-invalido" },
  });

  fireEvent.change(campoClave, {
    target: { value: "1234" },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Ingresar",
    })
  );

  expect(window.alert).toHaveBeenCalledWith(
    "Ingrese un correo válido."
  );

  expect(onIniciarSesion).not.toHaveBeenCalled();
});