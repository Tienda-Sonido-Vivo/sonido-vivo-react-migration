// src/paginas/Login.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usuarios } from "../datos/usuarios";


function Login() {

    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");

    const [mensaje, setMensaje] = useState("");


    const ingresar = () => {

        setMensaje("");


        if (correo.trim() === "" || clave.trim() === "") {

            setMensaje("Debe completar todos los campos.");

            return;

        }


        const formatoCorreo =
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


        if (!formatoCorreo.test(correo)) {

            setMensaje("Ingrese un correo válido.");

            return;

        }


        if (clave.length < 4 || clave.length > 10) {

            setMensaje(
                "La clave debe tener entre 4 y 10 caracteres."
            );

            return;

        }


        const usuario = usuarios.find(
            (usuario) =>
                usuario.email === correo &&
                usuario.clave === clave
        );


        if (!usuario) {

            setMensaje("Correo o clave incorrectos.");

            return;

        }


        sessionStorage.setItem(
            "usuarioLogueado",
            "true"
        );

        sessionStorage.setItem(
            "rolUsuario",
            usuario.rol
        );


        window.dispatchEvent(
            new Event("sesionCambiada")
        );


        if (
            usuario.rol === "Administrador" ||
            usuario.rol === "Vendedor"
        ) {

            navigate("/admin");

        } else {

            navigate("/");

        }

    };


    return (

        <main className="container my-5">

            <div className="row justify-content-center">

                <div className="col-12 col-md-6 col-lg-5">

                    <div className="card shadow p-4 border-0 rounded-3">

                        <h2 className="text-center fw-bold mb-4">
                            Iniciar Sesión
                        </h2>


                        <form
                            onSubmit={(event) => {

                                event.preventDefault();
                                ingresar();

                            }}
                        >

                            <div className="mb-3">

                                <label
                                    htmlFor="correo"
                                    className="form-label fw-bold"
                                >
                                    Correo Electrónico
                                </label>

                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    id="correo"
                                    placeholder="ejemplo@correo.com"
                                    maxLength={100}
                                    value={correo}
                                    onChange={(event) =>
                                        setCorreo(event.target.value)
                                    }
                                />

                            </div>


                            <div className="mb-3">

                                <label
                                    htmlFor="clave"
                                    className="form-label fw-bold"
                                >
                                    Contraseña
                                </label>

                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    id="clave"
                                    placeholder="••••••••"
                                    maxLength={10}
                                    value={clave}
                                    onChange={(event) =>
                                        setClave(event.target.value)
                                    }
                                />

                            </div>


                            {mensaje && (

                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {mensaje}
                                </div>

                            )}


                            <div className="d-grid gap-2 mt-4">

                                <button
                                    type="submit"
                                    className="btn text-white btn-lg"
                                    style={{
                                        backgroundColor: "#005f7f"
                                    }}
                                >
                                    Ingresar
                                </button>

                            </div>

                        </form>


                        <div className="text-center mt-3">

                            <p className="mb-0 text-muted fs-6">

                                ¿No tienes una cuenta?{" "}

                                <Link
                                    to="/registro"
                                    className="color-azul fw-bold"
                                >
                                    Regístrate aquí
                                </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </main>

    );

}


export default Login;