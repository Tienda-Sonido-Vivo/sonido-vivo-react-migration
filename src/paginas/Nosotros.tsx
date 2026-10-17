import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { SeccionContacto } from "./Contacto";


function Nosotros() {

    const { hash } = useLocation();


    useEffect(() => {

        if (hash) {

            document
                .getElementById(hash.slice(1))
                ?.scrollIntoView({ behavior: "smooth" });

        }

    }, [hash]);


    return (

        <main className="container my-5">

            <section className="row align-items-center mb-5">

                <div className="col-12 col-md-6">

                    <h1 className="display-5 fw-bold mb-3">
                        Sobre <span className="color-azul">Sonido Vivo</span>
                    </h1>

                    <p>
                        Somos una tienda especializada en instrumentos musicales, equipos de sonido y
                        accesorios para músicos, ubicada en <strong>Viña del Mar, Región de Valparaíso</strong>.
                        Con más de 11 años de experiencia, nos apasiona asesorar a músicos principiantes y
                        profesionales de todo Chile.
                    </p>

                    <p>
                        Contamos con un amplio catálogo de más de 340 referencias distintas que incluyen
                        guitarras, bajos, baterías, teclados, amplificadores y accesorios de las mejores marcas.
                    </p>

                </div>


                <div className="col-12 col-md-6 text-center">

                    <div
                        className="p-4 bg-light rounded shadow-sm border-start border-4"
                        style={{ borderColor: "#005f7f" }}
                    >

                        <h3 className="fw-bold color-azul mb-3">
                            Lo que nos distingue
                        </h3>

                        <ul className="list-group list-group-flush text-start">

                            <li className="list-group-item bg-transparent">
                                🎸 Catálogo amplio y actualizado con stock real.
                            </li>

                            <li className="list-group-item bg-transparent">
                                🛠️ Servicio técnico de reparación de instrumentos de cuerda.
                            </li>

                            <li className="list-group-item bg-transparent">
                                📦 Envíos rápidos y seguros a todo Chile.
                            </li>

                        </ul>

                    </div>

                </div>

            </section>


            <SeccionContacto conBorde />

        </main>

    );

}


export default Nosotros;
