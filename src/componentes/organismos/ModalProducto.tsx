
import { useState } from "react";

import type { Producto } from "../../interfaces/Producto";
import { categorias } from "../../datos/categorias";

import ModalBase from "../moleculas/ModalBase";
import CampoFormulario from "../moleculas/CampoFormulario";

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

  const cambiar = (campo: keyof FormularioProducto, valor: string) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const guardar = () => {
    const codigo = formulario.codigo.trim().toUpperCase();

    if (esNuevo) {
      if (!/^[A-Z]{2}\d{3}$/.test(codigo)) {
        alert(
          "Formato de código inválido. Debe incluir dos letras y tres números (ej: GA001).",
        );
        return;
      }
      if (productos.some((p) => p.codigo === codigo)) {
        alert("Ya existe un producto registrado con ese código.");
        return;
      }
    }

    if (formulario.nombre.trim().length < 3) {
      alert("El nombre del producto debe tener al menos 3 caracteres.");
      return;
    }

    if (formulario.categoria === "") {
      alert("Debe seleccionar una categoría.");
      return;
    }

    if (formulario.marca.trim() === "") {
      alert("La marca es obligatoria.");
      return;
    }

    if (formulario.modelo.trim() === "") {
      alert("El modelo es obligatorio.");
      return;
    }

    if (!/^\d+$/.test(formulario.stock)) {
      alert("El stock debe ser un número entero mayor o igual a 0.");
      return;
    }

    if (!/^\d+$/.test(formulario.precio) || Number(formulario.precio) <= 0) {
      alert("El precio debe ser un número entero mayor a 0.");
      return;
    }

    if (formulario.descripcion.length > 200) {
      alert("La descripción no puede superar los 200 caracteres.");
      return;
    }

    const resultado: Producto = {
      codigo: esNuevo ? codigo : producto.codigo,
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
          <CampoFormulario
            etiqueta="Código"
            tipo="text"
            nombre="codigo"
            valor={formulario.codigo}
            alCambiar={(valor) => cambiar("codigo", valor)}
          />
        </div>

        <div className="col-12 col-md-8">
          <div className="mb-3">
            <label
              htmlFor="productoCategoria"
              className="form-label fw-semibold"
            >
              Categoría
            </label>
            <select
              id="productoCategoria"
              className="form-select"
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
          </div>
        </div>
      </div>

      <CampoFormulario
        etiqueta="Nombre del producto"
        tipo="text"
        nombre="nombre"
        valor={formulario.nombre}
        alCambiar={(valor) => cambiar("nombre", valor)}
      />

      <div className="row">
        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Marca"
            tipo="text"
            nombre="marca"
            valor={formulario.marca}
            alCambiar={(valor) => cambiar("marca", valor)}
          />
        </div>

        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Modelo"
            tipo="text"
            nombre="modelo"
            valor={formulario.modelo}
            alCambiar={(valor) => cambiar("modelo", valor)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Stock"
            tipo="number"
            nombre="stock"
            valor={formulario.stock}
            alCambiar={(valor) => cambiar("stock", valor)}
          />
        </div>

        <div className="col-12 col-md-6">
          <CampoFormulario
            etiqueta="Precio (CLP)"
            tipo="number"
            nombre="precio"
            valor={formulario.precio}
            alCambiar={(valor) => cambiar("precio", valor)}
          />
        </div>
      </div>

      <CampoFormulario
        etiqueta="Ruta de la imagen"
        tipo="text"
        nombre="imagen"
        valor={formulario.imagen}
        alCambiar={(valor) => cambiar("imagen", valor)}
      />

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

      <div className="mb-3">
        <label htmlFor="productoDescripcion" className="form-label fw-semibold">
          Descripción breve
        </label>
        <textarea
          id="productoDescripcion"
          className="form-control"
          rows={3}
          value={formulario.descripcion}
          disabled={soloStock}
          onChange={(e) => cambiar("descripcion", e.target.value)}
        />
        <div className="form-text">
          {`${formulario.descripcion.length}/200 caracteres`}
        </div>
      </div>
    </ModalBase>
  );
}

export default ModalProducto;
