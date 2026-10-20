// src/componentes/organismos/FormularioLogin.tsx

import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import CampoFormulario from "../moleculas/CampoFormulario";
import type { Usuario } from "../../interfaces/Usuario";

interface FormularioLoginProps {
    usuarios: Usuario[];
    onIniciarSesion: (usuario: Usuario) => void;
}

function FormularioLogin({
    usuarios,
    onIniciarSesion
}: FormularioLoginProps) {

    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");

    const manejarEnvio = (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        const correoLimpio = correo.trim().toLowerCase();

        if (!correoLimpio || !clave.trim()) {

            alert(
                "Debe completar todos los campos."
            );

            return;
        }

        const formatoCorreo =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(correoLimpio)) {

            alert(
                "Ingrese un correo válido."
            );

            return;
        }

        if (clave.length < 4 || clave.length > 10) {

            alert(
                "La clave debe tener entre 4 y 10 caracteres."
            );

            return;
        }

        const usuario = usuarios.find(
            (usuarioActual) =>
                usuarioActual.email.toLowerCase() ===
                    correoLimpio &&
                usuarioActual.clave === clave &&
                usuarioActual.estado === "Activo"
        );

        if (!usuario) {

            alert(
                "Correo o clave incorrectos, o usuario inactivo."
            );

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

        sessionStorage.setItem(
            "correoUsuario",
            usuario.email
        );

        onIniciarSesion(usuario);

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

        <form
            onSubmit={manejarEnvio}
            noValidate
        >

            <CampoFormulario
                etiqueta="Correo Electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                alCambiar={setCorreo}
            />

            <CampoFormulario
                etiqueta="Contraseña"
                tipo="password"
                nombre="clave"
                valor={clave}
                alCambiar={setClave}
            />

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
    );
}

export default FormularioLogin;


/*
// src/componentes/organismos/FormularioLogin.tsx

import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import CampoFormulario from "../moleculas/CampoFormulario";
import { usuarios } from "../../datos/usuarios";


function FormularioLogin() {

    const navigate = useNavigate();

    // Estados para guardar los datos ingresados
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");


    // Valida los datos e inicia la sesión
    const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {

        // Evita que el formulario recargue la página
        event.preventDefault();


        // Validación de campos obligatorios
        if (correo.trim() === "" || clave.trim() === "") {

            alert("Debe completar todos los campos.");
            return;

        }


        // Validación del formato del correo electrónico
        const formatoCorreo =
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!formatoCorreo.test(correo)) {

            alert("Ingrese un correo válido.");
            return;

        }


        // Validación de la longitud de la contraseña
        if (clave.length < 4 || clave.length > 10) {

            alert(
                "La clave debe tener entre 4 y 10 caracteres."
            );

            return;

        }


        // Busca un usuario con el correo y la clave ingresados
        const usuario = usuarios.find(
            (usuario) =>
                usuario.email === correo &&
                usuario.clave === clave
        );


        // Si no existe una coincidencia, muestra un mensaje
        if (!usuario) {

            alert("Correo o clave incorrectos.");
            return;

        }


        // Guarda la información de la sesión
        sessionStorage.setItem(
            "usuarioLogueado",
            "true"
        );

        sessionStorage.setItem(
            "rolUsuario",
            usuario.rol
        );


        // Notifica al resto de la aplicación que cambió la sesión
        window.dispatchEvent(
            new Event("sesionCambiada")
        );


        // Redirige según el rol del usuario
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

        <form onSubmit={manejarEnvio} noValidate>

            <CampoFormulario
                etiqueta="Correo Electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                alCambiar={setCorreo}
            />


            <CampoFormulario
                etiqueta="Contraseña"
                tipo="password"
                nombre="clave"
                valor={clave}
                alCambiar={setClave}
            />


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

    );

}


export default FormularioLogin;

*/