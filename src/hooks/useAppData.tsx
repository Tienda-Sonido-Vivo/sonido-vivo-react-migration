// src/hooks/useAppData.ts

import {useEffect,useState} from "react";

import {productos} from "../datos/productos";

import {usuarios as usuariosIniciales} from "../datos/usuarios";

import type {ItemCarrito} from "../interfaces/ItemCarrito";

import type {Producto} from "../interfaces/Producto";

import type {Pedido} from "../interfaces/Pedido";

import type {Usuario} from "../interfaces/Usuario";

import type {DatosFormularioCheckout} from "../componentes/organismos/FormularioCheckout";


export function useAppData() {

    /*
     * USUARIOS:
     * viven en el estado React.
     *
     * NO localStorage.
     */
    const [usuarios, setUsuarios] =
        useState<Usuario[]>(
            usuariosIniciales
        );


    /*
     * CARRITO:
     * vive en React.
     */
    const [carrito, setCarrito] =
        useState<ItemCarrito[]>([]);


    /*
     * PEDIDOS:
     * viven en React.
     */
    const [pedidos, setPedidos] =
        useState<Pedido[]>([]);


    /*
     * PRODUCTOS:
     * este estado permite actualizar
     * el stock después de una compra.
     */
    const [
        productosDisponibles,
        setProductosDisponibles
    ] = useState<Producto[]>(
        productos
    );


    /*
     * Solo recuperamos de sessionStorage
     * quién tiene la sesión actual.
     */
    const [
        correoUsuario,
        setCorreoUsuario
    ] = useState(
        sessionStorage.getItem(
            "correoUsuario"
        ) ?? ""
    );


    /*
     * Actualizamos la sesión cuando
     * Login o Navbar informa un cambio.
     */
    useEffect(() => {

        const actualizarSesion = () => {

            setCorreoUsuario(
                sessionStorage.getItem(
                    "correoUsuario"
                ) ?? ""
            );

        };


        window.addEventListener(
            "sesionCambiada",
            actualizarSesion
        );


        return () => {

            window.removeEventListener(
                "sesionCambiada",
                actualizarSesion
            );

        };

    }, []);


    /*
     * LOGIN
     */
    const iniciarSesion = (
        usuario: Usuario
    ) => {

        setCorreoUsuario(
            usuario.email
        );

    };


    /*
     * REGISTRO
     */
    const registrarUsuario = (
        nuevoUsuario: Usuario
    ) => {

        setUsuarios(
            (anteriores) => [
                ...anteriores,
                nuevoUsuario
            ]
        );

    };


    /*
     * AGREGAR AL CARRITO
     */
    const agregarAlCarrito = (
        codigo: string,
        cantidad: number
    ) => {

        const producto =
            productosDisponibles.find(
                (actual) =>
                    actual.codigo === codigo
            );


        if (!producto) {
            return;
        }


        if (
            cantidad < 1 ||
            cantidad > producto.stock
        ) {

            alert(
                "La cantidad seleccionada no está disponible."
            );

            return;
        }


        setCarrito(
            (actual) => {

                const itemExistente =
                    actual.find(
                        (item) =>
                            item.codigo ===
                            codigo
                    );


                if (!itemExistente) {

                    return [
                        ...actual,
                        {
                            codigo,
                            cantidad
                        }
                    ];

                }


                const nuevaCantidad =
                    itemExistente.cantidad +
                    cantidad;


                if (
                    nuevaCantidad >
                    producto.stock
                ) {

                    alert(
                        `Solo hay ${producto.stock} unidades disponibles.`
                    );

                    return actual;

                }


                return actual.map(
                    (item) =>
                        item.codigo ===
                        codigo

                            ? {
                                ...item,
                                cantidad:
                                    nuevaCantidad
                            }

                            : item
                );

            }
        );

    };


    /*
     * CAMBIAR CANTIDAD
     */
    const cambiarCantidad = (
        codigo: string,
        cantidad: number
    ) => {

        const producto =
            productosDisponibles.find(
                (actual) =>
                    actual.codigo === codigo
            );


        if (!producto) {
            return;
        }


        const cantidadValida =
            Math.min(
                Math.max(
                    1,
                    cantidad
                ),
                producto.stock
            );


        setCarrito(
            (actual) =>
                actual.map(
                    (item) =>
                        item.codigo ===
                        codigo

                            ? {
                                ...item,
                                cantidad:
                                    cantidadValida
                            }

                            : item
                )
        );

    };


    /*
     * ELIMINAR DEL CARRITO
     */
    const eliminarDelCarrito = (
        codigo: string
    ) => {

        setCarrito(
            (actual) =>
                actual.filter(
                    (item) =>
                        item.codigo !==
                        codigo
                )
        );

    };


    /*
     * CREAR PEDIDO
     *
     * IMPORTANTE:
     * devuelve el código del pedido
     * si la compra fue exitosa.
     *
     * Devuelve null si no se pudo
     * realizar la compra.
     */
    const confirmarPedido = (
        datos: DatosFormularioCheckout
    ): string | null => {

        /*
         * Verificamos sesión y carrito.
         */
        if (
            !correoUsuario ||
            carrito.length === 0
        ) {

            return null;

        }


        /*
         * Verificación final de stock.
         */
        for (
            const item of carrito
        ) {

            const producto =
                productosDisponibles.find(
                    (actual) =>
                        actual.codigo ===
                        item.codigo
                );


            if (
                !producto ||
                item.cantidad >
                    producto.stock
            ) {

                alert(
                    `No hay suficiente stock para ${
                        producto?.nombre ??
                        item.codigo
                    }.`
                );

                return null;

            }

        }


        /*
         * Convertimos ItemCarrito
         * en ProductoPedido.
         */
        const productosPedido =
            carrito.flatMap(
                (item) => {

                    const producto =
                        productosDisponibles.find(
                            (actual) =>
                                actual.codigo ===
                                item.codigo
                        );


                    if (!producto) {
                        return [];
                    }


                    return [

                        {
                            codigo:
                                producto.codigo,

                            nombre:
                                producto.nombre,

                            precio:
                                producto.precio,

                            cantidad:
                                item.cantidad
                        }

                    ];

                }
            );


        /*
         * Calculamos subtotal.
         */
        const subtotal =
            productosPedido.reduce(
                (
                    acumulado,
                    item
                ) =>
                    acumulado +
                    item.precio *
                    item.cantidad,
                0
            );


        /*
         * Calculamos envío.
         */
        const envio =
            datos.metodoEntrega ===
            "despacho"
                ? 8990
                : 0;


        /*
         * IVA.
         */
        const iva =
            Math.round(
                subtotal *
                19 /
                119
            );


        /*
         * Generamos código del pedido.
         */
        const siguienteNumero =
            pedidos.length + 1;


        const codigoPedido =
            `PED-${String(
                siguienteNumero
            ).padStart(6, "0")}`;


        /*
         * Fecha actual.
         */
        const fechaActual =
            new Date();


        /*
         * Creamos el pedido.
         */
        const pedido: Pedido = {

            codigo:
                codigoPedido,

            fecha:
                fechaActual.toLocaleDateString(
                    "es-CL"
                ),

            fechaISO:
                fechaActual.toISOString(),

            estado:
                "Confirmado",

            productos:
                productosPedido,

            subtotal,

            envio,

            iva,

            total:
                subtotal + envio,

            metodoEntrega:
                datos.metodoEntrega,

            metodoPago:
                datos.metodoPago,

            cliente: {

                nombre:
                    datos.nombre.trim(),

                apellidos:
                    datos.apellidos.trim(),

                telefono:
                    datos.telefono.trim(),

                correo:
                    datos.correo.trim(),

                region:
                    datos.region,

                comuna:
                    datos.comuna,

                direccion:
                    datos.direccion.trim(),

                numeroVivienda:
                    datos.numeroVivienda.trim(),

                codigoPostal:
                    datos.codigoPostal.trim()

            },

            correoCliente:
                correoUsuario

        };


        /*
         * Guardamos el pedido en React.
         */
        setPedidos(
            (actuales) => [
                ...actuales,
                pedido
            ]
        );


        /*
         * ACTUALIZAR STOCK
         *
         * Restamos del stock la cantidad
         * que fue comprada.
         */
        setProductosDisponibles(
            (actuales) =>
                actuales.map(
                    (producto) => {

                        const itemComprado =
                            carrito.find(
                                (item) =>
                                    item.codigo ===
                                    producto.codigo
                            );


                        if (!itemComprado) {
                            return producto;
                        }


                        return {

                            ...producto,

                            stock:
                                producto.stock -
                                itemComprado.cantidad

                        };

                    }
                )
        );


        /*
         * El carrito queda vacío
         * después de una compra exitosa.
         */
        setCarrito([]);


        /*
         * IMPORTANTE:
         * devolvemos el código del pedido
         * para que Checkout pueda navegar
         * a la confirmación.
         */
        return codigoPedido;

    };


    /*
     * EXPONEMOS LOS DATOS Y FUNCIONES
     * PARA QUE App.tsx PUEDA UTILIZARLOS.
     */
    return {

        usuarios,

        carrito,

        pedidos,

        productosDisponibles,

        correoUsuario,

        iniciarSesion,

        registrarUsuario,

        agregarAlCarrito,

        cambiarCantidad,

        eliminarDelCarrito,

        confirmarPedido

    };

}