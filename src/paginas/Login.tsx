import { Link } from "react-router-dom";

import FormularioLogin from "../componentes/organismos/FormularioLogin";
import type { Usuario } from "../interfaces/Usuario";

interface LoginProps {
  onIniciarSesion: (email: string, clave: string) => Promise<Usuario>;
  usuarios?: Usuario[];
}

function Login({ onIniciarSesion }: LoginProps) {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow p-4 border-0 rounded-3">
            <h1 className="h2 text-center fw-bold mb-4">Iniciar Sesión</h1>

            <FormularioLogin
              onIniciarSesion={onIniciarSesion}
            />

            <div className="text-center mt-3">
              <p className="mb-0 text-muted fs-6">
                ¿No tienes una cuenta?{" "}
                <Link to="/registro" className="color-azul fw-bold">
                  Regístrate aquí
                </Link>
              </p>
              <p className="mb-0 mt-2 text-muted fs-6">
                ¿Tienes un token de activación?{" "}
                <Link to="/activar-cuenta" className="color-azul fw-bold">
                  Activa tu cuenta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
