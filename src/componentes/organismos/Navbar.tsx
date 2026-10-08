import { Link } from "react-router-dom";
import Logo from "../atomos/Logo";
import Buscador from "../moleculas/Buscador";

function Navbar() {

    const categorias = [
        "Guitarras Acústicas",
        "Guitarras Eléctricas",
        "Bajos Eléctricos",
        "Baterías",
        "Teclados y Pianos",
        "Amplificadores de sonido",
        "Micrófonos",
        "Pedales de Efectos",
        "Accesorios",
        "Estudio y Grabación"
    ];

    return (

        <header>

            <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">

                <div className="container">

                    <Logo />

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Abrir navegación"
                    >

                        <span className="navbar-toggler-icon"></span>

                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="navbarNav"
                    >

                        <ul className="navbar-nav ms-auto fs-5">

                            <li className="nav-item">

                                <Link
                                    className="nav-link text-white"
                                    to="/"
                                >
                                    Inicio
                                </Link>

                            </li>

                            <li className="nav-item dropdown">

                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Categorías
                                </a>

                                <ul className="dropdown-menu">

                                    {categorias.map((categoria) => (

                                        <li key={categoria}>

                                            <Link
                                                className="dropdown-item"
                                                to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                                            >
                                                {categoria}
                                            </Link>

                                        </li>

                                    ))}

                                </ul>

                            </li>

                            <li className="nav-item dropdown">

                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Novedades
                                </a>

                                <ul className="dropdown-menu">

                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/novedades"
                                        >
                                            Ver Novedades
                                        </Link>

                                    </li>

                                </ul>

                            </li>

                            <li className="nav-item dropdown">

                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Nosotros
                                </a>

                                <ul className="dropdown-menu">

                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/nosotros"
                                        >
                                            Sobre Nosotros
                                        </Link>

                                    </li>

                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/nosotros#ubicacion"
                                        >
                                            Dónde Encontrarnos
                                        </Link>

                                    </li>

                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/nosotros#contactos"
                                        >
                                            Contáctanos
                                        </Link>

                                    </li>

                                </ul>

                            </li>

                            <li className="nav-item">

                                <Link
                                    className="nav-link text-white"
                                    to="/carrito"
                                >
                                    Carrito
                                </Link>

                            </li>

                            <li className="nav-item dropdown">

                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Mi Cuenta
                                </a>

                                <ul className="dropdown-menu">

                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/login"
                                        >
                                            Iniciar sesión
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/registro"
                                        >
                                            Registrarse
                                        </Link>
                                    </li>

                                </ul>

                            </li>

                        </ul>

                        <Buscador />

                    </div>

                </div>

            </nav>

        </header>

    );

}

export default Navbar;