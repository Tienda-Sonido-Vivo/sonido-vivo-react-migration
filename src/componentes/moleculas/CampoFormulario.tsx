import { useState } from "react";


function CampoFormulario() {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [comentario, setComentario] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [enviado, setEnviado] = useState(false);


    const enviar = () => {

        setMensaje("");
        setEnviado(false);


        if (
            nombre.trim() === "" ||
            correo.trim() === "" ||
            comentario.trim() === ""
        ) {

            setMensaje("Debe completar todos los campos.");

            return;

        }


        if (nombre.length > 100) {

            setMensaje(
                "El nombre debe tener máximo 100 caracteres."
            );

            return;

        }


        const formatoCorreo =
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


        if (!formatoCorreo.test(correo) || correo.length > 100) {

            setMensaje("Ingrese un correo válido.");

            return;

        }


        if (comentario.length > 500) {

            setMensaje(
                "El comentario debe tener máximo 500 caracteres."
            );

            return;

        }


        setEnviado(true);

        setNombre("");
        setCorreo("");
        setComentario("");

    };


    return (

        <form
            noValidate
            onSubmit={(event) => {

                event.preventDefault();
                enviar();

            }}
        >

            <div className="mb-3">

                <label
                    htmlFor="nombreContacto"
                    className="form-label"
                >
                    Nombre *
                </label>

                <input
                    type="text"
                    className="form-control"
                    id="nombreContacto"
                    placeholder="Tu nombre completo"
                    maxLength={100}
                    value={nombre}
                    onChange={(event) =>
                        setNombre(event.target.value)
                    }
                />

            </div>


            <div className="mb-3">

                <label
                    htmlFor="correoContacto"
                    className="form-label"
                >
                    Correo electrónico *
                </label>

                <input
                    type="email"
                    className="form-control"
                    id="correoContacto"
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
                    htmlFor="mensajeContacto"
                    className="form-label"
                >
                    Comentario o mensaje *
                </label>

                <textarea
                    className="form-control"
                    id="mensajeContacto"
                    rows={4}
                    placeholder="Escribe tu consulta aquí..."
                    maxLength={500}
                    value={comentario}
                    onChange={(event) =>
                        setComentario(event.target.value)
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


            {enviado && (

                <div
                    className="alert alert-success"
                    role="status"
                >
                    ¡Mensaje enviado exitosamente!
                </div>

            )}


            <button
                type="submit"
                className="btn text-white fw-bold"
                style={{
                    backgroundColor: "#005f7f"
                }}
            >
                Enviar mensaje
            </button>

        </form>

    );

}


export default CampoFormulario;
