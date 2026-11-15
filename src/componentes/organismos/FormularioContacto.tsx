import { useState } from "react";
import type { FormEvent } from "react";

import CampoFormulario from "../moleculas/CampoFormulario";

function FormularioContacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const mensajeLimpio = mensaje.trim();

    if (!nombreLimpio || !correoLimpio || !mensajeLimpio) {
      alert("Debe completar todos los campos.");

      return;
    }

    if (nombreLimpio.length > 100) {
      alert("El nombre debe tener máximo 100 caracteres.");

      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correoLimpio) || correoLimpio.length > 100) {
      alert("Ingrese un correo válido.");

      return;
    }

    if (mensajeLimpio.length > 500) {
      alert("El comentario debe tener máximo 500 caracteres.");

      return;
    }

    alert("¡Mensaje enviado exitosamente!");

    setNombre("");
    setCorreo("");
    setMensaje("");
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <CampoFormulario
        etiqueta="Nombre *"
        tipo="text"
        nombre="nombreContacto"
        valor={nombre}
        alCambiar={setNombre}
      />

      <CampoFormulario
        etiqueta="Correo electrónico *"
        tipo="email"
        nombre="correoContacto"
        valor={correo}
        alCambiar={setCorreo}
      />

      <CampoFormulario
        etiqueta="Comentario o mensaje *"
        tipo="text"
        nombre="mensajeContacto"
        valor={mensaje}
        alCambiar={setMensaje}
      />

      <button
        type="submit"
        className="btn text-white fw-bold"
        style={{
          backgroundColor: "#005f7f",
        }}
      >
        Enviar mensaje
      </button>
    </form>
  );
}

export default FormularioContacto;


/* 

NOTA: ESTE CODIGO COMENTADO
CORRESPONDE A EL EJEMPLO DEL PROFESOR DE COMO INTEGRAR 
EL BACKEND CON LOS MICROSERVICIOS SPRING BOOT.

EN ESTE CASO, ENSEÑÓ COMO INTEGRAR UN FORMULARIO CON EL MICROSERVICIO DE SPRING BOOT

ESTE FORMULARIO SE DEBE REEMPLAZAR Y ADAPTAR.


import { useState } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";

import type { SubmitEvent } from "react";

function FormularioContacto() {

    // Estados para guardar los datos del formulario
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Permite indicar que el mensaje se esta enviando.
    const [enviando, setEnviando] = useState(false);

    //valida los datos al enviar el formulario
    const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
        
        e.preventDefault(); // permite evitar recargar la pagina

        if(enviando) return;
        
        if (nombre.trim() === "") {
            alert("Debe ingresar su nombre");
            return;
        }
        if (correo.trim() === "") {
            alert("Debe ingresar su correo electrónico.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            alert("Debe ingresar un correo electrónico válido.");
            return;
        }
        if (mensaje.trim() === "") {
            alert("Debe ingresar un mensaje.");
            return;
        }
        
        //alert("Formulario enviado correctamente.");
        
        // Comienza el envio

        setEnviando(true);

        try{
            // Envia los datos del formulario al BACKAEND SPRING BOOT
            
            const respuesta = await fetch(
                "http://localhost:8082/api/contactos",
                {

                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombreCompleto: nombre.trim(),
                        correo:correo.trim(),
                        mensaje: mensaje.trim(),

                    }),

                }
            );

            // Comprueba que el backend haya aceptado la peticion

            if(!respuesta.ok){
                
                throw new Error(`Error HTTP ${respuesta.status}`);

            }

            alert("Mensaje ENviado correctamente");
            

            // limpia los campos solo si se guardó correctamente
            setNombre("");
            setCorreo("");
            setMensaje("");
        
        }catch(error){

            console.error("Error al enviar el contacto: ", error);
            alert("No se pudo enviar el mensaje. Intente nuevamente");

        }finally{

            // Finaliza el envio y habilita nuevamente el boton
            setEnviando(false);
        }
    
    };


    return(
        <form onSubmit={manejarEnvio} noValidate>

            <CampoFormulario
                etiqueta="Nombre completo"
                tipo="text"
                nombre="nombre"
                valor={nombre}
                alCambiar={setNombre}
            />

            <CampoFormulario
                etiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                alCambiar={setCorreo}
            />

            <CampoFormulario
                etiqueta="Mensaje"
                tipo="text"
                nombre="mensaje"
                valor={mensaje}
                alCambiar={setMensaje}
            />

            <button 
                type="submit" 
                className="btn btn-primary"
                disabled={enviando}
            >
                {enviando ? "Enviando..." : "Enviar mensaje"}
            </button>

        </form>
    );

}

export default FormularioContacto;

*/