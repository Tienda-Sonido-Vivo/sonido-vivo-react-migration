// src/componentes/moleculas/ThOrdenable.tsx

interface ThOrdenableProps {
  etiqueta: string;

  activo: boolean;

  ascendente: boolean;

  onClick: () => void;

  className?: string;
}

// Encabezado de tabla que se puede clickear para ordenar
function ThOrdenable({
  etiqueta,
  activo,
  ascendente,
  onClick,
  className,
}: ThOrdenableProps) {
  return (
    <th
      scope="col"
      className={className}
      aria-sort={activo ? (ascendente ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        className="btn btn-link p-0 border-0 text-white text-decoration-none fw-bold"
        onClick={onClick}
      >
        {etiqueta}

        {activo && (ascendente ? " ▲" : " ▼")}
      </button>
    </th>
  );
}

export default ThOrdenable;
