import type { Producto } from "../../interfaces/Producto";
import type { ItemCarrito } from "../../interfaces/ItemCarrito";
import ItemCarritoComponente from "../moleculas/ItemCarrito";

interface ListaCarritoProps {
  carrito: ItemCarrito[];
  productos: Producto[];
  onCambiarCantidad: (codigo: string, cantidad: number) => void;
  onEliminar: (codigo: string) => void;
}

function ListaCarrito({
  carrito,
  productos,
  onCambiarCantidad,
  onEliminar,
}: ListaCarritoProps) {
  if (carrito.length === 0) {
    return (
      <div className="alert alert-light text-center mb-0">
        <i className="bi bi-cart-x fs-2 d-block mb-2"></i>
        <h3 className="h5">Tu carrito está vacío</h3>
        <p className="text-muted mb-0">
          Explora nuestro catálogo y agrega los productos que te interesan.
        </p>
      </div>
    );
  }

  return (
    <div>
      {carrito.map((item) => {
        const producto = productos.find((p) => p.codigo === item.codigo);

        if (!producto) {
          return null;
        }

        return (
          <div key={item.codigo}>
            <ItemCarritoComponente
              producto={producto}
              cantidad={item.cantidad}
              onCambiarCantidad={onCambiarCantidad}
              onEliminar={onEliminar}
            />
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default ListaCarrito;
