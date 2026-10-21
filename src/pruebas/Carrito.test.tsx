// @vitest-environment jsdom

// Carrito.test.tsx

// Importamos las herramientas necesarias de Vitest.
import {
    test,
    expect,
    vi,
    afterEach
} from "vitest";

// Importamos las herramientas de React Testing Library.
import {
    render,
    screen,
    fireEvent,
    cleanup
} from "@testing-library/react";

// Importamos MemoryRouter, Routes y Route porque
// Carrito utiliza useNavigate() y Link.
import {
    MemoryRouter,
    Routes,
    Route
} from "react-router-dom";

// Importamos los matchers adicionales de Testing Library.
import "@testing-library/jest-dom/vitest";

// Importamos el componente que vamos a probar.
import Carrito from "../paginas/Carrito";

// Importamos las interfaces necesarias para
// definir correctamente los datos de prueba.
import type { Producto } from "../interfaces/Producto";
import type { ItemCarrito } from "../interfaces/ItemCarrito";


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


// Producto que utilizaremos como dato de prueba.
//
// Lo definimos una sola vez porque varias pruebas
// necesitan trabajar con el mismo producto.
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


// ============================================================
// PRUEBA 5
// ============================================================
//
// Comprueba el comportamiento del carrito cuando
// no existen productos.
//
// En este caso:
// - Se muestra el mensaje de carrito vacío.
// - El botón "Continuar compra" queda deshabilitado.

test("Carrito muestra mensaje y deshabilita continuar compra cuando está vacío", () => {

    // Creamos un carrito vacío.
    const carrito: ItemCarrito[] = [];


    // Creamos funciones simuladas para las props.
    //
    // No necesitamos ejecutarlas en esta prueba,
    // pero Carrito las requiere.
    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();


    // Renderizamos el componente.
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


    // Comprobamos que aparece el mensaje
    // indicando que el carrito está vacío.
    expect(
        screen.getByRole("heading", {
            name: "Tu carrito está vacío"
        })
    ).toBeInTheDocument();


    // Buscamos el botón para continuar la compra.
    const botonContinuar =
        screen.getByRole("button", {
            name: /Continuar compra/i
        });


    // Comprobamos que el botón está deshabilitado
    // cuando no existen productos en el carrito.
    expect(
        botonContinuar
    ).toBeDisabled();

});


// ============================================================
// PRUEBA 6
// ============================================================
//
// Comprueba que Carrito recibe correctamente
// los productos mediante props y muestra
// la información correspondiente.
//
// También verificamos la cantidad y el subtotal.

test("Carrito muestra correctamente un producto recibido mediante props", () => {

    // Creamos un carrito que contiene
    // dos unidades del producto de prueba.
    const carrito: ItemCarrito[] = [

        {
            codigo: "BA001",
            cantidad: 2
        }

    ];


    // Creamos funciones simuladas para las props.
    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();


    // Renderizamos Carrito con el producto
    // y el contenido del carrito.
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


    // Comprobamos que aparece el nombre
    // del producto.
    expect(
        screen.getByRole("heading", {
            name: "Bajo Eléctrico 4 Cuerdas"
        })
    ).toBeInTheDocument();


    // Comprobamos que aparece la categoría
    // del producto.
    expect(
        screen.getByText("Bajos Eléctricos")
    ).toBeInTheDocument();


    // Comprobamos que el campo de cantidad
    // muestra las dos unidades recibidas.
    expect(
        screen.getByDisplayValue("2")
    ).toBeInTheDocument();


    // Comprobamos que se muestra el precio
    // unitario del producto.
    expect(
        screen.getByText("$599.990")
    ).toBeInTheDocument();


    // El subtotal corresponde a:
    //
    // $599.990 × 2 = $1.199.980
    //
    // Como este mismo valor también aparece en el
    // resumen de compra, buscamos específicamente
    // el contenedor que corresponde al subtotal del producto.
    const textoSubtotal =
        screen.getByText("Subtotal");

    const contenedorSubtotal =
        textoSubtotal.parentElement;


    // Comprobamos que el contenedor del subtotal
    // contiene el valor esperado.
    expect(
        contenedorSubtotal
    ).toHaveTextContent("$1.199.980");

});


// ============================================================
// PRUEBA 7
// ============================================================
//
// Comprueba que al presionar el botón +
// para aumentar la cantidad, el componente
// llama correctamente a onCambiarCantidad.
//
// Esta prueba verifica el evento y los argumentos
// enviados al callback.

test("Carrito llama a onCambiarCantidad al aumentar la cantidad", () => {

    // Creamos un carrito con una unidad
    // del producto.
    const carrito: ItemCarrito[] = [

        {
            codigo: "BA001",
            cantidad: 1
        }

    ];


    // Creamos una función simulada para poder
    // comprobar si fue llamada.
    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();


    // Renderizamos el componente.
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


    // Buscamos el botón que permite aumentar
    // la cantidad del producto.
    const botonAumentar =
        screen.getByRole("button", {
            name: "Aumentar cantidad"
        });


    // Simulamos el clic del usuario.
    fireEvent.click(botonAumentar);


    // Comprobamos que la función recibida mediante props
    // fue llamada con el código del producto
    // y la nueva cantidad esperada.
    expect(
        onCambiarCantidad
    ).toHaveBeenCalledWith(
        "BA001",
        2
    );


    // Comprobamos que la función fue llamada
    // exactamente una vez.
    expect(
        onCambiarCantidad
    ).toHaveBeenCalledTimes(1);

});


// ============================================================
// PRUEBA 8
// ============================================================
//
// Comprueba que al presionar el botón de eliminar,
// Carrito llama correctamente a onEliminar.
//
// Esto representa la operación Delete del carrito.

test("Carrito llama a onEliminar al eliminar un producto", () => {

    // Creamos un carrito que contiene
    // el producto de prueba.
    const carrito: ItemCarrito[] = [

        {
            codigo: "BA001",
            cantidad: 1
        }

    ];


    // Creamos funciones simuladas.
    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();


    // Renderizamos el componente.
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


    // Buscamos el botón de eliminar utilizando
    // el nombre accesible generado por aria-label.
    const botonEliminar =
        screen.getByRole("button", {
            name: "Eliminar Bajo Eléctrico 4 Cuerdas"
        });


    // Simulamos el clic del usuario.
    fireEvent.click(botonEliminar);


    // Comprobamos que onEliminar recibió
    // correctamente el código del producto.
    expect(
        onEliminar
    ).toHaveBeenCalledWith(
        "BA001"
    );


    // Comprobamos que la función fue llamada
    // exactamente una vez.
    expect(
        onEliminar
    ).toHaveBeenCalledTimes(1);

});


// ============================================================
// PRUEBA 9
// ============================================================
//
// Comprueba que cuando el carrito contiene productos,
// al presionar "Continuar compra" se navega
// correctamente hacia /checkout.
//
// Utilizamos una ruta de prueba para comprobar
// que la navegación realmente ocurrió.

test("Carrito navega a checkout al continuar la compra", () => {

    // Creamos un carrito con un producto.
    const carrito: ItemCarrito[] = [

        {
            codigo: "BA001",
            cantidad: 1
        }

    ];


    // Creamos funciones simuladas para las props.
    const onCambiarCantidad = vi.fn();

    const onEliminar = vi.fn();


    // Renderizamos Carrito dentro de MemoryRouter.
    //
    // También agregamos una ruta /checkout que nos
    // permitirá comprobar si la navegación ocurrió.
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


    // Buscamos el botón para continuar
    // con la compra.
    const botonContinuar =
        screen.getByRole("button", {
            name: /Continuar compra/i
        });


    // Comprobamos que el botón está habilitado
    // porque el carrito contiene un producto.
    expect(
        botonContinuar
    ).toBeEnabled();


    // Simulamos el clic del usuario.
    fireEvent.click(botonContinuar);


    // Comprobamos que la aplicación llegó
    // correctamente a la página Checkout.
    expect(
        screen.getByRole("heading", {
            name: "Checkout"
        })
    ).toBeInTheDocument();

});