// src/paginas/admin/InicioAdmin.tsx

import { Link } from "react-router-dom";

import { enlacesAdmin } from "../../datos/menuAdmin";
import { obtenerRol } from "../../services/sesion";


function InicioAdmin() {

    const rol = obtenerRol();


    const tarjetas = enlacesAdmin.filter(
        (enlace) => rol !== null && enlace.roles.includes(rol)
    );


    return (

        <>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

                <div>

                    <h1 className="mb-0">Panel de Administración</h1>

                    <p className="text-muted mb-0">
                        Bienvenido/a, gestiona tu tienda desde aquí
                    </p>

                </div>

                <span className="badge admin-badge fs-6">
                    Modo {rol}
                </span>

            </div>


            <div className="row g-4">

                {tarjetas.map((enlace) => {

                    const contenido = (

                        <div
                            className={
                                "card admin-card h-100" +
                                (enlace.disponible ? "" : " admin-card-disabled")
                            }
                        >

                            <div className="card-body">

                                <h5 className="card-title">
                                    {enlace.icono} {enlace.titulo}
                                </h5>

                                <p className="card-text text-muted">
                                    {enlace.disponible
                                        ? enlace.descripcion
                                        : "Próximamente"}
                                </p>

                            </div>

                        </div>

                    );


                    return (

                        <div
                            className="col-12 col-md-6 col-lg-4"
                            key={enlace.ruta}
                        >

                            {enlace.disponible ? (

                                <Link
                                    to={enlace.ruta}
                                    className="text-decoration-none"
                                >
                                    {contenido}
                                </Link>

                            ) : (

                                contenido

                            )}

                        </div>

                    );

                })}

            </div>

        </>

    );

}


export default InicioAdmin;
