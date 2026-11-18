import { useState } from "react";
import type { FormEvent } from "react";

import CampoFormulario from "../moleculas/CampoFormulario";
import { enviarMensaje } from "../../servicios/mensajeriaServicio";

function FormularioPreguntasFrecuentes() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio) || correoLimpio.length > 100) {
      alert("Ingrese un correo válido.");
      return;
    }

    if (preguntaLimpia.length > 500) {
      alert("La pregunta no puede superar los 500 caracteres.");
      return;
    }

    setEnviando(true);

    try {
      await enviarMensaje({
        nombreCompleto: nombreLimpio,
        correo: correoLimpio,
        mensaje: preguntaLimpia,
        tipoMensaje: "PREGUNTAS_FRECUENTES",
      });

      alert("¡Pregunta enviada exitosamente!");
      setNombre("");
      setCorreo("");
      setPregunta("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo enviar la pregunta.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <CampoFormulario etiqueta="Nombre *" tipo="text" nombre="nombrePregunta" valor={nombre} alCambiar={setNombre} />
      <CampoFormulario etiqueta="Correo electrónico *" tipo="email" nombre="correoPregunta" valor={correo} alCambiar={setCorreo} />
      <CampoFormulario etiqueta="Tu pregunta *" tipo="text" nombre="pregunta" valor={pregunta} alCambiar={setPregunta} />

      <button
        type="submit"
        className="btn text-white fw-bold"
        style={{ backgroundColor: "#005f7f" }}
        disabled={enviando}
      >
        {enviando ? "Enviando..." : "Enviar pregunta"}
      </button>
    </form>
  );
}

export default FormularioPreguntasFrecuentes;
