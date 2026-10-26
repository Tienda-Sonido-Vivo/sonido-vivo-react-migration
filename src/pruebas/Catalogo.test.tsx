// @vitest-environment jsdom

import { test, expect, afterEach } from "vitest";

import { render, screen, cleanup } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import "@testing-library/jest-dom/vitest";

import Catalogo from "../paginas/Catalogo";

afterEach(() => {
    cleanup();
});


test("el catálogo muestra solamente los productos de la categoría Baterías", () => {

    render(

        <MemoryRouter initialEntries={["/catalogo?categoria=Baterías"]}>

            <Catalogo />

        </MemoryRouter>

    );


    expect(
        screen.getByText("Batería Acústica 5 piezas")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Batería Electrónica 8 pads")
    ).toBeInTheDocument();

    expect(
        screen.getByText('Caja Snare 14"')
    ).toBeInTheDocument();


    expect(
        screen.queryByText("Bajo Eléctrico 4 Cuerdas")
    ).not.toBeInTheDocument();

    expect(
        screen.queryByText("Guitarra Acústica Folk")
    ).not.toBeInTheDocument();

});


test("el catálogo muestra un mensaje cuando la categoría Teclados y Pianos no tiene productos", () => {

    render(

        <MemoryRouter initialEntries={["/catalogo?categoria=Teclados%20y%20Pianos"]}>

            <Catalogo />

        </MemoryRouter>

    );


    expect(
        screen.getByText(/No se encontraron productos/)
    ).toBeInTheDocument();


    expect(
        screen.getAllByText("Teclados y Pianos")
    ).toHaveLength(2);


    expect(
        screen.queryByText("Batería Acústica 5 piezas")
    ).not.toBeInTheDocument();

});