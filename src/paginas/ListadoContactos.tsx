
/*
NOTA:

ESTA PAGINA NO CORRESPONDE AL PROYECTO ORIGINAL. ES PARTe  DEL PROYECTO FRONTEND
DE EJEMPLO QUE EL PROFESOR UTILIZÓ PARA MOSTRARNOS COMO UNA PAGINA 
PUEDE RECIBIR INFORMACIÓN DE SU RESPECTIVO BACKEND

TENEMOS QUE IMPLEMENTAR ESTA PAGINA A SONIDO VIVO. ADAPNTANDOLO A SU ESTILO.
EVIDENTEMENTE, HABRÁ QUE IMPLEMENTAR ESTA PAGINA EN ALGUNO DE LOS MENÚS
COMO EN LAS RUTAS.

SUGERIMOS QUE, PARA NUSTRO PROYECTO, SE INTEGRÉ ESTA PÁGINA EN EL MODAL DEL ADMINISTRADOR,
ES DECIR, COMO UNA OPCIÓN EN SU PANEL DE ADMINISTRACIÓN, EN SU MENÚ IZQUIERDO.

ESE MENÚ IZQUIERDO SE ENCUENTRA EN LA CARPETA COMPONENTES/ORGANISMOS
Y SE LLAMA "SiderbarAdmin"

*/

import { useEffect, useState } from "react";

interface Contacto{

    id: number;
    nombreCompleto: string;
    correo: string;
    mensaje: string;

}

function ListadoContactos(){

    const [contactos, setContactos] = useState<Contacto[]>([]);

    useEffect(() =>{

        fetch("http://localhost:8082/api/contactos")
        .then((respuesta) =>{

            if(!respuesta.ok){

                throw new Error("Error al consultar los contactos");

            }

            return respuesta.json();
        })
        .then((datos) => setContactos(datos))
        .catch(() => alert("No se pudieron cargar los contactos"));
    }, []);

    return(

        <div>
            <h2>Contactos recibidos</h2>

            {contactos.map((contacto) => (

                <div className="card p-3 mb-3" key={contacto.id}>
                    <h5>{contacto.nombreCompleto}</h5>
                    <p>{contacto.correo}</p>
                    <p>{contacto.mensaje}</p>

                </div>

            ))}
        </div>

    );

}

export default ListadoContactos;