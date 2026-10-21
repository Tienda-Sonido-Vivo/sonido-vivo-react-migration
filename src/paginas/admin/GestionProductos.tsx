// src/paginas/admin/GestionProductos.tsx

import { useCallback, useMemo, useState } from "react";

import type { Producto } from "../../interfaces/Producto";
import { categorias } from "../../datos/categorias";
import { UMBRAL_STOCK_BAJO } from "../../datos/configuracion";
import { obtenerRol } from "../../servicios/sesion";
import { useOrdenamiento } from "../../hooks/useOrdenamiento";
import { formatearMoneda } from "../../utilidades/formato";

import ThOrdenable from "../../componentes/moleculas/ThOrdenable";
import ModalProducto from "../../componentes/organismos/ModalProducto";

const TOTAL_COLUMNAS = 9;

interface EstadoModal {
  // null = crear un producto nuevo
  producto: Producto | null;
}

// Los productos viven en el estado de App.tsx (el checkout descuenta el stock ahí)
interface GestionProductosProps {
  productos: Producto[];

  onCambiarProductos: (productos: Producto[]) => void;
}

function GestionProductos({
  productos,
  onCambiarProductos,
}: GestionProductosProps) {
  // El Administrador gestiona todo el catálogo; el Vendedor solo el stock
  const esAdministrador = obtenerRol() === "Administrador";

  const [modal, setModal] = useState<EstadoModal | null>(null);

  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaFiltro === "" || producto.categoria === categoriaFiltro;

      const coincideTexto =
        texto === "" ||
        producto.codigo.toLowerCase().includes(texto) ||
        producto.nombre.toLowerCase().includes(texto) ||
        producto.marca.toLowerCase().includes(texto) ||
        producto.modelo.toLowerCase().includes(texto);

      return coincideCategoria && coincideTexto;
    });
  }, [productos, busqueda, categoriaFiltro]);

  const { ordenados, orden, alternarOrden } = useOrdenamiento(filtrados);

  const cerrarModal = useCallback(() => setModal(null), []);

  const esStockBajo = (producto: Producto) =>
    producto.stock <= UMBRAL_STOCK_BAJO;

  const cantidadStockBajo = productos.filter(esStockBajo).length;

  const actualizarProductos = (nuevos: Producto[]) => {
    onCambiarProductos(nuevos);
  };

  const guardar = (producto: Producto, esNuevo: boolean) => {
    if (esNuevo) {
      actualizarProductos([...productos, producto]);

      setMensaje(`Producto ${producto.codigo} creado correctamente.`);
    } else {
      actualizarProductos(
        productos.map((p) => (p.codigo === producto.codigo ? producto : p)),
      );

      setMensaje(`Producto ${producto.codigo} actualizado correctamente.`);
    }

    cerrarModal();
  };

  const eliminar = (producto: Producto) => {
    const confirmar = window.confirm(
      `¿Eliminar "${producto.nombre}" del catálogo?`,
    );

    if (!confirmar) {
      return;
    }

    actualizarProductos(productos.filter((p) => p.codigo !== producto.codigo));

    setMensaje(`Producto ${producto.codigo} eliminado.`);
  };

  const encabezado = (
    etiqueta: string,
    campo: keyof Producto,
    className?: string,
  ) => (
    <ThOrdenable
      etiqueta={etiqueta}
      activo={orden?.campo === campo}
      ascendente={orden?.ascendente ?? true}
      onClick={() => alternarOrden(campo)}
      className={className}
    />
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h1 className="mb-0">Gestión de Productos</h1>

          <p className="text-muted mb-0">
            {productos.length} productos en el catálogo
          </p>
        </div>

        {esAdministrador && (
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setModal({ producto: null })}
          >
            Añadir producto
          </button>
        )}
      </div>

      {cantidadStockBajo > 0 && (
        <div className="alert alert-danger py-2" role="alert">
          ⚠️ {cantidadStockBajo}{" "}
          {cantidadStockBajo === 1 ? "producto tiene" : "productos tienen"}{" "}
          stock bajo ({UMBRAL_STOCK_BAJO} unidades o menos).
        </div>
      )}

      {mensaje !== "" && (
        <div className="alert alert-success alert-dismissible" role="status">
          {mensaje}

          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar aviso"
            onClick={() => setMensaje("")}
          ></button>
        </div>
      )}

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por código, nombre, marca o modelo"
            aria-label="Buscar producto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-6">
          <select
            className="form-select"
            aria-label="Filtrar por categoría"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>

            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col" className="d-none d-md-table-cell">
                Imagen
              </th>

              {encabezado("Código", "codigo")}
              {encabezado("Nombre", "nombre")}
              {encabezado("Categoría", "categoria", "d-none d-lg-table-cell")}
              {encabezado("Marca", "marca", "d-none d-xl-table-cell")}
              {encabezado("Modelo", "modelo", "d-none d-xl-table-cell")}
              {encabezado("Stock", "stock")}
              {encabezado("Precio", "precio")}

              <th scope="col" className="admin-col-ajustada">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {ordenados.length === 0 && (
              <tr>
                <td colSpan={TOTAL_COLUMNAS} className="text-center py-4">
                  No se encontraron productos.
                </td>
              </tr>
            )}

            {ordenados.map((producto) => (
              <tr
                key={producto.codigo}
                className={esStockBajo(producto) ? "table-danger" : ""}
              >
                <td className="d-none d-md-table-cell">
                  {producto.imagen !== "" && (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      width={48}
                      height={48}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </td>

                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td className="d-none d-lg-table-cell">{producto.categoria}</td>
                <td className="d-none d-xl-table-cell">{producto.marca}</td>
                <td className="d-none d-xl-table-cell">{producto.modelo}</td>

                <td className="text-nowrap">
                  {producto.stock}{" "}
                  {producto.stock === 0 ? (
                    <span className="badge text-bg-dark">Agotado</span>
                  ) : esStockBajo(producto) ? (
                    <span className="badge text-bg-danger">Stock bajo</span>
                  ) : null}
                </td>

                <td className="text-nowrap">
                  {formatearMoneda(producto.precio)}
                </td>

                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm text-nowrap"
                      onClick={() => setModal({ producto })}
                    >
                      {esAdministrador ? "Editar" : "Actualizar stock"}
                    </button>

                    {esAdministrador && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => eliminar(producto)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <ModalProducto
          producto={modal.producto}
          productos={productos}
          soloStock={!esAdministrador}
          onGuardar={guardar}
          onCerrar={cerrarModal}
        />
      )}
    </>
  );
}

export default GestionProductos;
