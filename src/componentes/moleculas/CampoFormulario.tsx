import { useState } from "react";
import type { FormEvent } from "react";

type Props = {
    etiqueta: string;
    tipo: string;
    nombre: string;
    valor : string;
    alCambiar: (valor : string) => void;
    filas?: number;
    maxLength?: number;
};

function CampoFormulario({etiqueta, tipo, nombre, valor, alCambiar, filas = 4, maxLength}: Props) {

    return(
        <div className="mb-3">

            <label
                htmlFor={nombre}
                className="form-label"
            >
                {etiqueta}
            </label>

            {tipo === "textarea" ? (

                <textarea
                    className="form-control"
                    id={nombre}
                    name={nombre}
                    rows={filas}
                    maxLength={maxLength}
                    value={valor}
                    onChange={(event) =>
                        alCambiar(event.target.value)
                    }
                />

            ) : (

                <input
                    className="form-control"
                    type={tipo}
                    id={nombre}
                    name={nombre}
                    value={valor}
                    onChange={(event) =>
                        alCambiar(event.target.value)
                    }
                />

            )}

        </div>
    );
}

type FormularioConsultaProps = {
    prefijo: string;
    etiquetaMensaje: string;
    textoBoton: string;
    mensajeExito: string;
    mensajeLimite: string;
};

function FormularioConsulta({
    prefijo,
    etiquetaMensaje,
    textoBoton,
    mensajeExito,
    mensajeLimite
}: FormularioConsultaProps) {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");

    const manejarEnvio = (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        const nombreLimpio = nombre.trim();
        const correoLimpio = correo.trim().toLowerCase();
        const mensajeLimpio = mensaje.trim();

        if (
            !nombreLimpio ||
            !correoLimpio ||
            !mensajeLimpio
        ) {

            alert(
                "Debe completar todos los campos."
            );

            return;
        }

        if (nombreLimpio.length > 100) {

            alert(
                "El nombre debe tener máximo 100 caracteres."
            );

            return;
        }

        const formatoCorreo =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !formatoCorreo.test(correoLimpio) ||
            correoLimpio.length > 100
        ) {

            alert(
                "Ingrese un correo válido."
            );

            return;
        }

        if (mensajeLimpio.length > 500) {

            alert(mensajeLimite);

            return;
        }

        alert(mensajeExito);

        setNombre("");
        setCorreo("");
        setMensaje("");
    };

    return (

        <form
            onSubmit={manejarEnvio}
            noValidate
        >

            <CampoFormulario
                etiqueta="Nombre *"
                tipo="text"
                nombre={`nombre${prefijo}`}
                valor={nombre}
                alCambiar={setNombre}
            />

            <CampoFormulario
                etiqueta="Correo electrónico *"
                tipo="email"
                nombre={`correo${prefijo}`}
                valor={correo}
                alCambiar={setCorreo}
            />

            <CampoFormulario
                etiqueta={etiquetaMensaje}
                tipo="textarea"
                nombre={`mensaje${prefijo}`}
                valor={mensaje}
                alCambiar={setMensaje}
                filas={4}
                maxLength={500}
            />

            <button
                type="submit"
                className="btn text-white fw-bold"
                style={{
                    backgroundColor: "#005f7f"
                }}
            >
                {textoBoton}
            </button>

        </form>
    );
}

export function FormularioContacto() {

    return (

        <FormularioConsulta
            prefijo="Contacto"
            etiquetaMensaje="Comentario o mensaje *"
            textoBoton="Enviar mensaje"
            mensajeExito="¡Mensaje enviado exitosamente!"
            mensajeLimite="El comentario debe tener máximo 500 caracteres."
        />
    );
}

export function FormularioPregunta() {

    return (

        <FormularioConsulta
            prefijo="Pregunta"
            etiquetaMensaje="Tu pregunta *"
            textoBoton="Enviar pregunta"
            mensajeExito="¡Pregunta enviada exitosamente!"
            mensajeLimite="La pregunta debe tener máximo 500 caracteres."
        />
    );
}

export default CampoFormulario;
