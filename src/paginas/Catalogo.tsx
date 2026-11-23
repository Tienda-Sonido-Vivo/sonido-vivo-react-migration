import { useSearchParams } from "react-router-dom";

import type { Producto } from "../interfaces/Producto";
import CardProducto from "../componentes/moleculas/CardProducto";
import TituloSeccion from "../componentes/atomos/TituloSeccion";

interface CatalogoProps {
  productos?: Producto[];
  cargando?: boolean;
}

function Catalogo({ productos: productosDisponibles = [], cargando = false }: CatalogoProps) {
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get("categoria");

  const productosFiltrados = categoria
    ? productosDisponibles.filter((producto) => producto.categoria === categoria)
    : productosDisponibles;

  if (cargando) {
    return (
      <main className="container mt-4 mb-5">
        <TituloSeccion>{categoria || "Catálogo de productos"}</TituloSeccion>
        <p className="text-center text-muted py-4">Cargando productos...</p>
      </main>
    );
  }

  return (
    <main className="container mt-4 mb-5">
      <section>
        <TituloSeccion>{categoria || "Catálogo de productos"}</TituloSeccion>

        <hr />

        {cargando ? (
          <p className="text-center text-muted py-4">Cargando catálogo...</p>
        ) : productosFiltrados.length > 0 ? (
          <div className="row g-4">
            {productosFiltrados.map((producto) => (
              <CardProducto key={producto.codigo} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="alert alert-warning">
            No se encontraron productos
            {categoria && (
              <>
                {" "}
                en la categoría <strong>{categoria}</strong>
              </>
            )}
            .
          </div>
        )}
      </section>
    </main>
  );
}

export default Catalogo;
