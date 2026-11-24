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
      alert("Completa el nombre, el correo y la pregunta.");
      return;
    }

    if (nombreLimpio.length > 100) {
      alert("El nombre debe tener máximo 100 caracteres.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio) || correoLimpio.length > 100) {
      alert("El correo debe tener formato válido y máximo 100 caracteres. Ejemplo: nombre@correo.cl");
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
      <CampoFormulario etiqueta="Nombre *" tipo="text" nombre="nombrePregunta" valor={nombre} alCambiar={setNombre} maximoCaracteres={100} />
      <CampoFormulario etiqueta="Correo electrónico *" tipo="email" nombre="correoPregunta" valor={correo} alCambiar={setCorreo} maximoCaracteres={100} />
      <CampoFormulario etiqueta="Tu pregunta *" tipo="text" nombre="pregunta" valor={pregunta} alCambiar={setPregunta} maximoCaracteres={500} />

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
