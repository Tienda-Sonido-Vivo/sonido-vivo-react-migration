// src/paginas/Checkout.tsx

import {
    Link,
    useNavigate
} from "react-router-dom";

import FormularioCheckout from "../componentes/organismos/FormularioCheckout";
import type {
    DatosFormularioCheckout
} from "../componentes/organismos/FormularioCheckout";

import ResumenCompra from "../componentes/moleculas/ResumenCompra";

import type { Producto } from "../interfaces/Producto";
import type { ItemCarrito } from "../interfaces/ItemCarrito";

interface CheckoutProps {

    carrito: ItemCarrito[];

    productos: Producto[];

    correoUsuario: string;

    onConfirmarPedido: (
        datos: DatosFormularioCheckout
    ) => void;
}

function Checkout({
    carrito,
    productos,
    correoUsuario,
    onConfirmarPedido
}: CheckoutProps) {

    const navigate = useNavigate();

    if (!correoUsuario) {

        return (

            <main className="container py-5">

                <div className="alert alert-warning">

                    Debes iniciar sesión antes
                    de finalizar la compra.

                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Iniciar sesión
                </button>

            </main>
        );
    }

    if (carrito.length === 0) {

        return (

            <main className="container py-5">

                <div className="alert alert-warning">

                    Tu carrito está vacío.
                    Agrega productos antes
                    de finalizar la compra.

                </div>

                <Link
                    to="/catalogo"
                    className="btn btn-primary"
                >
                    Ir al catálogo
                </Link>

            </main>
        );
    }

    const subtotal = carrito.reduce(
        (acumulado, item) => {

            const producto = productos.find(
                (actual) =>
                    actual.codigo === item.codigo
            );

            return (
                acumulado +
                (
                    producto
                        ? producto.precio *
                          item.cantidad
                        : 0
                )
            );

        },
        0
    );

    return (

        <main className="container my-5">

            <nav
                aria-label="breadcrumb"
                className="mb-4"
            >

                <ol className="breadcrumb">

                    <li className="breadcrumb-item">

                        <Link to="/">
                            Inicio
                        </Link>

                    </li>

                    <li className="breadcrumb-item">

                        <Link to="/carrito">
                            Carrito
                        </Link>

                    </li>

                    <li
                        className="breadcrumb-item active"
                        aria-current="page"
                    >
                        Finalizar compra
                    </li>

                </ol>

            </nav>


            <div className="mb-4">

                <h1 className="fw-bold">
                    Finalizar compra
                </h1>

                <p className="text-muted mb-0">
                    Completa tus datos y confirma tu pedido.
                </p>

            </div>


            <div className="row g-4">

                <section className="col-12 col-lg-8">

                    <FormularioCheckout
                        correoUsuario={correoUsuario}
                        onConfirmarPedido={
                            onConfirmarPedido
                        }
                    />

                </section>


                <aside className="col-12 col-lg-4">

                    <div
                        className="card shadow-sm border-0 sticky-top"
                        style={{
                            top: "20px"
                        }}
                    >

                        <div className="card-header bg-success text-white">

                            <h2 className="h5 mb-0">
                                Resumen del pedido
                            </h2>

                        </div>

                        <div className="card-body">

                            {carrito.map((item) => {

                                const producto =
                                    productos.find(
                                        (actual) =>
                                            actual.codigo ===
                                            item.codigo
                                    );

                                if (!producto) {
                                    return null;
                                }

                                return (

                                    <div
                                        key={item.codigo}
                                        className="d-flex justify-content-between mb-3 gap-3"
                                    >

                                        <div>

                                            <p className="mb-0 fw-semibold">
                                                {producto.nombre}
                                            </p>

                                            <small className="text-muted">
                                                Cantidad:{" "}
                                                {item.cantidad}
                                            </small>

                                        </div>

                                        <span className="text-end">

                                            $
                                            {(
                                                producto.precio *
                                                item.cantidad
                                            ).toLocaleString(
                                                "es-CL"
                                            )}

                                        </span>

                                    </div>

                                );

                            })}

                            <hr />

                            <ResumenCompra
                                subtotal={subtotal}
                                envio={8990}
                                mostrarEnvio
                            />

                        </div>

                    </div>

                </aside>

            </div>

        </main>
    );
}

export default Checkout;