import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import CampoFormulario from "../moleculas/CampoFormulario";
import type { Usuario } from "../../interfaces/Usuario";

interface FormularioLoginProps {
  onIniciarSesion: (email: string, clave: string) => Promise<Usuario>;
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
      alert("Debe completar todos los campos.");
      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correoLimpio)) {
      alert("Ingrese un correo válido.");
      return;
    }

    if (clave.length < 8 || clave.length > 72) {
      alert("La contraseña debe tener entre 8 y 72 caracteres.");
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
      alert(error instanceof Error ? error.message : "No fue posible iniciar sesión.");
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
