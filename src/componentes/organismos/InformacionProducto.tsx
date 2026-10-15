import type { Producto } from "../../interfaces/Producto";
import SelectorCantidad from "../moleculas/SelectorCantidad";

interface InformacionProductoProps {
    producto: Producto;
    cantidad: number;
    onAumentar: () => void;
    onDisminuir: () => void;
    onAgregarCarrito: () => void;
}

function InformacionProducto({
    producto,
    cantidad,
    onAumentar,
    onDisminuir,
    onAgregarCarrito
}: InformacionProductoProps) {

    return (

        <div className="card shadow-sm border-0">

            <div className="card-body p-4">

                <div className="row g-5 align-items-center">

                    <div className="col-12 col-md-6">

                        <img
                            src={producto.imagen}
                            className="img-fluid rounded"
                            alt={producto.nombre}
                        />

                    </div>

                    <div className="col-12 col-md-6">

                        <p className="text-muted mb-1">
                            {producto.marca}
                        </p>

                        <h1 className="display-6 fw-bold">
                            {producto.nombre}
                        </h1>

                        <p className="text-secondary">
                            {producto.categoria}
                        </p>

                        <span className="badge text-bg-success mb-3">
                            Stock: {producto.stock}
                        </span>

                        <h2 className="fw-bold mb-4">
                            Precio: ${producto.precio.toLocaleString("es-CL")}
                        </h2>

                        <p className="mb-4">
                            {producto.descripcion}
                        </p>

                        <SelectorCantidad
                            cantidad={cantidad}
                            stock={producto.stock}
                            onAumentar={onAumentar}
                            onDisminuir={onDisminuir}
                        />

                        <div className="d-grid gap-2 d-md-flex">

                            <button
                                type="button"
                                className="btn btn-primary btn-lg flex-grow-1"
                                onClick={onAgregarCarrito}
                            >
                                🛒 Agregar al carrito
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default InformacionProducto;