
import { Link } from "react-router-dom";

import FormularioLogin from "../componentes/organismos/FormularioLogin";
import type { Usuario } from "../interfaces/Usuario";

interface LoginProps {
  usuarios: Usuario[];
  onIniciarSesion: (usuario: Usuario) => void;
}

function Login({ usuarios, onIniciarSesion }: LoginProps) {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow p-4 border-0 rounded-3">
            <h1 className="h2 text-center fw-bold mb-4">Iniciar Sesión</h1>

            <FormularioLogin
              usuarios={usuarios}
              onIniciarSesion={onIniciarSesion}
            />

            <div className="text-center mt-3">
              <p className="mb-0 text-muted fs-6">
                ¿No tienes una cuenta?{" "}
                <Link to="/registro" className="color-azul fw-bold">
                  Regístrate aquí
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
