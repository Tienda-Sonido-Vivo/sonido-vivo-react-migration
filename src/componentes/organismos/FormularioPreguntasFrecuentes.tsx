import { useState } from "react";
import type { FormEvent } from "react";

import CampoFormulario from "../moleculas/CampoFormulario";

function FormularioPreguntasFrecuentes() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pregunta, setPregunta] = useState("");

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const preguntaLimpia = pregunta.trim();

    if (!nombreLimpio || !correoLimpio || !preguntaLimpia) {
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

    if (preguntaLimpia.length > 500) {
      alert("La pregunta debe tener máximo 500 caracteres.");

      return;
    }

    alert("¡Pregunta enviada exitosamente!");

    setNombre("");
    setCorreo("");
    setPregunta("");
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <CampoFormulario
        etiqueta="Nombre *"
        tipo="text"
        nombre="nombrePregunta"
        valor={nombre}
        alCambiar={setNombre}
      />

      <CampoFormulario
        etiqueta="Correo electrónico *"
        tipo="email"
        nombre="correoPregunta"
        valor={correo}
        alCambiar={setCorreo}
      />

      <CampoFormulario
        etiqueta="Tu pregunta *"
        tipo="text"
        nombre="pregunta"
        valor={pregunta}
        alCambiar={setPregunta}
      />

      <button
        type="submit"
        className="btn text-white fw-bold"
        style={{
          backgroundColor: "#005f7f",
        }}
      >
        Enviar pregunta
      </button>
    </form>
  );
}

export default FormularioPreguntasFrecuentes;
