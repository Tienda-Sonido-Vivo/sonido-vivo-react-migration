
import { useCallback, useEffect, useRef, useState } from "react";

import type { ItemCarrito } from "../interfaces/ItemCarrito";
import type { Producto } from "../interfaces/Producto";
import type { Pedido } from "../interfaces/Pedido";
import type { Usuario } from "../interfaces/Usuario";
import type { EstadoPedido } from "../interfaces/EstadoPedido";
import type { DatosFormularioCheckout } from "../componentes/organismos/FormularioCheckout";
import type { DatosRegistroCliente } from "../servicios/authServicio";

import {
  iniciarSesion as autenticar,
  registrarCliente,
  obtenerSesionActual,
} from "../servicios/authServicio";
import {
  obtenerProductos,
  obtenerCategorias,
  crearProducto,
  actualizarProducto,
  actualizarStockProducto,
  eliminarProducto,
} from "../servicios/productosServicio";
import {
  crearPedido,
  obtenerMisPedidos,
  obtenerPedidosAdministracion,
  actualizarEstadoPedido,
} from "../servicios/pedidosServicio";
import { procesarPagoPedido } from "../servicios/pagosServicio";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
} from "../servicios/usuariosServicio";
import {
  obtenerCarrito,
  agregarItemCarrito,
  actualizarCantidadCarrito,
  eliminarItemCarrito,
} from "../servicios/carritoServicio";
import {
  cerrarSesion,
  haySesion,
  obtenerUsuarioSesion,
  obtenerCorreo,
} from "../servicios/sesion";

function productoSinStock(producto: Producto) {
  return {
    codigo: producto.codigo,
    nombre: producto.nombre,
    categoria: producto.categoria,
    marca: producto.marca,
    modelo: producto.modelo,
    precio: producto.precio,
    imagen: producto.imagen,
    descripcion: producto.descripcion,
  };
}

function mismoProductoSinStock(a: Producto, b: Producto): boolean {
  return JSON.stringify(productoSinStock(a)) === JSON.stringify(productoSinStock(b));
}

export function useAppData() {
  const [usuarios, setUsuariosState] = useState<Usuario[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [pedidos, setPedidosState] = useState<Pedido[]>([]);
  const [productosDisponibles, setProductosDisponiblesState] = useState<Producto[]>([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([]);
  const [correoUsuario, setCorreoUsuario] = useState(obtenerCorreo());
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [cargandoPedidos, setCargandoPedidos] = useState(haySesion());
  const [cargandoCarrito, setCargandoCarrito] = useState(haySesion());
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const correoCarritoSincronizado = useRef<string | null>(null);
  const carritoRef = useRef<ItemCarrito[]>(carrito);

  useEffect(() => {
    carritoRef.current = carrito;
  }, [carrito]);

  const cargarCatalogo = useCallback(async () => {
    setCargandoCatalogo(true);

    try {
      const [productosApi, categoriasApi] = await Promise.all([
        obtenerProductos(),
        obtenerCategorias(),
      ]);

      setProductosDisponiblesState(productosApi);
      setCategoriasDisponibles(categoriasApi);
    } catch (error) {
      console.error("No fue posible cargar el catálogo.", error);
    } finally {
      setCargandoCatalogo(false);
    }
  }, []);

  const cargarDatosUsuario = useCallback(async (usuario: Usuario) => {
    setCargandoPedidos(true);
    setCargandoCarrito(usuario.rol === "Cliente");

    try {
      if (usuario.rol === "Cliente") {
        if (correoCarritoSincronizado.current !== usuario.email) {
          const itemsInvitado = correoCarritoSincronizado.current === null
            ? [...carritoRef.current]
            : [];

          setCarrito([]);

          for (const item of itemsInvitado) {
            try {
              await agregarItemCarrito(item.codigo, item.cantidad);
            } catch (error) {
              console.warn("No se pudo incorporar un producto del carrito temporal.", error);
            }
          }

          correoCarritoSincronizado.current = usuario.email;
        }

        const [resultadoCarrito, resultadoPedidos] = await Promise.allSettled([
          obtenerCarrito(),
          obtenerMisPedidos(),
        ] as const);

        if (resultadoCarrito.status === "fulfilled") {
          setCarrito(resultadoCarrito.value);
        } else {
          console.error("No fue posible recuperar el carrito del cliente.", resultadoCarrito.reason);
        }

        if (resultadoPedidos.status === "fulfilled") {
          setPedidosState(resultadoPedidos.value);
        } else {
          console.error("No fue posible recuperar los pedidos del cliente.", resultadoPedidos.reason);
        }

        setUsuariosState([]);
        return;
      }

      setCarrito([]);
      const pedidosAdministracion = await obtenerPedidosAdministracion();
      setPedidosState(pedidosAdministracion);

      if (usuario.rol === "Administrador") {
        const usuariosApi = await obtenerUsuarios();
        setUsuariosState(usuariosApi);
      } else {
        setUsuariosState([]);
      }
    } catch (error) {
      console.error("No fue posible cargar la información de la cuenta.", error);
    } finally {
      setCargandoPedidos(false);
      setCargandoCarrito(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => cargarCatalogo());
  }, [cargarCatalogo]);

  useEffect(() => {
    const actualizarSesion = () => {
      const usuario = obtenerUsuarioSesion();

      setCorreoUsuario(usuario?.email ?? "");

      if (!usuario) {
        const habiaSesion = correoCarritoSincronizado.current !== null || correoUsuario !== "";

        correoCarritoSincronizado.current = null;

        if (habiaSesion) {
          setCarrito([]);
        }

        setCargandoCarrito(false);
        setCargandoPedidos(false);
        setUsuariosState([]);
        setPedidosState([]);
        return;
      }

      void cargarDatosUsuario(usuario);
    };

    window.addEventListener("sesionCambiada", actualizarSesion);

    obtenerSesionActual()
      .catch(() => {
        cerrarSesion();
      })
      .finally(() => {
        setVerificandoSesion(false);
      });

    return () => {
      window.removeEventListener("sesionCambiada", actualizarSesion);
    };
  }, [cargarDatosUsuario]);

  const iniciarSesion = async (email: string, clave: string): Promise<Usuario> => {
    return autenticar(email, clave);
  };

  const registrarUsuario = async (datos: DatosRegistroCliente): Promise<void> => {
    await registrarCliente(datos);
  };

  const agregarAlCarrito = async (codigo: string, cantidad: number): Promise<boolean> => {
    const producto = productosDisponibles.find((actual) => actual.codigo === codigo);

    if (!producto) {
      alert("El producto ya no está disponible en el catálogo.");
      return false;
    }

    const usuario = obtenerUsuarioSesion();

    if (usuario?.rol === "Cliente") {
      if (cargandoCarrito) {
        alert("Estamos cargando tu carrito. Inténtalo nuevamente en unos segundos.");
        return false;
      }

      try {
        await agregarItemCarrito(codigo, cantidad);
        setCarrito(await obtenerCarrito());
        return true;
      } catch (error) {
        alert(error instanceof Error ? error.message : "No fue posible agregar el producto.");
        return false;
      }
    }

    const itemExistente = carrito.find((item) => item.codigo === codigo);
    const cantidadFinal = (itemExistente?.cantidad ?? 0) + cantidad;

    if (cantidad < 1 || cantidadFinal > producto.stock) {
      alert(`Solo hay ${producto.stock} unidades disponibles.`);
      return false;
    }

    setCarrito((actual) => {
      if (!itemExistente) {
        return [...actual, { codigo, cantidad }];
      }

      return actual.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: cantidadFinal } : item,
      );
    });

    return true;
  };

  const cambiarCantidad = async (codigo: string, cantidad: number) => {
    const producto = productosDisponibles.find((actual) => actual.codigo === codigo);

    if (!producto) {
      return;
    }

    const cantidadValida = Math.min(Math.max(1, cantidad), producto.stock);

    if (obtenerUsuarioSesion()?.rol === "Cliente") {
      try {
        setCarrito(await actualizarCantidadCarrito(codigo, cantidadValida));
      } catch (error) {
        alert(error instanceof Error ? error.message : "No fue posible actualizar el carrito.");
      }

      return;
    }

    setCarrito((actual) =>
      actual.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: cantidadValida } : item,
      ),
    );
  };

  const eliminarDelCarrito = async (codigo: string) => {
    if (obtenerUsuarioSesion()?.rol === "Cliente") {
      try {
        setCarrito(await eliminarItemCarrito(codigo));
      } catch (error) {
        alert(error instanceof Error ? error.message : "No fue posible eliminar el producto.");
      }

      return;
    }

    setCarrito((actual) => actual.filter((item) => item.codigo !== codigo));
  };

  const confirmarPedido = async (
    datos: DatosFormularioCheckout,
  ): Promise<string | null> => {
    if (!correoUsuario || carrito.length === 0) {
      return null;
    }

    try {
      const pedido = await crearPedido(datos);
      setPedidosState((actuales) => [pedido, ...actuales]);
      await procesarPagoPedido(pedido.codigo);

      setPedidosState((actuales) => [
        { ...pedido, pagado: true },
        ...actuales.filter((actual) => actual.codigo !== pedido.codigo),
      ]);
      setCarrito([]);
      await cargarCatalogo();

      return pedido.codigo;
    } catch (error) {
      alert(error instanceof Error ? error.message : "No fue posible registrar el pedido.");
      return null;
    }
  };

  const setProductosDisponibles = (nuevos: Producto[]) => {
    const anteriores = productosDisponibles;
    setProductosDisponiblesState(nuevos);

    void (async () => {
      try {
        for (const producto of nuevos) {
          const anterior = anteriores.find((actual) => actual.codigo === producto.codigo);

          if (!anterior) {
            await crearProducto(producto);
            continue;
          }

          if (mismoProductoSinStock(anterior, producto)) {
            if (anterior.stock !== producto.stock) {
              await actualizarStockProducto(producto.codigo, producto.stock);
            }

            continue;
          }

          await actualizarProducto(producto);
        }

        for (const anterior of anteriores) {
          const sigueExistiendo = nuevos.some(
            (producto) => producto.codigo === anterior.codigo,
          );

          if (!sigueExistiendo) {
            await eliminarProducto(anterior.codigo);
          }
        }

        await cargarCatalogo();
      } catch (error) {
        alert(error instanceof Error ? error.message : "No fue posible actualizar el catálogo.");
        await cargarCatalogo();
      }
    })();
  };

  const setPedidos = (nuevos: Pedido[]) => {
    const anteriores = pedidos;
    setPedidosState(nuevos);

    void (async () => {
      try {
        for (const pedido of nuevos) {
          const anterior = anteriores.find((actual) => actual.codigo === pedido.codigo);

          if (!anterior) {
            continue;
          }

          if (anterior.estado !== pedido.estado) {
            await actualizarEstadoPedido(pedido.codigo, pedido.estado as EstadoPedido);
          }

        }

        const actualizados = obtenerUsuarioSesion()?.rol === "Cliente"
          ? await obtenerMisPedidos()
          : await obtenerPedidosAdministracion();

        setPedidosState(actualizados);
      } catch (error) {
        alert(error instanceof Error ? error.message : "No fue posible actualizar el pedido.");
        const actualizados = obtenerUsuarioSesion()?.rol === "Cliente"
          ? await obtenerMisPedidos().catch(() => [])
          : await obtenerPedidosAdministracion().catch(() => []);
        setPedidosState(actualizados);
      }
    })();
  };

  const setUsuarios = (nuevos: Usuario[], claveInicial?: string) => {
    const anteriores = usuarios;
    setUsuariosState(nuevos);

    void (async () => {
      try {
        for (const usuario of nuevos) {
          const anterior = anteriores.find((actual) => actual.run === usuario.run);

          if (!anterior) {
            await crearUsuario(usuario, claveInicial ?? "");
            continue;
          }

          const cambio = JSON.stringify(anterior) !== JSON.stringify(usuario);

          if (cambio) {
            await actualizarUsuario(usuario, claveInicial);
          }
        }

        setUsuariosState(await obtenerUsuarios());
      } catch (error) {
        alert(error instanceof Error ? error.message : "No fue posible actualizar los usuarios.");
        setUsuariosState(await obtenerUsuarios().catch(() => []));
      }
    })();
  };

  return {
    usuarios,
    carrito,
    pedidos,
    productosDisponibles,
    categoriasDisponibles,
    correoUsuario,
    cargandoCatalogo,
    cargandoPedidos,
    cargandoCarrito,
    verificandoSesion,
    iniciarSesion,
    registrarUsuario,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    confirmarPedido,
    setUsuarios,
    setProductosDisponibles,
    setPedidos,
    cargarCatalogo,
    cargarDatosUsuario,
  };
}


/*
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

*/