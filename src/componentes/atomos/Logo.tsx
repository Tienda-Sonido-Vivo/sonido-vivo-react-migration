// src/componentes/atomos/Logo.tsx

import { Link } from "react-router-dom";

function Logo() {

    return (

        <Link
            className="navbar-brand fw-bold fs-4 text-white"
            to="/"
        >
            Sonido <span className="color-azul">Vivo</span>
        </Link>

    );

}

export default Logo;