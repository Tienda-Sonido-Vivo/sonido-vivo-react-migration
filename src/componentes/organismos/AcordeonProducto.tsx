import { useState } from "react";
import type { Producto } from "../../interfaces/Producto";

interface AcordeonProductoProps {
    producto: Producto;
}

function AcordeonProducto({
    producto
}: AcordeonProductoProps) {

    const [seccionAbierta, setSeccionAbierta] =
        useState("descripcion");

    const cambiarSeccion = (seccion: string) => {

        if (seccionAbierta === seccion) {
            setSeccionAbierta("");
        } else {
            setSeccionAbierta(seccion);
        }

    };

    return (

        <div className="mt-5">

            <div className="accordion" id="productInformation">

                {/* DESCRIPCIÓN */}

                <div className="accordion-item">

                    <h2 className="accordion-header">

                        <button
                            className={`accordion-button ${
                                seccionAbierta !== "descripcion"
                                    ? "collapsed"
                                    : ""
                            }`}
                            type="button"
                            onClick={() =>
                                cambiarSeccion("descripcion")
                            }
                        >
                            <strong>Descripción</strong>
                        </button>

                    </h2>

                    {seccionAbierta === "descripcion" && (

                        <div className="accordion-collapse">

                            <div className="accordion-body">

                                <p>
                                    {producto.descripcion}
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* ESPECIFICACIONES */}

                <div className="accordion-item">

                    <h2 className="accordion-header">

                        <button
                            className={`accordion-button ${
                                seccionAbierta !== "especificaciones"
                                    ? "collapsed"
                                    : ""
                            }`}
                            type="button"
                            onClick={() =>
                                cambiarSeccion("especificaciones")
                            }
                        >
                            <strong>Especificaciones</strong>
                        </button>

                    </h2>

                    {seccionAbierta === "especificaciones" && (

                        <div className="accordion-collapse">

                            <div className="accordion-body">

                                <div className="row">

                                    <div className="col-12 col-md-6">

                                        <ul className="list-group list-group-flush">

                                            <li className="list-group-item">

                                                <strong>Marca:</strong>{" "}
                                                {producto.marca}

                                            </li>

                                            <li className="list-group-item">

                                                <strong>Modelo:</strong>{" "}
                                                {producto.modelo}

                                            </li>

                                            <li className="list-group-item">

                                                <strong>Categoría:</strong>{" "}
                                                {producto.categoria}

                                            </li>

                                        </ul>

                                    </div>

                                    <div className="col-12 col-md-6">

                                        <ul className="list-group list-group-flush">

                                            <li className="list-group-item">

                                                <strong>Stock:</strong>{" "}
                                                {producto.stock}

                                            </li>

                                        </ul>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </div>


                {/* DESPACHO */}

                <div className="accordion-item">

                    <h2 className="accordion-header">

                        <button
                            className={`accordion-button ${
                                seccionAbierta !== "despacho"
                                    ? "collapsed"
                                    : ""
                            }`}
                            type="button"
                            onClick={() =>
                                cambiarSeccion("despacho")
                            }
                        >
                            <strong>
                                Información de despacho y retiro
                            </strong>
                        </button>

                    </h2>

                    {seccionAbierta === "despacho" && (

                        <div className="accordion-collapse">

                            <div className="accordion-body">

                                <p>
                                    Puedes solicitar despacho a tu domicilio
                                    o seleccionar retiro en nuestra tienda.
                                </p>

                                <p className="mb-0">
                                    Los puntos de retiro disponibles se mostrarán
                                    durante el proceso de compra.
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default AcordeonProducto;