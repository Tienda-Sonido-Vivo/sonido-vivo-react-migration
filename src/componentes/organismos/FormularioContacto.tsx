import { useState } from "react";
import type { FormEvent } from "react";

import CampoFormulario from "../moleculas/CampoFormulario";
import { enviarMensaje } from "../../servicios/mensajeriaServicio";

function FormularioContacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const mensajeLimpio = mensaje.trim();

    if (!nombreLimpio || !correoLimpio || !mensajeLimpio) {
      alert("Completa el nombre, el correo y el comentario.");
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

    if (mensajeLimpio.length > 500) {
      alert("El comentario debe tener máximo 500 caracteres.");
      return;
    }

    setEnviando(true);

    try {
      await enviarMensaje({
        nombreCompleto: nombreLimpio,
        correo: correoLimpio,
        mensaje: mensajeLimpio,
        tipoMensaje: "CONTACTO",
      });

      alert("¡Mensaje enviado exitosamente!");
      setNombre("");
      setCorreo("");
      setMensaje("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <CampoFormulario etiqueta="Nombre completo *" tipo="text" nombre="nombre" valor={nombre} alCambiar={setNombre} maximoCaracteres={100} />
      <CampoFormulario etiqueta="Correo electrónico" tipo="email" nombre="correo" valor={correo} alCambiar={setCorreo} maximoCaracteres={100} />
      <CampoFormulario etiqueta="Comentario *" tipo="text" nombre="mensaje" valor={mensaje} alCambiar={setMensaje} maximoCaracteres={500} />

      <button
        type="submit"
        className="btn text-white fw-bold"
        style={{ backgroundColor: "#005f7f" }}
        disabled={enviando}
      >
        {enviando ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}

export default FormularioContacto;
