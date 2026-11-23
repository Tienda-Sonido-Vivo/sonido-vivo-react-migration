type Props = {
  tipo: string;
  nombre: string;
  valor: string;
  alCambiar: (valor: string) => void;
  maximoCaracteres?: number;
  longitudMinima?: number;
  marcador?: string;
};

function Input({
  tipo,
  nombre,
  valor,
  alCambiar,
  maximoCaracteres,
  longitudMinima,
  marcador,
}: Props) {
  return (
    <input
      type={tipo}
      name={nombre}
      className="form-control"
      value={valor}
      maxLength={maximoCaracteres}
      minLength={longitudMinima}
      placeholder={marcador}
      onChange={(e) => alCambiar(e.target.value)}
    />
  );
}

export default Input;
