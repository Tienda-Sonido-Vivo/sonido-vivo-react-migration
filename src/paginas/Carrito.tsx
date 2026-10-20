// src/paginas/Carrito.tsx
import { Link, useNavigate } from "react-router-dom";
import type { Producto } from "../interfaces/Producto";
import type { ItemCarrito } from "../interfaces/ItemCarrito";
import ListaCarrito from "../componentes/organismos/ListaCarrito";
import ResumenCompra from "../componentes/moleculas/ResumenCompra";

interface CarritoProps {
    carrito: ItemCarrito[];
    productos: Producto[];
    onCambiarCantidad: (codigo: string, cantidad: number) => void;
    onEliminar: (codigo: string) => void;
}

function Carrito({
    carrito,
    productos,
    onCambiarCantidad,
    onEliminar
}: CarritoProps) {

    const navigate = useNavigate();

    const subtotal = carrito.reduce((acumulado, item) => {
        const producto = productos.find(
            (p) => p.codigo === item.codigo
        );

        return acumulado +
            (producto ? producto.precio * item.cantidad : 0);
    }, 0);

    const continuarCompra = () => {
        if (carrito.length === 0) {
            alert(
                "Tu carrito está vacío. Agrega al menos un producto antes de continuar."
            );
            return;
        }

        navigate("/checkout");
    };

    return (
        <main className="container py-4 py-md-5">

            <div className="mb-4">
                <h1 className="fw-bold">Carrito de compra</h1>
                <p className="text-muted mb-0">
                    Revisa tus productos antes de continuar con tu compra.
                </p>
            </div>

            <div className="row g-4">

                <section className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white py-3">
                            <h2 className="h5 mb-0 fw-bold">
                                Productos seleccionados
                            </h2>
                        </div>

                        <div className="card-body">
                            <ListaCarrito
                                carrito={carrito}
                                productos={productos}
                                onCambiarCantidad={onCambiarCantidad}
                                onEliminar={onEliminar}
                            />
                        </div>

                    </div>

                    <div className="mt-3">
                        <Link
                            to="/catalogo"
                            className="btn btn-outline-secondary"
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Seguir comprando
                        </Link>
                    </div>
                </section>

                <aside className="col-12 col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">

                            <h2 className="h5 fw-bold mb-4">
                                Resumen de compra
                            </h2>

                            <ResumenCompra subtotal={subtotal} />

                            <button
                                type="button"
                                className="btn btn-primary w-100 py-2"
                                onClick={continuarCompra}
                                disabled={carrito.length === 0}
                            >
                                Continuar compra
                                <i className="bi bi-arrow-right ms-2"></i>
                            </button>

                            <p className="text-muted small text-center mt-3 mb-0">
                                El despacho o retiro se seleccionará durante el checkout.
                            </p>

                        </div>
                    </div>
                </aside>

            </div>
        </main>
    );
}

export default Carrito;
