import CarruselPrincipal from "../componentes/organismos/CarruselPrincipal";
import TituloSeccion from "../componentes/atomos/TituloSeccion";
import CardProducto from "../componentes/moleculas/CardProducto";
import type { Producto } from "../interfaces/Producto";

interface InicioProps {
  productos: Producto[];
  cargando: boolean;
}

function Inicio({ productos, cargando }: InicioProps) {
  return (
    <>
      <CarruselPrincipal />

      <main>
        <section className="seccion-principal container mt-4">
          <h1 className="color-azul text-center">
            <strong>Sección Principal</strong>
          </h1>

          <hr />

          <p className="color-azul">
            El presente sitio web corresponde a nuestro proyecto del caso
            semestral asignado por la asignatura de Fullstack II, en donde se
            ponen a prueba nuestras habilidades y conocimientos con respecto a
            HTML y CSS, así como también con Bootstrap y Javascript. Este
            proyecto corresponde a una tienda de artículos de música y sonido
            ubicada en Viña del Mar que desea expandirse al mercado digital por
            medio de su propia plataforma de comercio electrónico para la venta
            en línea de sus productos.
          </p>

          <div className="text-center container mt-4">
            <img
              src="/img/carruseles/SonidoVivoPortada1.jpeg"
              className="imagen-principal img-fluid"
              alt="Imagen introductoria del proyecto"
            />
          </div>

          <hr />
        </section>

        <section className="container mt-4">
          <TituloSeccion>Productos más destacados</TituloSeccion>

          {cargando ? (
            <p className="text-center text-muted py-4">Cargando productos...</p>
          ) : productos.length > 0 ? (
            <div className="row g-4">
              {productos.map((producto) => (
                <CardProducto key={producto.codigo} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="alert alert-warning">
              No fue posible cargar los productos del catálogo.
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Inicio;



/*
import CarruselPrincipal from "../componentes/organismos/CarruselPrincipal";
import TituloSeccion from "../componentes/atomos/TituloSeccion";
import CardProducto from "../componentes/moleculas/CardProducto";
import { productos } from "../datos/productos";

function Inicio() {
  return (
    <>
      <CarruselPrincipal />

      <main>
        <section className="seccion-principal container mt-4">
          <h1 className="color-azul text-center">
            <strong>Sección Principal</strong>
          </h1>

          <hr />

          <p className="color-azul">
            El presente sitio web corresponde a nuestro proyecto del caso
            semestral asignado por la asignatura de Fullstack II, en donde se
            ponen a prueba nuestras habilidades y conocimientos con respecto a
            HTML y CSS, así como también con Bootstrap y Javascript. Este
            proyecto corresponde a una tienda de artículos de música y sonido
            ubicada en Viña del Mar que desea expandirse al mercado digital por
            medio de su propia plataforma de comercio electrónico para la venta
            en línea de sus productos.
          </p>

          <div className="text-center container mt-4">
            <img
              src="/img/carruseles/SonidoVivoPortada1.jpeg"
              className="imagen-principal img-fluid"
              alt="Imagen introductoria del proyecto"
            />
          </div>

          <hr />
        </section>

        <section className="container mt-4">
          <TituloSeccion>Productos más destacados</TituloSeccion>

          <br />

          <div className="row g-4">
            {productos.map((producto) => (
              <CardProducto key={producto.codigo} producto={producto} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Inicio;

*/