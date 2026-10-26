// @vitest-environment jsdom

import { test, expect, vi, afterEach } from "vitest";

import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import "@testing-library/jest-dom/vitest";

import GestionProductos from "../paginas/admin/GestionProductos";

import type { Producto } from "../interfaces/Producto";

vi.mock("../servicios/sesion", () => ({
  obtenerRol: () => "Administrador",
}));


afterEach(() => {
  cleanup();


  vi.restoreAllMocks();
});


const productosPrueba: Producto[] = [
  {
    codigo: "GA001",
    nombre: "Guitarra Acústica Folk",
    categoria: "Guitarras Acústicas",
    marca: "Yamaha",
    modelo: "F310",
    precio: 129990,
    stock: 8,
    imagen: "/img/tarjetas/Guitarra Acustica Yamaha F310.webp",
    descripcion:
      "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes.",
  },
  {
    codigo: "BA001",
    nombre: "Bajo Eléctrico 4 Cuerdas",
    categoria: "Bajos Eléctricos",
    marca: "Squier",
    modelo: "Affinity PJ",
    precio: 299990,
    stock: 5,
    imagen: "/img/tarjetas/Bajo Eléctrico 4 Cuerdas squier Affinity PJ.webp",
    descripcion: "Pickup PJ, cuerpo álamo, mástil arce.",
  },
];

test("GestionProductos muestra correctamente la lista de productos recibidos por props", () => {

  const onCambiarProductos = vi.fn();

  render(
    <MemoryRouter>
      <GestionProductos
        productos={productosPrueba}
        onCambiarProductos={onCambiarProductos}
      />
    </MemoryRouter>,
  );

  expect(screen.getByText("Guitarra Acústica Folk")).toBeInTheDocument();

  expect(screen.getByText("Bajo Eléctrico 4 Cuerdas")).toBeInTheDocument();

  expect(screen.getByText("GA001")).toBeInTheDocument();

  expect(screen.getByText("BA001")).toBeInTheDocument();
});

test("GestionProductos filtra la lista de productos según el texto ingresado en el buscador", () => {
  
  const onCambiarProductos = vi.fn();

  render(
    <MemoryRouter>
      <GestionProductos
        productos={productosPrueba}
        onCambiarProductos={onCambiarProductos}
      />
    </MemoryRouter>,
  );

  const buscador = screen.getByPlaceholderText(
    /Buscar por código, nombre, marca/i,
  );

  fireEvent.change(buscador, {
    target: { value: "bajo" },
  });

  expect(screen.getByText("Bajo Eléctrico 4 Cuerdas")).toBeInTheDocument();

  expect(screen.queryByText("Guitarra Acústica Folk")).not.toBeInTheDocument();
});


test("GestionProductos llama a onCambiarProductos al eliminar un producto", () => {
  const onCambiarProductos = vi.fn();

  vi.spyOn(window, "confirm").mockImplementation(() => true);

  render(
    <MemoryRouter>
      <GestionProductos
        productos={productosPrueba}
        onCambiarProductos={onCambiarProductos}
      />
    </MemoryRouter>,
  );

  const botonesEliminar = screen.getAllByRole("button", {
    name: "Eliminar",
  });

  fireEvent.click(botonesEliminar[0]);

  expect(onCambiarProductos).toHaveBeenCalledWith([productosPrueba[1]]);
  expect(onCambiarProductos).toHaveBeenCalledTimes(1);
});


test("GestionProductos abre el modal y llama a onCambiarProductos al guardar un nuevo producto", () => {
  const onCambiarProductos = vi.fn();

  vi.spyOn(window, "alert").mockImplementation(() => {});

  const { container } = render(
    <MemoryRouter>
      <GestionProductos
        productos={productosPrueba}
        onCambiarProductos={onCambiarProductos}
      />
    </MemoryRouter>
  );

  const botonNuevo = screen.getByRole("button", {
    name: "Añadir producto",
  });
  fireEvent.click(botonNuevo);

  const inputCodigo = container.querySelector('input[name="codigo"]')!;
  const selectCategoria = container.querySelector('#productoCategoria')!;
  const inputNombre = container.querySelector('input[name="nombre"]')!;
  const inputMarca = container.querySelector('input[name="marca"]')!;
  const inputModelo = container.querySelector('input[name="modelo"]')!;
  const inputStock = container.querySelector('input[name="stock"]')!;
  const inputPrecio = container.querySelector('input[name="precio"]')!;
  const textareaDesc = container.querySelector('#productoDescripcion')!;

  fireEvent.change(inputCodigo, { target: { value: "GA002" } });
  fireEvent.change(selectCategoria, { target: { value: "Guitarras Acústicas" } });
  fireEvent.change(inputNombre, { target: { value: "Guitarra Electroacústica Yamaha" } });
  fireEvent.change(inputMarca, { target: { value: "Yamaha" } });
  fireEvent.change(inputModelo, { target: { value: "APX600" } });
  fireEvent.change(inputStock, { target: { value: "10" } });
  fireEvent.change(inputPrecio, { target: { value: "250000" } });
  fireEvent.change(textareaDesc, { target: { value: "Guitarra electroacústica de gran sonido." } });

  const botonGuardar = screen.getByRole("button", { name: "Guardar" });
  fireEvent.click(botonGuardar);

  expect(onCambiarProductos).toHaveBeenCalledTimes(1);
});

test("GestionProductos llama a onCambiarProductos al editar un producto existente", () => {
  const onCambiarProductos = vi.fn();

  vi.spyOn(window, "alert").mockImplementation(() => {});

  const { container } = render(
    <MemoryRouter>
      <GestionProductos
        productos={productosPrueba}
        onCambiarProductos={onCambiarProductos}
      />
    </MemoryRouter>
  );

  const botonesEditar = screen.getAllByRole("button", { name: "Editar" });
  fireEvent.click(botonesEditar[0]);

  const inputStock = container.querySelector('input[name="stock"]')!;
  fireEvent.change(inputStock, { target: { value: "20" } });

  const botonGuardar = screen.getByRole("button", { name: "Guardar" });
  fireEvent.click(botonGuardar);

  expect(onCambiarProductos).toHaveBeenCalledTimes(1);
});