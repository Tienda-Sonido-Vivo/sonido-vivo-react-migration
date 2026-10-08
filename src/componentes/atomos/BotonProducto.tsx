// src/componentes/atomos/BotonProducto.tsx

import { Link } from "react-router-dom";

interface BotonProductoProps {
    codigo: string;
}

function BotonProducto({ codigo }: BotonProductoProps) {

    return (

        <Link
            to={`/producto/${codigo}`}
            className="btn btn-primary"
        >
            Ver detalle
        </Link>

    );

}

export default BotonProducto;