// src/componentes/moleculas/CampoFormulario2.tsx

import type { CampoFormulario2Props } from "../../interfaces/CampoFormulario2";

    

// Etiqueta + campo + mensaje de error
function CampoFormulario2({
  id,
  etiqueta,
  error,
  ayuda,
  children,
}: CampoFormulario2Props) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {etiqueta}
      </label>

      {children}

      {error && <div className="invalid-feedback d-block">{error}</div>}

      {!error && ayuda && <div className="form-text">{ayuda}</div>}
    </div>
  );
}

export default CampoFormulario2;
