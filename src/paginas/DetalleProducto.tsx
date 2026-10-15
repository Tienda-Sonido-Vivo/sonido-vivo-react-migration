import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { productos } from "../datos/productos";

import InformacionProducto from "../componentes/organismos/InformacionProducto";
import AcordeonProducto from "../componentes/organismos/AcordeonProducto";

function DetalleProducto() {

    const { codigo } = useParams();

    const producto = productos.find(
        (producto) => producto.codigo === codigo
    );

    const [cantidad, setCantidad] = useState(1);


    if (!producto) {

        return (

            <main className="container mt-5 mb-5">

                <div className="alert alert-danger">

                    <h1 className="h4">
                        Producto no encontrado
                    </h1>

                    <p>
                        No existe un producto asociado al código:
                        {" "}
                        <strong>{codigo}</strong>
                    </p>

                    <Link
                        to="/"
                        className="btn btn-primary"
                    >
                        Volver al inicio
                    </Link>

                </div>

            </main>

        );

    }


    const aumentarCantidad = () => {

        if (cantidad < producto.stock) {
            setCantidad(cantidad + 1);
        }

    };


    const disminuirCantidad = () => {

        if (cantidad > 1) {
            setCantidad(cantidad - 1);
        }

    };


    const agregarAlCarrito = () => {

        /*
         * El carrito todavía no está implementado.
         *
         * Dejamos preparada esta función para conectar
         * posteriormente la lógica real del carrito.
         */

        console.log("Producto seleccionado:", producto);
        console.log("Cantidad seleccionada:", cantidad);

    };


    return (

        <main className="container mt-4 mb-5">

            <InformacionProducto
                producto={producto}
                cantidad={cantidad}
                onAumentar={aumentarCantidad}
                onDisminuir={disminuirCantidad}
                onAgregarCarrito={agregarAlCarrito}
            />

            <AcordeonProducto
                producto={producto}
            />

            <div className="mt-4">

                <Link
                    to="/"
                    className="btn btn-primary"
                >
                    Volver al Inicio
                </Link>

            </div>

        </main>

    );

}

export default DetalleProducto;