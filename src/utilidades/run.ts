// src/utilidades/run.ts

// Calcula el dígito verificador (módulo 11) del cuerpo del RUN
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

// Valida un RUN escrito como 12345678-5 (sin puntos, con guion)
export function validarRun(run: string): boolean {
  if (!/^\d{7,8}-[\dkK]$/.test(run)) {
    return false;
  }

  const [cuerpo, dv] = run.split("-");

  return calcularDigitoVerificador(cuerpo) === dv.toUpperCase();
}

// "12345678-5" -> "123456785" (forma en que se guarda, igual que datos/usuarios.ts)
export function normalizarRun(run: string): string {
  return run.replace(/[.\-\s]/g, "").toUpperCase();
}

// "123456785" -> "12345678-5" (forma en que se muestra y se escribe)
export function formatearRun(run: string): string {
  const limpio = normalizarRun(run);

  if (limpio.length < 2) {
    return limpio;
  }

  return limpio.slice(0, -1) + "-" + limpio.slice(-1);
}
