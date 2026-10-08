// src/componentes/atomos/TituloSeccion.tsx

interface TituloSeccionProps {
    children: string;
}

function TituloSeccion({ children }: TituloSeccionProps) {

    return (
        <h2 className="color-azul">
            <strong>{children}</strong>
        </h2>
    );

}

export default TituloSeccion;