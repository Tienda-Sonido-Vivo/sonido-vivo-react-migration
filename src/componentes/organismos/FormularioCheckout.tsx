import { useState } from "react";
import type { FormEvent } from "react";

import CampoFormulario from "../moleculas/CampoFormulario";
import { regionesComunas } from "../../datos/regionesComunas";

export type MetodoEntrega = "despacho" | "retiro";
export type MetodoPago = "debito" | "credito" | "transbank" | "klap";

export interface DatosFormularioCheckout {
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  region: string;
  comuna: string;
  direccion: string;
  numeroVivienda: string;
  codigoPostal: string;
  metodoEntrega: MetodoEntrega;
  metodoPago: MetodoPago;
}

interface FormularioCheckoutProps {
  correoUsuario: string;
  onConfirmarPedido: (datos: DatosFormularioCheckout) => Promise<string | null | void>;
  onMetodoEntregaChange: (metodo: MetodoEntrega) => void;
}

function FormularioCheckout({
  correoUsuario,
  onConfirmarPedido,
  onMetodoEntregaChange,
}: FormularioCheckoutProps) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState(correoUsuario);
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [direccion, setDireccion] = useState("");
  const [numeroVivienda, setNumeroVivienda] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [metodoEntrega, setMetodoEntrega] = useState<MetodoEntrega>("despacho");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("debito");
  const [enviando, setEnviando] = useState(false);

  const comunasDisponibles = region ? regionesComunas[region] ?? [] : [];

  const validarFormulario = (): string => {
    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !telefono.trim() ||
      !correo.trim() ||
      !region ||
      !comuna
    ) {
      return "Debe completar todos los datos obligatorios.";
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre.trim())) {
      return "El nombre solo puede contener letras.";
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellidos.trim())) {
      return "Los apellidos solo pueden contener letras.";
    }

    if (!/^(?:\+?56\s?)?9\s?\d{4}\s?\d{4}$/.test(telefono.trim())) {
      return "Ingresa un celular chileno válido.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      return "Ingresa un correo electrónico válido.";
    }

    if (metodoEntrega === "despacho") {
      if (!direccion.trim()) {
        return "La dirección es obligatoria para el despacho.";
      }

      if (!numeroVivienda.trim()) {
        return "El número de vivienda es obligatorio para el despacho.";
      }

      if (codigoPostal.trim() && !/^\d{7}$/.test(codigoPostal.trim())) {
        return "El código postal debe contener 7 números.";
      }
    }

    return "";
  };

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (enviando) {
      return;
    }

    const error = validarFormulario();

    if (error) {
      alert(error);
      return;
    }

    setEnviando(true);

    try {
      await onConfirmarPedido({
      nombre: nombre.trim(),

      apellidos: apellidos.trim(),

      telefono: telefono.trim(),

      correo: correo.trim(),

      region,

      comuna,

      direccion: direccion.trim(),

      numeroVivienda: numeroVivienda.trim(),

      codigoPostal: codigoPostal.trim(),

      metodoEntrega,

        metodoPago,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">1. Datos del cliente</h2>
        </div>

        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label fw-semibold">País</label>
            <select className="form-select" value="Chile" disabled>
              <option value="Chile">Chile</option>
            </select>
          </div>

          <div className="row">
            <div className="col-12 col-md-6">
              <CampoFormulario etiqueta="Nombre *" tipo="text" nombre="nombre" valor={nombre} alCambiar={setNombre} />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario etiqueta="Apellidos *" tipo="text" nombre="apellidos" valor={apellidos} alCambiar={setApellidos} />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario etiqueta="Teléfono *" tipo="tel" nombre="telefono" valor={telefono} alCambiar={setTelefono} />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario etiqueta="Correo electrónico *" tipo="email" nombre="correo" valor={correo} alCambiar={setCorreo} />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">2. Dirección de entrega</h2>
        </div>

        <div className="card-body p-4">
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="region" className="form-label fw-semibold">Región *</label>
              <select
                id="region"
                className="form-select"
                value={region}
                onChange={(event) => {
                  setRegion(event.target.value);
                  setComuna("");
                }}
              >
                <option value="">Selecciona una región</option>
                {Object.keys(regionesComunas).map((nombreRegion) => (
                  <option key={nombreRegion} value={nombreRegion}>{nombreRegion}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="comuna" className="form-label fw-semibold">Comuna *</label>
              <select
                id="comuna"
                className="form-select"
                value={comuna}
                disabled={!region}
                onChange={(event) => setComuna(event.target.value)}
              >
                <option value="">Selecciona una comuna</option>
                {comunasDisponibles.map((nombreComuna) => (
                  <option key={nombreComuna} value={nombreComuna}>{nombreComuna}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <CampoFormulario etiqueta="Dirección" tipo="text" nombre="direccion" valor={direccion} alCambiar={setDireccion} />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario etiqueta="Número de vivienda" tipo="text" nombre="numeroVivienda" valor={numeroVivienda} alCambiar={setNumeroVivienda} />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario etiqueta="Código postal" tipo="text" nombre="codigoPostal" valor={codigoPostal} alCambiar={setCodigoPostal} />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">3. Método de entrega</h2>
        </div>

        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="border rounded p-3 d-block h-100">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  name="metodoEntrega"
                  checked={metodoEntrega === "despacho"}
                  onChange={() => {
                    setMetodoEntrega("despacho");
                    onMetodoEntregaChange("despacho");
                  }}
                />
                <strong>Despacho a domicilio</strong>
                <small className="text-muted d-block mt-1">Costo: $8.990</small>
              </label>
            </div>

            <div className="col-12 col-md-6">
              <label className="border rounded p-3 d-block h-100">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  name="metodoEntrega"
                  checked={metodoEntrega === "retiro"}
                  onChange={() => {
                    setMetodoEntrega("retiro");
                    onMetodoEntregaChange("retiro");
                  }}
                />
                <strong>Retiro en tienda</strong>
                <small className="text-muted d-block mt-1">Sin costo de despacho.</small>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">4. Método de pago</h2>
        </div>

        <div className="card-body p-4">
          <label htmlFor="metodoPago" className="form-label fw-semibold">Medio de pago *</label>
          <select
            id="metodoPago"
            className="form-select"
            value={metodoPago}
            onChange={(event) => setMetodoPago(event.target.value as MetodoPago)}
          >
            <option value="debito">Tarjeta de débito</option>
            <option value="credito">Tarjeta de crédito</option>
            <option value="transbank">Transbank Webpay</option>
            <option value="klap">Klap</option>
          </select>

          <div className="alert alert-info mt-3 mb-0">
            Esta versión académica registra el método de pago seleccionado, pero no procesa transacciones reales ni solicita ni almacena datos de tarjetas.
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-success btn-lg w-100 fw-bold" disabled={enviando}>
        {enviando ? "Registrando pedido..." : "Confirmar pedido"}
      </button>
    </form>
  );
}

export default FormularioCheckout;
