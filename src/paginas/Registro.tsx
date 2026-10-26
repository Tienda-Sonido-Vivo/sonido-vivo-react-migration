
import { Link } from "react-router-dom";

import FormularioRegistro from "../componentes/organismos/FormularioRegistro";

import type { Usuario } from "../interfaces/Usuario";

interface RegistroProps {
  usuarios: Usuario[];
  onRegistrarUsuario: (usuario: Usuario) => void;
}

function Registro({ usuarios, onRegistrarUsuario }: RegistroProps) {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="card shadow border-0 rounded-3 p-4 p-md-5">
            <h1 className="h2 text-center fw-bold mb-2">Crear cuenta</h1>

            <p className="text-center text-muted mb-4">
              Regístrate para comprar en Sonido Vivo.
            </p>

            <FormularioRegistro
              usuarios={usuarios}
              onRegistrarUsuario={onRegistrarUsuario}
            />

            <div className="text-center mt-4">
              <p className="mb-0 text-muted">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="color-azul fw-bold">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Registro;

