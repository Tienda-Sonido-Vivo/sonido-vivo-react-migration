// Archivo ya modificado/agregado para preparar la integración. No modificar

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../atomos/Logo";
import { haySesion, obtenerRol } from "../../servicios/sesion";
import { cerrarSesionActual } from "../../servicios/authServicio";
import { obtenerCategorias } from "../../servicios/productosServicio";

function Navbar() {
  const navigate = useNavigate();

  const [sesionIniciada, setSesionIniciada] = useState(haySesion());
  const [rol, setRol] = useState(obtenerRol());

  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    obtenerCategorias()
      .then(setCategorias)
      .catch((error: unknown) => {
        console.error("No fue posible cargar las categorías.", error);
      });
  }, []);

  useEffect(() => {
    const actualizarSesion = () => {
      setSesionIniciada(haySesion());
      setRol(obtenerRol());
    };

    window.addEventListener("sesionCambiada", actualizarSesion);

    return () => {
      window.removeEventListener("sesionCambiada", actualizarSesion);
    };
  }, []);

  const salir = async () => {
    try {
      await cerrarSesionActual();
      navigate("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "No fue posible cerrar la sesión.");
    }
  };

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

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto fs-5">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">Inicio</Link>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categorías
                </a>
                <ul className="dropdown-menu">
                  {categorias.map((categoria) => (
                    <li key={categoria}>
                      <Link className="dropdown-item" to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}>
                        {categoria}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Novedades
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/novedades">Ver Novedades</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Nosotros
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/nosotros">Sobre Nosotros</Link></li>
                  <li><Link className="dropdown-item" to="/nosotros#ubicacion">Dónde Encontrarnos</Link></li>
                  <li><Link className="dropdown-item" to="/nosotros#contactos">Contáctanos</Link></li>
                  <li><Link className="dropdown-item" to="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/carrito">Carrito</Link>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Mi Cuenta
                </a>
                <ul className="dropdown-menu">
                  {!sesionIniciada ? (
                    <>
                      <li><Link className="dropdown-item" to="/login">Iniciar sesión</Link></li>
                      <li><Link className="dropdown-item" to="/registro">Registrarse</Link></li>
                    </>
                  ) : (
                    <>
                      {rol === "Cliente" && (
                        <li><Link className="dropdown-item" to="/mis-pedidos">Mis Pedidos</Link></li>
                      )}
                      {(rol === "Administrador" || rol === "Vendedor") && (
                        <li><Link className="dropdown-item" to="/admin">Panel de administración</Link></li>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button type="button" className="dropdown-item" onClick={() => void salir()}>
                          Cerrar Sesión
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;



/*

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../atomos/Logo";

function obtenerSesion() {
  return sessionStorage.getItem("usuarioLogueado") === "true";
}

function Navbar() {
  const navigate = useNavigate();

  const [sesionIniciada, setSesionIniciada] = useState(obtenerSesion());

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
    "Estudio y Grabación",
  ];


  useEffect(() => {
    const actualizarSesion = () => {
      setSesionIniciada(obtenerSesion());
    };

    window.addEventListener("sesionCambiada", actualizarSesion);

    return () => {
      window.removeEventListener("sesionCambiada", actualizarSesion);
    };
  }, []);

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuarioLogueado");
    sessionStorage.removeItem("rolUsuario");
    sessionStorage.removeItem("correoUsuario");

    setSesionIniciada(false);

    window.dispatchEvent(new Event("sesionCambiada"));

    navigate("/");
  };

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

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto fs-5">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
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
                    <Link className="dropdown-item" to="/novedades">
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
                    <Link className="dropdown-item" to="/nosotros">
                      Sobre Nosotros
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/nosotros#ubicacion">
                      Dónde Encontrarnos
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/nosotros#contactos">
                      Contáctanos
                    </Link>
                  </li>

                  <li>

                    <Link className="dropdown-item" to="/preguntas-frecuentes">
                        Preguntas Frecuentes
                    </Link>

                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/carrito">
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
                  {!sesionIniciada ? (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/login">
                          Iniciar sesión
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item" to="/registro">
                          Registrarse
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/mis-pedidos">
                          Mis Pedidos
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={cerrarSesion}
                        >
                          Cerrar Sesión
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>

          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

*/