import type { Producto } from "../../interfaces/Producto";

interface ItemCarritoProps {
  producto: Producto;
  cantidad: number;
  onCambiarCantidad: (codigo: string, cantidad: number) => void;
  onEliminar: (codigo: string) => void;
}

function ItemCarrito({
  producto,
  cantidad,
  onCambiarCantidad,
  onEliminar,
}: ItemCarritoProps) {
  const formatoMoneda = (valor: number) => "$" + valor.toLocaleString("es-CL");

  const subtotal = producto.precio * cantidad;

  return (
    <div className="py-3">
      <div className="row align-items-center g-3">
        <div className="col-4 col-sm-3 col-md-2">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-8 col-sm-9 col-md-4">
          <h3 className="h6 fw-bold mb-1">{producto.nombre}</h3>

          <p className="text-muted small mb-1">{producto.categoria}</p>

          <span className="fw-semibold">{formatoMoneda(producto.precio)}</span>
        </div>

        <div className="col-6 col-md-3">
          <label
            className="form-label small fw-semibold mb-1"
            htmlFor={`cantidad-${producto.codigo}`}
          >
            Cantidad
          </label>

          <div className="input-group input-group-sm">
            <button
              type="button"
              className="btn btn-outline-secondary"
              aria-label="Disminuir cantidad"
              disabled={cantidad <= 1}
              onClick={() => onCambiarCantidad(producto.codigo, cantidad - 1)}
            >
              −
            </button>

            <input
              id={`cantidad-${producto.codigo}`}
              type="number"
              className="form-control text-center"
              min={1}
              max={producto.stock}
              value={cantidad}
              onChange={(e) =>
                onCambiarCantidad(producto.codigo, Number(e.target.value))
              }
            />

            <button
              type="button"
              className="btn btn-outline-secondary"
              aria-label="Aumentar cantidad"
              disabled={cantidad >= producto.stock}
              onClick={() => onCambiarCantidad(producto.codigo, cantidad + 1)}
            >
              +
            </button>
          </div>

          <small className="text-muted">
            Stock disponible: {producto.stock}
          </small>
        </div>

        <div className="col-4 col-md-2 text-md-end">
          <span className="d-block small text-muted">Subtotal</span>

          <span className="fw-bold">{formatoMoneda(subtotal)}</span>
        </div>

        <div className="col-2 col-md-1 text-end">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            title="Eliminar producto"
            aria-label={`Eliminar ${producto.nombre}`}
            onClick={() => onEliminar(producto.codigo)}
          >
            <i className="bi bi-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCarrito;
