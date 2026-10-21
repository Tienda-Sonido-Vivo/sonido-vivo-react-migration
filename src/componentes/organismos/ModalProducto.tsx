// src/componentes/organismos/ModalProducto.tsx

import { useState } from "react";

import type { Producto } from "../../interfaces/Producto";
import { categorias } from "../../datos/categorias";

import ModalBase from "../moleculas/ModalBase";
import CampoConError from "../moleculas/CampoConError";

interface FormularioProducto {
  codigo: string;
  nombre: string;
  categoria: string;
  marca: string;
  modelo: string;
  stock: string;
  precio: string;
  imagen: string;
  descripcion: string;
}

type Errores = Partial<Record<keyof FormularioProducto, string>>;

interface ModalProductoProps {
  // null = crear un producto nuevo
  producto: Producto | null;

  productos: Producto[];

  // true = el Vendedor solo puede modificar el stock
  soloStock: boolean;

  onGuardar: (producto: Producto, esNuevo: boolean) => void;

  onCerrar: () => void;
}

function formularioInicial(producto: Producto | null): FormularioProducto {
  if (producto === null) {
    return {
      codigo: "",
      nombre: "",
      categoria: "",
      marca: "",
      modelo: "",
      stock: "",
      precio: "",
      imagen: "",
      descripcion: "",
    };
  }

  return {
    codigo: producto.codigo,
    nombre: producto.nombre,
    categoria: producto.categoria,
    marca: producto.marca,
    modelo: producto.modelo,
    stock: String(producto.stock),
    precio: String(producto.precio),
    imagen: producto.imagen,
    descripcion: producto.descripcion,
  };
}

function ModalProducto({
  producto,
  productos,
  soloStock,
  onGuardar,
  onCerrar,
}: ModalProductoProps) {
  const esNuevo = producto === null;

  const [formulario, setFormulario] = useState<FormularioProducto>(() =>
    formularioInicial(producto),
  );

  const [errores, setErrores] = useState<Errores>({});

  const cambiar = (campo: keyof FormularioProducto, valor: string) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const validar = (): Errores => {
    const nuevos: Errores = {};

    const codigo = formulario.codigo.trim().toUpperCase();

    if (esNuevo) {
      if (!/^[A-Z]{2}\d{3}$/.test(codigo)) {
        nuevos.codigo =
          "Formato inválido. Dos letras y tres números (ej: GA001).";
      } else if (productos.some((p) => p.codigo === codigo)) {
        nuevos.codigo = "Ya existe un producto con ese código.";
      }
    }

    if (formulario.nombre.trim().length < 3) {
      nuevos.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (formulario.categoria === "") {
      nuevos.categoria = "Selecciona una categoría.";
    }

    if (formulario.marca.trim() === "") {
      nuevos.marca = "La marca es obligatoria.";
    }

    if (formulario.modelo.trim() === "") {
      nuevos.modelo = "El modelo es obligatorio.";
    }

    if (!/^\d+$/.test(formulario.stock)) {
      nuevos.stock = "El stock debe ser un número entero, 0 o mayor.";
    }

    if (!/^\d+$/.test(formulario.precio) || Number(formulario.precio) <= 0) {
      nuevos.precio = "El precio debe ser un número entero mayor a 0.";
    }

    if (formulario.descripcion.length > 200) {
      nuevos.descripcion = "Máximo 200 caracteres.";
    }

    return nuevos;
  };

  const guardar = () => {
    const nuevos = validar();

    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) {
      return;
    }

    const resultado: Producto = {
      codigo: esNuevo
        ? formulario.codigo.trim().toUpperCase()
        : producto.codigo,
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria,
      marca: formulario.marca.trim(),
      modelo: formulario.modelo.trim(),
      stock: Number(formulario.stock),
      precio: Number(formulario.precio),
      imagen: formulario.imagen.trim(),
      descripcion: formulario.descripcion.trim(),
    };

    onGuardar(resultado, esNuevo);
  };

  // Si el producto tiene una categoría que no está en la lista, igual se muestra
  const categoriasDisponibles =
    formulario.categoria !== "" && !categorias.includes(formulario.categoria)
      ? [formulario.categoria, ...categorias]
      : categorias;

  return (
    <ModalBase
      titulo={
        esNuevo
          ? "Añadir producto"
          : soloStock
            ? "Actualizar stock"
            : "Editar producto"
      }
      onCerrar={onCerrar}
      pie={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button type="button" className="btn btn-primary" onClick={guardar}>
            Guardar
          </button>
        </>
      }
    >
      {soloStock && (
        <div className="alert alert-info">
          Como vendedor, solo puedes modificar el stock del producto.
        </div>
      )}

      <div className="row">
        <div className="col-12 col-md-4">
          <CampoConError
            id="productoCodigo"
            etiqueta="Código"
            error={errores.codigo}
            ayuda={esNuevo ? "Ej: GA001" : "El código no se puede modificar."}
          >
            <input
              id="productoCodigo"
              type="text"
              className={"form-control" + (errores.codigo ? " is-invalid" : "")}
              maxLength={5}
              value={formulario.codigo}
              disabled={!esNuevo}
              onChange={(e) => cambiar("codigo", e.target.value)}
            />
          </CampoConError>
        </div>

        <div className="col-12 col-md-8">
          <CampoConError
            id="productoCategoria"
            etiqueta="Categoría"
            error={errores.categoria}
          >
            <select
              id="productoCategoria"
              className={
                "form-select" + (errores.categoria ? " is-invalid" : "")
              }
              value={formulario.categoria}
              disabled={soloStock}
              onChange={(e) => cambiar("categoria", e.target.value)}
            >
              <option value="">Selecciona una categoría</option>

              {categoriasDisponibles.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </CampoConError>
        </div>
      </div>

      <CampoConError
        id="productoNombre"
        etiqueta="Nombre del producto"
        error={errores.nombre}
      >
        <input
          id="productoNombre"
          type="text"
          className={"form-control" + (errores.nombre ? " is-invalid" : "")}
          maxLength={100}
          value={formulario.nombre}
          disabled={soloStock}
          onChange={(e) => cambiar("nombre", e.target.value)}
        />
      </CampoConError>

      <div className="row">
        <div className="col-12 col-md-6">
          <CampoConError
            id="productoMarca"
            etiqueta="Marca"
            error={errores.marca}
          >
            <input
              id="productoMarca"
              type="text"
              className={"form-control" + (errores.marca ? " is-invalid" : "")}
              maxLength={50}
              value={formulario.marca}
              disabled={soloStock}
              onChange={(e) => cambiar("marca", e.target.value)}
            />
          </CampoConError>
        </div>

        <div className="col-12 col-md-6">
          <CampoConError
            id="productoModelo"
            etiqueta="Modelo"
            error={errores.modelo}
          >
            <input
              id="productoModelo"
              type="text"
              className={"form-control" + (errores.modelo ? " is-invalid" : "")}
              maxLength={50}
              value={formulario.modelo}
              disabled={soloStock}
              onChange={(e) => cambiar("modelo", e.target.value)}
            />
          </CampoConError>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <CampoConError
            id="productoStock"
            etiqueta="Stock"
            error={errores.stock}
          >
            <input
              id="productoStock"
              type="number"
              min={0}
              step={1}
              className={"form-control" + (errores.stock ? " is-invalid" : "")}
              value={formulario.stock}
              onChange={(e) => cambiar("stock", e.target.value)}
            />
          </CampoConError>
        </div>

        <div className="col-12 col-md-6">
          <CampoConError
            id="productoPrecio"
            etiqueta="Precio (CLP)"
            error={errores.precio}
          >
            <input
              id="productoPrecio"
              type="number"
              min={1}
              step={1}
              className={"form-control" + (errores.precio ? " is-invalid" : "")}
              value={formulario.precio}
              disabled={soloStock}
              onChange={(e) => cambiar("precio", e.target.value)}
            />
          </CampoConError>
        </div>
      </div>

      <CampoConError
        id="productoImagen"
        etiqueta="Ruta de la imagen"
        ayuda="Ej: /img/tarjetas/Guitarra Acustica Yamaha F310.webp"
      >
        <input
          id="productoImagen"
          type="text"
          className="form-control"
          value={formulario.imagen}
          disabled={soloStock}
          onChange={(e) => cambiar("imagen", e.target.value)}
        />
      </CampoConError>

      {formulario.imagen.trim() !== "" && (
        <img
          src={formulario.imagen.trim()}
          alt="Vista previa del producto"
          className="img-thumbnail mb-3"
          style={{ maxHeight: "120px", objectFit: "contain" }}
          onLoad={(e) => {
            e.currentTarget.style.display = "";
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <CampoConError
        id="productoDescripcion"
        etiqueta="Descripción breve"
        error={errores.descripcion}
        ayuda={`${formulario.descripcion.length}/200 caracteres`}
      >
        <textarea
          id="productoDescripcion"
          className={
            "form-control" + (errores.descripcion ? " is-invalid" : "")
          }
          rows={3}
          value={formulario.descripcion}
          disabled={soloStock}
          onChange={(e) => cambiar("descripcion", e.target.value)}
        />
      </CampoConError>
    </ModalBase>
  );
}

export default ModalProducto;
