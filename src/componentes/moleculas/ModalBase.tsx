
import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalBaseProps {
  titulo: string;

  onCerrar: () => void;

  pie: ReactNode;

  children: ReactNode;
}

function ModalBase({ titulo, onCerrar, pie, children }: ModalBaseProps) {
  useEffect(() => {
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const alPresionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        onCerrar();
      }
    };

    document.addEventListener("keydown", alPresionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;

      document.removeEventListener("keydown", alPresionarTecla);
    };
  }, [onCerrar]);

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalBaseTitulo"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalBaseTitulo">
                {titulo}
              </h5>

              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onCerrar}
              ></button>
            </div>

            <div className="modal-body">{children}</div>

            <div className="modal-footer">{pie}</div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ModalBase;
