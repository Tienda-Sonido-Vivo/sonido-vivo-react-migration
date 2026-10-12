import { useSearchParams } from "react-router-dom";

import { productos } from "../data/productos";

import CardProducto from "../components/molecules/CardProducto";
import TituloSeccion from "../components/atoms/TituloSeccion";


function Catalogo() {

    const [searchParams] = useSearchParams();

    const categoria = searchParams.get("categoria");


    const productosFiltrados = categoria
        ? productos.filter(
            (producto) => producto.categoria === categoria
        )
        : productos;


    return (

        <main className="container mt-4 mb-5">

            <section>

                <TituloSeccion>
                    {categoria || "Catálogo de productos"}
                </TituloSeccion>

                <hr />

                {productosFiltrados.length > 0 ? (

                    <div className="row g-4">

                        {productosFiltrados.map((producto) => (

                            <CardProducto
                                key={producto.codigo}
                                producto={producto}
                            />

                        ))}

                    </div>

                ) : (

                    <div className="alert alert-warning">

                        No se encontraron productos
                        {categoria && (
                            <>
                                {" "}en la categoría{" "}
                                <strong>{categoria}</strong>
                            </>
                        )}.

                    </div>

                )}

            </section>

        </main>

    );

}

export default Catalogo;