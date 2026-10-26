
import { useEffect, useState } from "react";

import { productos } from "../datos/productos";
import { usuarios as usuariosIniciales } from "../datos/usuarios";
import { obtenerPedidos, guardarPedidos } from "../servicios/pedidosServicio";

import type { ItemCarrito } from "../interfaces/ItemCarrito";
import type { Producto } from "../interfaces/Producto";
import type { Pedido } from "../interfaces/Pedido";
import type { Usuario } from "../interfaces/Usuario";
import type { DatosFormularioCheckout } from "../componentes/organismos/FormularioCheckout";

export function useAppData() {

  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);


  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);


  const [pedidos, setPedidos] = useState<Pedido[]>(() => obtenerPedidos());

  useEffect(() => {
    guardarPedidos(pedidos);
  }, [pedidos]);


  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>(productos);


  const [correoUsuario, setCorreoUsuario] = useState(
    sessionStorage.getItem("correoUsuario") ?? ""
  );

  useEffect(() => {
    const actualizarSesion = () => {
      setCorreoUsuario(sessionStorage.getItem("correoUsuario") ?? "");
    };

    window.addEventListener("sesionCambiada", actualizarSesion);

    return () => {
      window.removeEventListener("sesionCambiada", actualizarSesion);
    };
  }, []);


  const iniciarSesion = (usuario: Usuario) => {
    setCorreoUsuario(usuario.email);
  };


  const registrarUsuario = (nuevoUsuario: Usuario) => {
    setUsuarios((anteriores) => [...anteriores, nuevoUsuario]);
  };


  const agregarAlCarrito = (codigo: string, cantidad: number) => {
    const producto = productosDisponibles.find((actual) => actual.codigo === codigo);

    if (!producto) {
      return;
    }

    if (cantidad < 1 || cantidad > producto.stock) {
      alert("La cantidad seleccionada no está disponible.");
      return;
    }

    setCarrito((actual) => {
      const itemExistente = actual.find((item) => item.codigo === codigo);

      if (!itemExistente) {
        return [...actual, { codigo, cantidad }];
      }

      const nuevaCantidad = itemExistente.cantidad + cantidad;

      if (nuevaCantidad > producto.stock) {
        alert(`Solo hay ${producto.stock} unidades disponibles.`);
        return actual;
      }

      return actual.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: nuevaCantidad } : item
      );
    });
  };


  const cambiarCantidad = (codigo: string, cantidad: number) => {
    const producto = productosDisponibles.find((actual) => actual.codigo === codigo);

    if (!producto) {
      return;
    }

    const cantidadValida = Math.min(Math.max(1, cantidad), producto.stock);

    setCarrito((actual) =>
      actual.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: cantidadValida } : item
      )
    );
  };


  const eliminarDelCarrito = (codigo: string) => {
    setCarrito((actual) => actual.filter((item) => item.codigo !== codigo));
  };


  const confirmarPedido = (datos: DatosFormularioCheckout): string | null => {
    if (!correoUsuario || carrito.length === 0) {
      return null;
    }

    for (const item of carrito) {
      const producto = productosDisponibles.find((actual) => actual.codigo === item.codigo);

      if (!producto || item.cantidad > producto.stock) {
        alert(`No hay suficiente stock para ${producto?.nombre ?? item.codigo}.`);
        return null;
      }
    }

    const productosPedido = carrito.flatMap((item) => {
      const producto = productosDisponibles.find((actual) => actual.codigo === item.codigo);

      if (!producto) {
        return [];
      }

      return [
        {
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: item.cantidad,
        },
      ];
    });

    const subtotal = productosPedido.reduce(
      (acumulado, item) => acumulado + item.precio * item.cantidad,
      0
    );

    const envio = datos.metodoEntrega === "despacho" ? 8990 : 0;
    const iva = Math.round((subtotal * 19) / 119);

    const siguienteNumero = pedidos.length + 1;
    const codigoPedido = `PED-${String(siguienteNumero).padStart(6, "0")}`;
    const fechaActual = new Date();

    const pedido: Pedido = {
      codigo: codigoPedido,
      fecha: fechaActual.toLocaleDateString("es-CL"),
      fechaISO: fechaActual.toISOString(),
      estado: "Confirmado",
      productos: productosPedido,
      subtotal,
      envio,
      iva,
      total: subtotal + envio,
      metodoEntrega: datos.metodoEntrega,
      metodoPago: datos.metodoPago,
      cliente: {
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        telefono: datos.telefono.trim(),
        correo: datos.correo.trim(),
        region: datos.region,
        comuna: datos.comuna,
        direccion: datos.direccion.trim(),
        numeroVivienda: datos.numeroVivienda.trim(),
        codigoPostal: datos.codigoPostal.trim(),
      },
      correoCliente: correoUsuario,
    };

    setPedidos((actuales) => [...actuales, pedido]);

    setProductosDisponibles((actuales) =>
      actuales.map((producto) => {
        const itemComprado = carrito.find((item) => item.codigo === producto.codigo);

        if (!itemComprado) {
          return producto;
        }

        return {
          ...producto,
          stock: producto.stock - itemComprado.cantidad,
        };
      })
    );

    setCarrito([]);

    return codigoPedido;
  };

  return {
    usuarios,
    carrito,
    pedidos,
    productosDisponibles,
    correoUsuario,
    iniciarSesion,
    registrarUsuario,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    confirmarPedido,
    setUsuarios,
    setProductosDisponibles,
    setPedidos,
  };
}