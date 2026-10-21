// @vitest-environment jsdom

// DetalleProducto.test.tsx

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
// DetalleProducto utiliza useParams() y useNavigate().
import {
    MemoryRouter,
    Routes,
    Route
} from "react-router-dom";

// Importamos los matchers adicionales de Testing Library.
import "@testing-library/jest-dom/vitest";

// Importamos el componente que vamos a probar.
import DetalleProducto from "../paginas/DetalleProducto";

// Importamos la interfaz Producto para definir
// correctamente el producto utilizado en la prueba.
import type { Producto } from "../interfaces/Producto";


// Limpiamos el DOM después de cada prueba.
//
// Esto evita que el renderizado de una prueba
// interfiera con las pruebas siguientes.
afterEach(() => {

    cleanup();

    // Restauramos los mocks y espías utilizados
    // durante la prueba.
    vi.restoreAllMocks();

});


// PRUEBA 1
// Comprueba que DetalleProducto recibe correctamente
// los productos mediante props y muestra el producto
// correspondiente al código indicado en la URL.

test("DetalleProducto muestra correctamente el producto recibido mediante props", () => {

    // Creamos un producto de prueba.
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


    // Creamos un arreglo de productos que será enviado
    // al componente mediante la prop "productos".
    const productos: Producto[] = [
        productoPrueba
    ];


    // Creamos una función simulada para la prop
    // "onAgregarCarrito".
    //
    // En esta prueba no necesitamos ejecutarla,
    // pero DetalleProducto la necesita como prop.
    const onAgregarCarrito = () => {};


    // Renderizamos el componente dentro de MemoryRouter.
    //
    // También definimos la misma ruta que utiliza
    // nuestra aplicación: /producto/:codigo.
    //
    // Esto permite que useParams() pueda obtener
    // correctamente el código BA001.
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


    // Comprobamos que se muestra el nombre
    // del producto encontrado.
    expect(
        screen.getByRole("heading", {
            name: "Bajo Eléctrico 4 Cuerdas"
        })
    ).toBeInTheDocument();


    // Comprobamos que también se muestra
    // la marca recibida desde el objeto Producto.
    expect(
        screen.getByText("Fender")
    ).toBeInTheDocument();


    // Comprobamos que se muestra la categoría
    // recibida desde el objeto Producto.
    expect(
        screen.getByText("Bajos Eléctricos")
    ).toBeInTheDocument();


    // Comprobamos que se muestra el stock
    // correspondiente al producto.
    expect(
        screen.getByText("Stock: 5")
    ).toBeInTheDocument();


    // Comprobamos que se muestra el precio
    // correspondiente al producto.
    expect(
        screen.getByText("Precio: $599.990")
    ).toBeInTheDocument();

});


// PRUEBA 2
// Comprueba que al presionar el botón "Agregar al carrito",
// DetalleProducto llama correctamente a la función
// onAgregarCarrito recibida mediante props.

test("DetalleProducto llama a onAgregarCarrito al agregar un producto", () => {

    // Creamos un producto de prueba.
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


    // Creamos el arreglo de productos que
    // entregaremos mediante props.
    const productos: Producto[] = [
        productoPrueba
    ];


    // Creamos una función simulada.
    //
    // vi.fn() nos permite comprobar posteriormente
    // si la función fue llamada y con qué argumentos.
    const onAgregarCarrito = vi.fn();


    // Simulamos la función alert para evitar
    // que interfiera durante la prueba.
    vi.spyOn(window, "alert")
        .mockImplementation(() => {});


    // Renderizamos el componente dentro de la ruta
    // que utiliza DetalleProducto.
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


    // Buscamos el botón que permite agregar
    // el producto al carrito.
    const botonAgregar =
        screen.getByRole("button", {
            name: /Agregar al carrito/i
        });


    // Simulamos el clic del usuario.
    fireEvent.click(botonAgregar);


    // Comprobamos que la función recibida mediante props
    // fue llamada con el código del producto
    // y la cantidad inicial seleccionada.
    expect(
        onAgregarCarrito
    ).toHaveBeenCalledWith(
        "BA001",
        1
    );


    // Comprobamos que la función fue llamada
    // exactamente una vez.
    expect(
        onAgregarCarrito
    ).toHaveBeenCalledTimes(1);


    // Comprobamos que se mostró el mensaje
    // correspondiente al producto agregado.
    expect(
        window.alert
    ).toHaveBeenCalledWith(
        '"Bajo Eléctrico 4 Cuerdas" fue agregado al carrito.'
    );

});