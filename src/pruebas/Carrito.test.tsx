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

import Carrito from "../paginas/Carrito";

import type { Producto } from "../interfaces/Producto";
import type { ItemCarrito } from "../interfaces/ItemCarrito";


afterEach(() => {

    cleanup();

    vi.restoreAllMocks();

});


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


test("Carrito muestra mensaje y deshabilita continuar compra cuando está vacío", () => {

    const carrito: ItemCarrito[] = [];

    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();

    render(

        <MemoryRouter>

            <Carrito
                carrito={carrito}
                productos={[productoPrueba]}
                onCambiarCantidad={
                    onCambiarCantidad
                }
                onEliminar={
                    onEliminar
                }
            />

        </MemoryRouter>

    );


    expect(
        screen.getByRole("heading", {
            name: "Tu carrito está vacío"
        })
    ).toBeInTheDocument();


    const botonContinuar =
        screen.getByRole("button", {
            name: /Continuar compra/i
        });

    expect(
        botonContinuar
    ).toBeDisabled();

});


test("Carrito muestra correctamente un producto recibido mediante props", () => {

    const carrito: ItemCarrito[] = [

        {
            codigo: "BA001",
            cantidad: 2
        }

    ];

    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();

    render(

        <MemoryRouter>

            <Carrito
                carrito={carrito}
                productos={[productoPrueba]}
                onCambiarCantidad={
                    onCambiarCantidad
                }
                onEliminar={
                    onEliminar
                }
            />

        </MemoryRouter>

    );


    expect(
        screen.getByRole("heading", {
            name: "Bajo Eléctrico 4 Cuerdas"
        })
    ).toBeInTheDocument();

    expect(
        screen.getByText("Bajos Eléctricos")
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue("2")
    ).toBeInTheDocument();

    expect(
        screen.getByText("$599.990")
    ).toBeInTheDocument();


    const textoSubtotal =
        screen.getByText("Subtotal");

    const contenedorSubtotal =
        textoSubtotal.parentElement;

    expect(
        contenedorSubtotal
    ).toHaveTextContent("$1.199.980");

});



test("Carrito llama a onCambiarCantidad al aumentar la cantidad", () => {

    const carrito: ItemCarrito[] = [

        {
            codigo: "BA001",
            cantidad: 1
        }

    ];


    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();


    render(

        <MemoryRouter>

            <Carrito
                carrito={carrito}
                productos={[productoPrueba]}
                onCambiarCantidad={
                    onCambiarCantidad
                }
                onEliminar={
                    onEliminar
                }
            />

        </MemoryRouter>

    );

    const botonAumentar =
        screen.getByRole("button", {
            name: "Aumentar cantidad"
        });


    fireEvent.click(botonAumentar);

    expect(
        onCambiarCantidad
    ).toHaveBeenCalledWith(
        "BA001",
        2
    );

    expect(
        onCambiarCantidad
    ).toHaveBeenCalledTimes(1);

});


test("Carrito llama a onEliminar al eliminar un producto", () => {

    const carrito: ItemCarrito[] = [

        {
            codigo: "BA001",
            cantidad: 1
        }

    ];

    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();

    render(

        <MemoryRouter>

            <Carrito
                carrito={carrito}
                productos={[productoPrueba]}
                onCambiarCantidad={
                    onCambiarCantidad
                }
                onEliminar={
                    onEliminar
                }
            />

        </MemoryRouter>

    );

    const botonEliminar =
        screen.getByRole("button", {
            name: "Eliminar Bajo Eléctrico 4 Cuerdas"
        });

    fireEvent.click(botonEliminar);

    expect(
        onEliminar
    ).toHaveBeenCalledWith(
        "BA001"
    );


    expect(
        onEliminar
    ).toHaveBeenCalledTimes(1);

});


test("Carrito navega a checkout al continuar la compra", () => {

    const carrito: ItemCarrito[] = [

        {
            codigo: "BA001",
            cantidad: 1
        }

    ];


    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();


    render(

        <MemoryRouter initialEntries={["/carrito"]}>

            <Routes>

                <Route
                    path="/carrito"
                    element={
                        <Carrito
                            carrito={carrito}
                            productos={[productoPrueba]}
                            onCambiarCantidad={
                                onCambiarCantidad
                            }
                            onEliminar={
                                onEliminar
                            }
                        />
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <h1>Checkout</h1>
                    }
                />

            </Routes>

        </MemoryRouter>

    );


    const botonContinuar =
        screen.getByRole("button", {
            name: /Continuar compra/i
        });

    expect(
        botonContinuar
    ).toBeEnabled();


    fireEvent.click(botonContinuar);

    expect(
        screen.getByRole("heading", {
            name: "Checkout"
        })
    ).toBeInTheDocument();

});