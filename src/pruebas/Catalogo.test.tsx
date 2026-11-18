// @vitest-environment jsdom

import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

import Catalogo from "../paginas/Catalogo";
import type { Producto } from "../interfaces/Producto";

afterEach(() => {
  cleanup();
});

const productosPrueba: Producto[] = [
  {
    codigo: "BT001",
    nombre: "Batería Acústica 5 piezas",
    categoria: "Baterías",
    marca: "Pearl",
    modelo: "Roadshow",
    precio: 599990,
    stock: 2,
    imagen: "/img/bateria.jpg",
    descripcion: "Batería acústica.",
  },
  {
    codigo: "BT002",
    nombre: "Batería Electrónica 8 pads",
    categoria: "Baterías",
    marca: "Roland",
    modelo: "TD-02KV",
    precio: 799990,
    stock: 2,
    imagen: "/img/bateria-electronica.jpg",
    descripcion: "Batería electrónica.",
  },
  {
    codigo: "BT003",
    nombre: 'Caja Snare 14"',
    categoria: "Baterías",
    marca: "Pearl",
    modelo: "STE1450",
    precio: 89990,
    stock: 4,
    imagen: "/img/snare.jpg",
    descripcion: "Caja snare.",
  },
  {
    codigo: "BA001",
    nombre: "Bajo Eléctrico 4 Cuerdas",
    categoria: "Bajos Eléctricos",
    marca: "Squier",
    modelo: "Affinity PJ",
    precio: 299990,
    stock: 5,
    imagen: "/img/bajo.jpg",
    descripcion: "Bajo eléctrico.",
  },
  {
    codigo: "GA001",
    nombre: "Guitarra Acústica Folk",
    categoria: "Guitarras Acústicas",
    marca: "Yamaha",
    modelo: "F310",
    precio: 129990,
    stock: 8,
    imagen: "/img/guitarra.jpg",
    descripcion: "Guitarra acústica.",
  },
];

test("el catálogo muestra solamente los productos de la categoría Baterías", () => {
  render(
    <MemoryRouter initialEntries={["/catalogo?categoria=Baterías"]}>
      <Catalogo productos={productosPrueba} cargando={false} />
    </MemoryRouter>,
  );

  expect(screen.getByText("Batería Acústica 5 piezas")).toBeInTheDocument();
  expect(screen.getByText("Batería Electrónica 8 pads")).toBeInTheDocument();
  expect(screen.getByText('Caja Snare 14"')).toBeInTheDocument();
  expect(screen.queryByText("Bajo Eléctrico 4 Cuerdas")).not.toBeInTheDocument();
  expect(screen.queryByText("Guitarra Acústica Folk")).not.toBeInTheDocument();
});

test("el catálogo muestra un mensaje cuando la categoría Teclados y Pianos no tiene productos", () => {
  render(
    <MemoryRouter initialEntries={["/catalogo?categoria=Teclados%20y%20Pianos"]}>
      <Catalogo productos={productosPrueba} cargando={false} />
    </MemoryRouter>,
  );

  expect(screen.getByText(/No se encontraron productos/)).toBeInTheDocument();
  expect(screen.getAllByText("Teclados y Pianos")).toHaveLength(2);
  expect(screen.queryByText("Batería Acústica 5 piezas")).not.toBeInTheDocument();
});
