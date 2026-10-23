import { useState } from "react";
import { Link } from "react-router-dom";

import FormularioPreguntasFrecuentes from "../componentes/organismos/FormularioPreguntasFrecuentes";

type Pregunta = {
    pregunta: string;
    respuesta: string;
    enlace?: {
        texto: string;
        ruta: string;
    };
};


const preguntas: Pregunta[] = [
    {
        pregunta: "¿Hacen envíos a todo Chile?",
        respuesta: "Sí, realizamos envíos rápidos y seguros a todo Chile."
    },
    {
        pregunta: "¿Tienen servicio técnico?",
        respuesta: "Sí, contamos con servicio técnico de reparación de instrumentos de cuerda, con calibración y mantenimiento integral.",
        enlace: {
            texto: "Lee nuestros consejos de mantenimiento",
            ruta: "/novedades/reparacion"
        }
    },
    {
        pregunta: "¿Cada cuánto debo cambiar las cuerdas?",
        respuesta: "Se recomienda cambiarlas cada 2 a 3 meses para conservar una afinación estable y un tono brillante."
    },
    {
        pregunta: "¿Cómo elijo mi primera guitarra?",
        respuesta: "Debes considerar el tamaño, los materiales, la comodidad y el tipo de cuerdas.",
        enlace: {
            texto: "Lee la guía completa",
            ruta: "/novedades/guitarra"
        }
    },
    {
        pregunta: "¿Dónde están ubicados?",
        respuesta: "Estamos en Viña del Mar, Libertad 1055, Región de Valparaíso.",
        enlace: {
            texto: "Ver el mapa",
            ruta: "/nosotros#ubicacion"
        }
    },
    {
        pregunta: "¿Cómo puedo contactarlos?",
        respuesta: "Por WhatsApp al +56 9 1234 5678 o al correo info@tiendavivo.com. También puedes usar el formulario de contacto.",
        enlace: {
            texto: "Ir al formulario de contacto",
            ruta: "/nosotros#contactos"
        }
    }
];


function PreguntasFrecuentes() {

    const [abierta, setAbierta] = useState<number | null>(0);

    return (

        <main className="container my-5">

            <div className="text-center mb-5">

                <h1 className="fw-bold color-azul">
                    Preguntas Frecuentes
                </h1>

                <p className="lead text-muted">
                    Resolvemos las dudas más comunes de nuestros clientes.
                </p>

            </div>


            <div className="row g-5">

                <div className="col-12 col-lg-7">

                    <div className="accordion">

                        {preguntas.map((item, indice) => {

                            const estaAbierta = abierta === indice;

                            return (

                                <div
                                    className="accordion-item"
                                    key={item.pregunta}
                                >

                                    <h2 className="accordion-header">

                                        <button
                                            type="button"
                                            className={`accordion-button ${estaAbierta ? "" : "collapsed"}`}
                                            aria-expanded={estaAbierta}
                                            onClick={() =>
                                                setAbierta(
                                                    estaAbierta ? null : indice
                                                )
                                            }
                                        >
                                            {item.pregunta}
                                        </button>

                                    </h2>


                                    <div
                                        className={`accordion-collapse collapse ${estaAbierta ? "show" : ""}`}
                                    >

                                        <div className="accordion-body">

                                            <p className="mb-2">
                                                {item.respuesta}
                                            </p>

                                            {item.enlace && (

                                                <Link
                                                    to={item.enlace.ruta}
                                                    className="color-azul fw-bold"
                                                >
                                                    {item.enlace.texto} &raquo;
                                                </Link>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>


                <div className="col-12 col-lg-5">

                    <div className="card shadow-sm border-0 bg-light p-4">

                        <h3 className="fw-bold mb-3">
                            ¿No encontraste tu respuesta?
                        </h3>

                        <p className="text-muted">
                            Escríbenos tu pregunta y te responderemos a tu correo.
                        </p>


                        <FormularioPreguntasFrecuentes />

                    </div>

                </div>

            </div>

        </main>

    );

}


export default PreguntasFrecuentes;
