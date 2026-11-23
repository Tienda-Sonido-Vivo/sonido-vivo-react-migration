import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import CampoFormulario from "../componentes/moleculas/CampoFormulario";
import { completarActivacion } from "../servicios/authServicio";

function ActivarCuenta() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenInicial = searchParams.get("token") ?? "";

  const [token, setToken] = useState(tokenInicial);
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje("");

    if (!token.trim()) {
      setMensaje("Ingresa el token de activación entregado por el administrador.");
      return;
    }

    if (nuevaClave.length < 4 || nuevaClave.length > 10) {
      setMensaje("La nueva contraseña debe tener entre 4 y 10 caracteres. Ejemplo válido: demo123.");
      return;
    }

    if (nuevaClave !== confirmarClave) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    setProcesando(true);

    try {
      await completarActivacion(token.trim(), nuevaClave);
      setMensaje("Cuenta activada correctamente.");
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "No fue posible activar la cuenta.",
      );
    } finally {
      setProcesando(false);
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow p-4 p-md-5">
            <h1 className="h2 text-center fw-bold mb-2">Activar cuenta</h1>
            <p className="text-center text-muted mb-4">
              Ingresa el token recibido y crea una contraseña nueva.
            </p>

            {mensaje && (
              <div
                className="alert alert-info"
                role="status"
                aria-live="polite"
              >
                {mensaje}
              </div>
            )}

            <form onSubmit={manejarEnvio} noValidate>
              <CampoFormulario
                etiqueta="Token de activación"
                tipo="text"
                nombre="token"
                valor={token}
                alCambiar={setToken}
              />

              <CampoFormulario
                etiqueta="Nueva contraseña"
                tipo="password"
                nombre="nuevaClave"
                valor={nuevaClave}
                alCambiar={setNuevaClave}
                longitudMinima={4}
                maximoCaracteres={10}
              />

              <CampoFormulario
                etiqueta="Confirmar contraseña"
                tipo="password"
                nombre="confirmarClave"
                valor={confirmarClave}
                alCambiar={setConfirmarClave}
                longitudMinima={4}
                maximoCaracteres={10}
              />

              <div className="d-grid gap-2 mt-4">
                <button
                  type="submit"
                  className="btn text-white btn-lg"
                  style={{ backgroundColor: "#005f7f" }}
                  disabled={procesando}
                >
                  {procesando ? "Activando..." : "Activar cuenta"}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <Link to="/login" className="color-azul fw-bold">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ActivarCuenta;
