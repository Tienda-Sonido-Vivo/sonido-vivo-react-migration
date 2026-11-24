import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import CampoFormulario from "../moleculas/CampoFormulario";
import type { Usuario } from "../../interfaces/Usuario";

interface FormularioLoginProps {
  onIniciarSesion: (email: string, clave: string) => Promise<Usuario>;
  usuarios?: Usuario[];
}

function FormularioLogin({ onIniciarSesion }: FormularioLoginProps) {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [enviando, setEnviando] = useState(false);
  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const correoLimpio = correo.trim().toLowerCase();

    if (!correoLimpio || !clave) {
      alert("Completa el correo y la contraseña.");
      return;
    }
    if (correoLimpio.length > 100) {
      alert("El correo debe tener como máximo 100 caracteres.");
      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correoLimpio)) {
      alert("El correo no tiene un formato válido. Ejemplo: nombre@correo.cl");
      return;
    }

    if (clave.length < 4 || clave.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    setEnviando(true);

    try {
      const usuario = await onIniciarSesion(correoLimpio, clave);

      if (usuario.rol === "Administrador" || usuario.rol === "Vendedor") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Correo o clave incorrectos.");
    } finally {
      setEnviando(false);
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
        maximoCaracteres={100}
      />

      <CampoFormulario
        etiqueta="Contraseña"
        tipo="password"
        nombre="clave"
        valor={clave}
        alCambiar={setClave}
        longitudMinima={4}
        maximoCaracteres={10}
      />

      <div className="d-grid gap-2 mt-4">
        <button
          type="submit"
          className="btn text-white btn-lg"
          style={{ backgroundColor: "#005f7f" }}
          disabled={enviando}
        >
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </form>
  );
}

export default FormularioLogin;
