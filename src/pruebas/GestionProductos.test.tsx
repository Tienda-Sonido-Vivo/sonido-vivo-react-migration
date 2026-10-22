// @vitest-environment jsdom

// GestionProductos.test.tsx

// Importamos las herramientas necesarias de Vitest.
import { test, expect, vi, afterEach } from "vitest";

// Importamos las herramientas de React Testing Library.
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// Importamos MemoryRouter porque GestionProductos utiliza elementos de navegación.
import { MemoryRouter } from "react-router-dom";

// Importamos los matchers adicionales de Testing Library.
import "@testing-library/jest-dom/vitest";

// Importamos el componente que vamos a probar.
import GestionProductos from "../paginas/admin/GestionProductos";

// Importamos la interfaz Producto para definir
// correctamente los datos de prueba.
import type { Producto } from "../interfaces/Producto";

// Mock del servicio de sesión para simular que el usuario actual es Administrador
vi.mock("../servicios/sesion", () => ({
  obtenerRol: () => "Administrador",
}));

// Limpiamos el DOM después de cada prueba.
//
// Esto evita que el renderizado de una prueba
// interfiera con las pruebas siguientes.
afterEach(() => {
  cleanup();

  // Restauramos los mocks y espías utilizados
  // durante cada prueba.
  vi.restoreAllMocks();
});

// Arreglo de productos que utilizaremos como datos de prueba.
//
// Lo definimos una sola vez porque varias pruebas
// necesitan trabajar con los mismos datos.
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

// ============================================================
// PRUEBA 1 (OPERACIÓN READ / LEER)
// ============================================================
//
// Comprueba que GestionProductos recibe correctamente
// la lista de productos mediante props y muestra
// la información esperada en la tabla.

test("GestionProductos muestra correctamente la lista de productos recibidos por props", () => {
  // Creamos una función simulada para la prop onCambiarProductos.
  const onCambiarProductos = vi.fn();

  // Renderizamos el componente dentro de MemoryRouter.
  render(
    <MemoryRouter>
      <GestionProductos
        productos={productosPrueba}
        onCambiarProductos={onCambiarProductos}
      />
    </MemoryRouter>,
  );

  // Comprobamos que se muestran los nombres de los productos.
  expect(screen.getByText("Guitarra Acústica Folk")).toBeInTheDocument();

  expect(screen.getByText("Bajo Eléctrico 4 Cuerdas")).toBeInTheDocument();

  // Comprobamos que se muestran los códigos de cada producto.
  expect(screen.getByText("GA001")).toBeInTheDocument();

  expect(screen.getByText("BA001")).toBeInTheDocument();
});

// ============================================================
// PRUEBA 2 (FILTRO DE BÚSQUEDA)
// ============================================================
//
// Comprueba que al escribir en el buscador de productos,
// la tabla se filtra mostrando únicamente los elementos
// que coinciden con el texto ingresado.

test("GestionProductos filtra la lista de productos según el texto ingresado en el buscador", () => {
  // Creamos la función simulada.
  const onCambiarProductos = vi.fn();

  // Renderizamos el componente.
  render(
    <MemoryRouter>
      <GestionProductos
        productos={productosPrueba}
        onCambiarProductos={onCambiarProductos}
      />
    </MemoryRouter>,
  );

  // Buscamos el campo de entrada del filtro.
  const buscador = screen.getByPlaceholderText(
    /Buscar por código, nombre, marca/i,
  );

  // Simulamos que el usuario escribe "Fender" en el buscador.
  fireEvent.change(buscador, {
    target: { value: "bajo" },
  });

  // Comprobamos que el producto Fender se mantiene visible.
  expect(screen.getByText("Bajo Eléctrico 4 Cuerdas")).toBeInTheDocument();

  // Comprobamos que la guitarra Yamaha se oculta.
  expect(screen.queryByText("Guitarra Acústica Folk")).not.toBeInTheDocument();
});

// ============================================================
// PRUEBA 3 (OPERACIÓN DELETE / ELIMINAR)
// ============================================================
//
// Comprueba que al presionar el botón Eliminar de un producto
// y confirmar la alerta, el componente llama a la función
// onCambiarProductos enviando la lista actualizada sin ese registro.

test("GestionProductos llama a onCambiarProductos al eliminar un producto", () => {
  // Creamos la función simulada.
  const onCambiarProductos = vi.fn();

  // Simulamos que el usuario confirma la ventana modal alert/confirm.
  vi.spyOn(window, "confirm").mockImplementation(() => true);

  // Renderizamos el componente.
  render(
    <MemoryRouter>
      <GestionProductos
        productos={productosPrueba}
        onCambiarProductos={onCambiarProductos}
      />
    </MemoryRouter>,
  );

  // Buscamos los botones de eliminar de la tabla
  const botonesEliminar = screen.getAllByRole("button", {
    name: "Eliminar",
  });

  // Hacemos clic en eliminar el primer producto (GA001)
  fireEvent.click(botonesEliminar[0]);

  // Comprobamos que onCambiarProductos fue llamado con la lista sin el primer producto
  expect(onCambiarProductos).toHaveBeenCalledWith([productosPrueba[1]]);
  expect(onCambiarProductos).toHaveBeenCalledTimes(1);
});

// ============================================================
// PRUEBA 4 (OPERACIÓN CREATE / CREAR)
// ============================================================
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

  // Abrir modal
  const botonNuevo = screen.getByRole("button", {
    name: "Añadir producto",
  });
  fireEvent.click(botonNuevo);

  // Llenamos el formulario seleccionando directamente por el atributo 'name' o 'id'
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

  // Hacer clic en el botón Guardar del modal
  const botonGuardar = screen.getByRole("button", { name: "Guardar" });
  fireEvent.click(botonGuardar);

  // Verificamos que onCambiarProductos se llamó exitosamente
  expect(onCambiarProductos).toHaveBeenCalledTimes(1);
});

// ============================================================
// PRUEBA 5 (OPERACIÓN UPDATE / ACTUALIZAR)
// ============================================================
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

  // Cambiar stock usando el selector directo por name
  const inputStock = container.querySelector('input[name="stock"]')!;
  fireEvent.change(inputStock, { target: { value: "20" } });

  const botonGuardar = screen.getByRole("button", { name: "Guardar" });
  fireEvent.click(botonGuardar);

  expect(onCambiarProductos).toHaveBeenCalledTimes(1);
});