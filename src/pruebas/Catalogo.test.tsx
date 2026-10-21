// @vitest-environment jsdom

// src/pruebas/Catalogo.test.tsx

// Importamos las herramientas necesarias de Vitest.
import { test, expect, afterEach } from "vitest";

// Importamos las herramientas de React Testing Library.
import { render, screen, cleanup } from "@testing-library/react";

// Importamos MemoryRouter porque Catalogo utiliza useSearchParams.
import { MemoryRouter } from "react-router-dom";

// Importamos los matchers adicionales de Testing Library.
import "@testing-library/jest-dom/vitest";

// Importamos el componente que vamos a probar.
import Catalogo from "../paginas/Catalogo";


// Limpiamos el DOM después de cada prueba.
// Esto evita que el contenido de una prueba interfiera
// con las pruebas siguientes.
afterEach(() => {
    cleanup();
});


// PRUEBA 1
// Comprueba que el catálogo filtre correctamente
// los productos según la categoría indicada en la URL.

test("el catálogo muestra solamente los productos de la categoría Baterías", () => {

    // Renderizamos el catálogo indicando la categoría Baterías
    // mediante el parámetro de búsqueda de la URL.
    render(

        <MemoryRouter initialEntries={["/catalogo?categoria=Baterías"]}>

            <Catalogo />

        </MemoryRouter>

    );

    // Comprobamos que se muestran los productos
    // correspondientes a la categoría Baterías.

    expect(
        screen.getByText("Batería Acústica 5 piezas")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Batería Electrónica 8 pads")
    ).toBeInTheDocument();

    expect(
        screen.getByText('Caja Snare 14"')
    ).toBeInTheDocument();


    // Comprobamos que NO se muestran productos
    // pertenecientes a otras categorías.

    expect(
        screen.queryByText("Bajo Eléctrico 4 Cuerdas")
    ).not.toBeInTheDocument();

    expect(
        screen.queryByText("Guitarra Acústica Folk")
    ).not.toBeInTheDocument();

});


// PRUEBA 2
// Comprueba el comportamiento del catálogo cuando
// la categoría seleccionada no tiene productos.

test("el catálogo muestra un mensaje cuando la categoría Teclados y Pianos no tiene productos", () => {

    // Renderizamos el catálogo indicando la categoría
    // Teclados y Pianos mediante la URL.
    render(

        <MemoryRouter initialEntries={["/catalogo?categoria=Teclados%20y%20Pianos"]}>

            <Catalogo />

        </MemoryRouter>

    );

    // Comprobamos que aparece el mensaje indicando
    // que no existen productos para esta categoría.

    expect(
        screen.getByText(/No se encontraron productos/)
    ).toBeInTheDocument();


    // Comprobamos que el nombre de la categoría
    // aparece tanto en el título como en el mensaje.

    expect(
        screen.getAllByText("Teclados y Pianos")
    ).toHaveLength(2);


    // Comprobamos que no aparecen productos
    // cuando la categoría no tiene resultados.

    expect(
        screen.queryByText("Batería Acústica 5 piezas")
    ).not.toBeInTheDocument();

});