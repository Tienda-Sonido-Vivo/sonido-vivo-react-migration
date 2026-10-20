import { useState } from "react";


function CampoFormulario() {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [comentario, setComentario] = useState("");


    const enviar = () => {

        if (
            nombre.trim() === "" ||
            correo.trim() === "" ||
            comentario.trim() === ""
        ) {

            alert("Debe completar todos los campos.");

            return;

        }


        alert("¡Mensaje enviado exitosamente!");

        setNombre("");
        setCorreo("");
        setComentario("");

    };


    return (

        <form
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
                    required
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
                    required
                    pattern="[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}"
                    title="Ingrese un correo válido, por ejemplo: ejemplo@correo.com"
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
                    required
                    value={comentario}
                    onChange={(event) =>
                        setComentario(event.target.value)
                    }
                />

            </div>


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
