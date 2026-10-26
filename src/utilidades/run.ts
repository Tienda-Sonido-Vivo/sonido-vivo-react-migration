export function calcularDigitoVerificador(cuerpo: string): string {
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;

    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);

  if (resto === 11) return "0";
  if (resto === 10) return "K";

  return String(resto);
}

export function validarRun(run: string): boolean {
  if (!/^\d{7,8}-[\dkK]$/.test(run)) {
    return false;
  }

  const [cuerpo, dv] = run.split("-");

  return calcularDigitoVerificador(cuerpo) === dv.toUpperCase();
}

export function normalizarRun(run: string): string {
  return run.replace(/[.\-\s]/g, "").toUpperCase();
}

export function formatearRun(run: string): string {
  const limpio = normalizarRun(run);

  if (limpio.length < 2) {
    return limpio;
  }

  return limpio.slice(0, -1) + "-" + limpio.slice(-1);
}
