//src/componentes/organismos/FormularioCheckout.tsx

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

  onConfirmarPedido: (datos: DatosFormularioCheckout) => void;
}

function FormularioCheckout({
  correoUsuario,
  onConfirmarPedido,
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

  const [numeroTarjeta, setNumeroTarjeta] = useState("");

  const [fechaVencimiento, setFechaVencimiento] = useState("");

  const [codigoSeguridad, setCodigoSeguridad] = useState("");

  const [nombreTitular, setNombreTitular] = useState("");

  const [rutPago, setRutPago] = useState("");

  const [numeroDocumento, setNumeroDocumento] = useState("");

  const comunasDisponibles = region ? (regionesComunas[region] ?? []) : [];

  const validarRutChileno = (rut: string): boolean => {
    const rutLimpio = rut
      .replace(/\./g, "")
      .replace(/-/g, "")
      .replace(/\s/g, "")
      .toUpperCase();

    if (!/^\d+[0-9K]$/.test(rutLimpio)) {
      return false;
    }

    const cuerpo = rutLimpio.slice(0, -1);
    const digitoVerificador = rutLimpio.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * multiplicador;

      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const resultado = 11 - resto;

    const digitoCalculado =
      resultado === 11 ? "0" : resultado === 10 ? "K" : String(resultado);

    return digitoCalculado === digitoVerificador;
  };

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

    const formatoTelefono = /^(?:\+?56\s?)?9\s?\d{4}\s?\d{4}$/;

    if (!formatoTelefono.test(telefono.trim())) {
      return "Ingresa un celular chileno válido.";
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo.trim())) {
      return "Ingresa un correo electrónico válido.";
    }

    if (metodoEntrega === "despacho") {
      if (!direccion.trim()) {
        return "La dirección es obligatoria para el despacho.";
      }

      if (!/^\d+$/.test(numeroVivienda.trim())) {
        return "El número de vivienda debe contener solo números.";
      }

      if (codigoPostal.trim() && !/^\d{7}$/.test(codigoPostal.trim())) {
        return "El código postal debe contener 7 números.";
      }
    }

    if (metodoPago === "debito" || metodoPago === "credito") {
      const digitosTarjeta = numeroTarjeta.replace(/\s/g, "");

      if (!/^\d{16}$/.test(digitosTarjeta)) {
        return "El número de tarjeta debe contener 16 dígitos.";
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaVencimiento)) {
        return "El vencimiento debe tener el formato MM/AA.";
      }

      if (!/^\d{3,4}$/.test(codigoSeguridad)) {
        return "El código de seguridad no es válido.";
      }

      if (nombreTitular.trim().length < 3) {
        return "Ingresa el nombre del titular.";
      }

      if (!validarRutChileno(rutPago)) {
        return "Ingresa un RUT válido.";
      }

      if (numeroDocumento.trim().length < 5) {
        return "Ingresa un número de documento válido.";
      }
    }

    return "";
  };

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validarFormulario();

    if (error) {
      alert(error);

      return;
    }

    onConfirmarPedido({
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
  };

  const manejarNumeroTarjeta = (valor: string) => {
    const digitos = valor.replace(/\D/g, "").slice(0, 16);

    const formateado = digitos.match(/.{1,4}/g)?.join(" ") ?? "";

    setNumeroTarjeta(formateado);
  };

  const manejarVencimiento = (valor: string) => {
    const digitos = valor.replace(/\D/g, "").slice(0, 4);

    if (digitos.length > 2) {
      setFechaVencimiento(`${digitos.slice(0, 2)}/${digitos.slice(2)}`);
    } else {
      setFechaVencimiento(digitos);
    }
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      {/* DATOS DEL CLIENTE */}

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
              <CampoFormulario
                etiqueta="Nombre"
                tipo="text"
                nombre="nombre"
                valor={nombre}
                alCambiar={setNombre}
              />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario
                etiqueta="Apellidos"
                tipo="text"
                nombre="apellidos"
                valor={apellidos}
                alCambiar={setApellidos}
              />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario
                etiqueta="Teléfono"
                tipo="tel"
                nombre="telefono"
                valor={telefono}
                alCambiar={setTelefono}
              />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario
                etiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                alCambiar={setCorreo}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DIRECCIÓN */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">2. Dirección de entrega</h2>
        </div>

        <div className="card-body p-4">
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="region" className="form-label fw-semibold">
                Región
              </label>

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
                  <option key={nombreRegion} value={nombreRegion}>
                    {nombreRegion}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="comuna" className="form-label fw-semibold">
                Comuna
              </label>

              <select
                id="comuna"
                className="form-select"
                value={comuna}
                disabled={!region}
                onChange={(event) => setComuna(event.target.value)}
              >
                <option value="">Selecciona una comuna</option>

                {comunasDisponibles.map((nombreComuna) => (
                  <option key={nombreComuna} value={nombreComuna}>
                    {nombreComuna}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <CampoFormulario
                etiqueta="Dirección"
                tipo="text"
                nombre="direccion"
                valor={direccion}
                alCambiar={setDireccion}
              />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario
                etiqueta="Número de vivienda"
                tipo="text"
                nombre="numeroVivienda"
                valor={numeroVivienda}
                alCambiar={setNumeroVivienda}
              />
            </div>

            <div className="col-12 col-md-6">
              <CampoFormulario
                etiqueta="Código postal"
                tipo="text"
                nombre="codigoPostal"
                valor={codigoPostal}
                alCambiar={setCodigoPostal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ENTREGA */}

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
                  onChange={() => setMetodoEntrega("despacho")}
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
                  onChange={() => setMetodoEntrega("retiro")}
                />

                <strong>Retiro en tienda</strong>

                <small className="text-muted d-block mt-1">
                  Sin costo de despacho.
                </small>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* PAGO */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">4. Método de pago</h2>
        </div>

        <div className="card-body p-4">
          <div className="mb-3">
            <label htmlFor="metodoPago" className="form-label fw-semibold">
              Medio de pago
            </label>

            <select
              id="metodoPago"
              className="form-select"
              value={metodoPago}
              onChange={(event) =>
                setMetodoPago(event.target.value as MetodoPago)
              }
            >
              <option value="debito">Tarjeta de débito</option>

              <option value="credito">Tarjeta de crédito</option>

              <option value="transbank">Transbank Webpay</option>

              <option value="klap">Klap</option>
            </select>
          </div>

          {(metodoPago === "debito" || metodoPago === "credito") && (
            <div className="row">
              <div className="col-12">
                <CampoFormulario
                  etiqueta="Número de tarjeta"
                  tipo="text"
                  nombre="numeroTarjeta"
                  valor={numeroTarjeta}
                  alCambiar={manejarNumeroTarjeta}
                />
              </div>

              <div className="col-12 col-md-4">
                <CampoFormulario
                  etiqueta="Vencimiento MM/AA"
                  tipo="text"
                  nombre="fechaVencimiento"
                  valor={fechaVencimiento}
                  alCambiar={manejarVencimiento}
                />
              </div>

              <div className="col-12 col-md-4">
                <CampoFormulario
                  etiqueta="CVV"
                  tipo="password"
                  nombre="codigoSeguridad"
                  valor={codigoSeguridad}
                  alCambiar={(valor) =>
                    setCodigoSeguridad(valor.replace(/\D/g, "").slice(0, 4))
                  }
                />
              </div>

              <div className="col-12 col-md-4">
                <CampoFormulario
                  etiqueta="Nombre del titular"
                  tipo="text"
                  nombre="nombreTitular"
                  valor={nombreTitular}
                  alCambiar={setNombreTitular}
                />
              </div>

              <div className="col-12 col-md-6">
                <CampoFormulario
                  etiqueta="RUT del pago"
                  tipo="text"
                  nombre="rutPago"
                  valor={rutPago}
                  alCambiar={setRutPago}
                />
              </div>

              <div className="col-12 col-md-6">
                <CampoFormulario
                  etiqueta="Número de documento"
                  tipo="text"
                  nombre="numeroDocumento"
                  valor={numeroDocumento}
                  alCambiar={setNumeroDocumento}
                />
              </div>
            </div>
          )}

          {metodoPago === "transbank" && (
            <div className="alert alert-info mb-0">
              <strong>Transbank Webpay</strong>

              <p className="mb-0">
                Esta es una demostración académica y no realiza una transacción
                real.
              </p>
            </div>
          )}

          {metodoPago === "klap" && (
            <div className="alert alert-info mb-0">
              <strong>Klap</strong>

              <p className="mb-0">
                Esta es una demostración académica y no realiza una transacción
                real.
              </p>
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-success btn-lg w-100 fw-bold">
        Confirmar pedido
      </button>
    </form>
  );
}

export default FormularioCheckout;
