import Input from "../atomos/Input";

type Props = {
  etiqueta: string;
  tipo: string;
  nombre: string;
  valor: string;
  alCambiar: (valor: string) => void;
  maximoCaracteres?: number;
  longitudMinima?: number;
  marcador?: string;
};

function CampoFormulario({
  etiqueta,
  tipo,
  nombre,
  valor,
  alCambiar,
  maximoCaracteres,
  longitudMinima,
  marcador,
}: Props) {
  return (
    <div className="mb-3">
      <label className="form-label">{etiqueta}</label>

      <Input
        tipo={tipo}
        nombre={nombre}
        valor={valor}
        alCambiar={alCambiar}
        maximoCaracteres={maximoCaracteres}
        longitudMinima={longitudMinima}
        marcador={marcador}
      />
    </div>
  );
}

export default CampoFormulario;
