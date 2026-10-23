import { useState } from "react";
import type { FormEvent } from "react";

import CampoFormulario from "../moleculas/CampoFormulario";

function FormularioContacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const mensajeLimpio = mensaje.trim();

    if (!nombreLimpio || !correoLimpio || !mensajeLimpio) {
      alert("Debe completar todos los campos.");

      return;
    }

    if (nombreLimpio.length > 100) {
      alert("El nombre debe tener máximo 100 caracteres.");

      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correoLimpio) || correoLimpio.length > 100) {
      alert("Ingrese un correo válido.");

      return;
    }

    if (mensajeLimpio.length > 500) {
      alert("El comentario debe tener máximo 500 caracteres.");

      return;
    }

    alert("¡Mensaje enviado exitosamente!");

    setNombre("");
    setCorreo("");
    setMensaje("");
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <CampoFormulario
        etiqueta="Nombre *"
        tipo="text"
        nombre="nombreContacto"
        valor={nombre}
        alCambiar={setNombre}
      />

      <CampoFormulario
        etiqueta="Correo electrónico *"
        tipo="email"
        nombre="correoContacto"
        valor={correo}
        alCambiar={setCorreo}
      />

      <CampoFormulario
        etiqueta="Comentario o mensaje *"
        tipo="text"
        nombre="mensajeContacto"
        valor={mensaje}
        alCambiar={setMensaje}
      />

      <button
        type="submit"
        className="btn text-white fw-bold"
        style={{
          backgroundColor: "#005f7f",
        }}
      >
        Enviar mensaje
      </button>
    </form>
  );
}

export default FormularioContacto;
