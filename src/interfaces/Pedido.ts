export interface ProductoPedido {
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface DatosClientePedido {
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  region: string;
  comuna: string;
  direccion: string;
  numeroVivienda: string;
  codigoPostal: string;
}

export interface Pedido {
  codigo: string;
  fecha: string;
  fechaISO: string;
  estado: string;
  productos: ProductoPedido[];
  subtotal: number;
  envio: number;
  iva: number;
  total: number;
  metodoEntrega: "despacho" | "retiro";
  metodoPago: "debito" | "credito" | "transbank" | "klap";
  cliente: DatosClientePedido;
  correoCliente: string;

}
