interface ResumenCompraProps {
  subtotal: number;
  envio?: number;
  mostrarEnvio?: boolean;
}

function ResumenCompra({
  subtotal,
  envio = 0,
  mostrarEnvio = false,
}: ResumenCompraProps) {
  const iva = Math.round((subtotal * 19) / 119);
  const total = subtotal + envio;

  const formatoMoneda = (valor: number) => "$" + valor.toLocaleString("es-CL");

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <span className="text-muted">Productos</span>
        <span>{formatoMoneda(subtotal)}</span>
      </div>

      {mostrarEnvio && (
        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted">Envío</span>
          <span>{formatoMoneda(envio)}</span>
        </div>
      )}

      <div className="d-flex justify-content-between mb-3">
        <span className="text-muted">IVA (incluido)</span>
        <span>{formatoMoneda(iva)}</span>
      </div>

      <hr />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold fs-5">
          {mostrarEnvio ? "Total a pagar" : "Total"}
        </span>

        <span className="fw-bold fs-4">{formatoMoneda(total)}</span>
      </div>
    </div>
  );
}

export default ResumenCompra;
