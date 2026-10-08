import type { Producto } from "../../interfaces/Producto";
import BotonProducto from "../atomos/BotonProducto";

interface CardProductoProps {
    producto: Producto;
}

function CardProducto({ producto }: CardProductoProps) {

    return (

        <div className="col-12 col-md-6 col-xl-4">

            <div className="card h-100 w-100">

                <img
                    src={producto.imagen}
                    className="card-img-top producto-card-imagen"
                    alt={producto.nombre}
                />

                <div className="card-body text-center d-flex flex-column">

                    <h5 className="card-title">
                        {producto.nombre}
                    </h5>

                    <p className="card-text">
                        {producto.marca} | {producto.modelo}
                    </p>

                    <h3 className="card-title">
                        ${producto.precio.toLocaleString("es-CL")}
                    </h3>

                    <div className="mt-auto">

                        <BotonProducto
                            codigo={producto.codigo}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CardProducto;