// src/componentes/moleculas/CampoConError.tsx

import type { ReactNode } from "react";


interface CampoConErrorProps {

    id: string;

    etiqueta: string;

    error?: string;

    ayuda?: string;

    children: ReactNode;

}


// Etiqueta + campo + mensaje de error
function CampoConError({
    id,
    etiqueta,
    error,
    ayuda,
    children
}: CampoConErrorProps) {

    return (

        <div className="mb-3">

            <label htmlFor={id} className="form-label fw-semibold">
                {etiqueta}
            </label>

            {children}

            {error && (

                <div className="invalid-feedback d-block">
                    {error}
                </div>

            )}

            {!error && ayuda && (

                <div className="form-text">
                    {ayuda}
                </div>

            )}

        </div>

    );

}


export default CampoConError;
