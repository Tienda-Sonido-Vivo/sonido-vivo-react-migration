// src/utilidades/formato.ts

export function formatearMoneda(valor: number): string {

    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0
    }).format(valor);

}


export function fechaHoy(): string {

    return new Date().toLocaleDateString("es-CL");

}
