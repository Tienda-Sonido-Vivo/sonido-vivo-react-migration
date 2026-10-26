// @vitest-environment jsdom

import {
    test,
    expect,
    vi,
    afterEach
} from "vitest";

import {
    render,
    screen,
    fireEvent,
    cleanup
} from "@testing-library/react";

import {
    MemoryRouter,
    Routes,
    Route
} from "react-router-dom";

import "@testing-library/jest-dom/vitest";

import DetalleProducto from "../paginas/DetalleProducto";

import type { Producto } from "../interfaces/Producto";


afterEach(() => {

    cleanup();

    vi.restoreAllMocks();

});


test("DetalleProducto muestra correctamente el producto recibido mediante props", () => {

    const productoPrueba: Producto = {

        codigo: "BA001",

        nombre: "Bajo Eléctrico 4 Cuerdas",

        categoria: "Bajos Eléctricos",

        marca: "Fender",

        modelo: "Player",

        precio: 599990,

        stock: 5,

        imagen: "/imagenes/bajo.jpg",

        descripcion: "Bajo eléctrico de cuatro cuerdas."

    };


    const productos: Producto[] = [
        productoPrueba
    ];


    const onAgregarCarrito = () => {};

    render(

        <MemoryRouter initialEntries={["/producto/BA001"]}>

            <Routes>

                <Route
                    path="/producto/:codigo"
                    element={
                        <DetalleProducto
                            productos={productos}
                            onAgregarCarrito={
                                onAgregarCarrito
                            }
                        />
                    }
                />

            </Routes>

        </MemoryRouter>

    );


    expect(
        screen.getByRole("heading", {
            name: "Bajo Eléctrico 4 Cuerdas"
        })
    ).toBeInTheDocument();

    expect(
        screen.getByText("Fender")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Bajos Eléctricos")
    ).toBeInTheDocument();


    expect(
        screen.getByText("Stock: 5")
    ).toBeInTheDocument();


    expect(
        screen.getByText("Precio: $599.990")
    ).toBeInTheDocument();

});


test("DetalleProducto llama a onAgregarCarrito al agregar un producto", () => {

    const productoPrueba: Producto = {

        codigo: "BA001",

        nombre: "Bajo Eléctrico 4 Cuerdas",

        categoria: "Bajos Eléctricos",

        marca: "Fender",

        modelo: "Player",

        precio: 599990,

        stock: 5,

        imagen: "/imagenes/bajo.jpg",

        descripcion: "Bajo eléctrico de cuatro cuerdas."

    };


    const productos: Producto[] = [
        productoPrueba
    ];

    const onAgregarCarrito = vi.fn();


    vi.spyOn(window, "alert")
        .mockImplementation(() => {});


    render(

        <MemoryRouter initialEntries={["/producto/BA001"]}>

            <Routes>

                <Route
                    path="/producto/:codigo"
                    element={
                        <DetalleProducto
                            productos={productos}
                            onAgregarCarrito={
                                onAgregarCarrito
                            }
                        />
                    }
                />

            </Routes>

        </MemoryRouter>

    );


    const botonAgregar =
        screen.getByRole("button", {
            name: /Agregar al carrito/i
        });


    fireEvent.click(botonAgregar);

    expect(
        onAgregarCarrito
    ).toHaveBeenCalledWith(
        "BA001",
        1
    );

    expect(
        onAgregarCarrito
    ).toHaveBeenCalledTimes(1);


    expect(
        window.alert
    ).toHaveBeenCalledWith(
        '"Bajo Eléctrico 4 Cuerdas" fue agregado al carrito.'
    );

});