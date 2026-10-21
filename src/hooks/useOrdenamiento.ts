// src/hooks/useOrdenamiento.ts

import { useMemo, useState } from "react";

interface Orden<T> {
  campo: keyof T;

  ascendente: boolean;
}

// Ordena un arreglo por cualquier campo sin modificar el original
export function useOrdenamiento<T>(datos: T[]) {
  const [orden, setOrden] = useState<Orden<T> | null>(null);

  const ordenados = useMemo(() => {
    if (orden === null) {
      return datos;
    }

    const copia = [...datos];

    copia.sort((a, b) => {
      const valorA = a[orden.campo];
      const valorB = b[orden.campo];

      let resultado: number;

      if (typeof valorA === "number" && typeof valorB === "number") {
        resultado = valorA - valorB;
      } else {
        resultado = String(valorA ?? "").localeCompare(
          String(valorB ?? ""),
          "es",
        );
      }

      return orden.ascendente ? resultado : -resultado;
    });

    return copia;
  }, [datos, orden]);

  // Primer clic: ascendente. Segundo clic en la misma columna: descendente.
  const alternarOrden = (campo: keyof T) => {
    setOrden((anterior) => {
      if (anterior !== null && anterior.campo === campo) {
        return { campo, ascendente: !anterior.ascendente };
      }

      return { campo, ascendente: true };
    });
  };

  return { ordenados, orden, alternarOrden };
}
