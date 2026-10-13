
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { regionesComunas } from "../datos/regionesComunas";
import type { Producto } from "../interfaces/Producto";
import type { ItemCarrito } from "../interfaces/ItemCarrito";
import type {
    DatosClientePedido,
    Pedido
} from "../interfaces/Pedido";
import ResumenCompra from "../componentes/moleculas/ResumenCompra";

type MetodoEntrega = "despacho" | "retiro";
type MetodoPago = "debito" | "credito" | "transbank" | "klap";

interface CheckoutProps {
    carrito: ItemCarrito[];
    productos: Producto[];
    correoUsuario: string;
    onConfirmarPedido: (
        pedido: Omit<Pedido, "codigo" | "fecha" | "fechaISO" | "estado">
    ) => Pedido | null;
}

function Checkout({
    carrito,
    productos,
    correoUsuario,
    onConfirmarPedido
}: CheckoutProps) {

    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState(correoUsuario);
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [direccion, setDireccion] = useState("");
    const [numeroVivienda, setNumeroVivienda] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");

    const [metodoEntrega, setMetodoEntrega] =
        useState<MetodoEntrega>("despacho");

    const [metodoPago, setMetodoPago] =
        useState<MetodoPago>("debito");

    const [numeroTarjeta, setNumeroTarjeta] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const [codigoSeguridad, setCodigoSeguridad] = useState("");
    const [nombreTitular, setNombreTitular] = useState("");
    const [rutPago, setRutPago] = useState("");
    const [numeroDocumento, setNumeroDocumento] = useState("");

    const [intentoEnviar, setIntentoEnviar] = useState(false);

    const comunasDisponibles = region
        ? regionesComunas[region] ?? []
        : [];

    const subtotal = carrito.reduce((acumulado, item) => {
        const producto = productos.find(
            (p) => p.codigo === item.codigo
        );

        return acumulado +
            (producto ? producto.precio * item.cantidad : 0);
    }, 0);

    const envio = metodoEntrega === "despacho" ? 8990 : 0;

    const formatoMoneda = (valor: number) =>
        "$" + valor.toLocaleString("es-CL");

    const telefonoValido = (valor: string) =>
        /^(?:\+?56\s?)?9\s?\d{4}\s?\d{4}$/.test(valor.trim());

    const tarjetaValida = () => {
        if (metodoPago !== "debito" && metodoPago !== "credito") {
            return true;
        }

        const digitosTarjeta = numeroTarjeta.replace(/\s/g, "");

        return (
            /^\d{16}$/.test(digitosTarjeta) &&
            /^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaVencimiento) &&
            /^\d{3,4}$/.test(codigoSeguridad) &&
            nombreTitular.trim().length >= 3 &&
            rutPago.trim().length >= 8 &&
            numeroDocumento.trim().length >= 5
        );
    };

    const manejarNumeroTarjeta = (valor: string) => {
        const digitos = valor.replace(/\D/g, "").slice(0, 16);
        const formateado = digitos.match(/.{1,4}/g)?.join(" ") ?? "";
        setNumeroTarjeta(formateado);
    };

    const manejarVencimiento = (valor: string) => {
        const digitos = valor.replace(/\D/g, "").slice(0, 4);

        if (digitos.length > 2) {
            setFechaVencimiento(
                digitos.slice(0, 2) + "/" + digitos.slice(2)
            );
        } else {
            setFechaVencimiento(digitos);
        }
    };

    const enviarPedido = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIntentoEnviar(true);

        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            navigate("/carrito");
            return;
        }

        if (!correoUsuario) {
            alert("Debes iniciar sesión antes de confirmar tu pedido.");
            navigate("/login");
            return;
        }

        if (
            !nombre.trim() ||
            !apellidos.trim() ||
            !telefonoValido(telefono) ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) ||
            !region ||
            !comuna ||
            !direccion.trim()
        ) {
            alert("Revisa los datos del cliente. Hay campos vacíos o inválidos.");
            return;
        }

        if (!tarjetaValida()) {
            alert(
                "Revisa los datos de la tarjeta. Comprueba el número, vencimiento, CVV y los datos del titular."
            );
            return;
        }

        const productosPedido = carrito.map((item) => {
            const producto = productos.find(
                (p) => p.codigo === item.codigo
            );

            return producto
                ? {
                    codigo: producto.codigo,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: item.cantidad
                }
                : null;
        });

        if (productosPedido.some((item) => item === null)) {
            alert("Uno de los productos del carrito ya no existe.");
            return;
        }

        for (const item of carrito) {
            const producto = productos.find(
                (p) => p.codigo === item.codigo
            );

            if (!producto || item.cantidad > producto.stock) {
                alert(
                    `No hay suficiente stock para ${producto?.nombre ?? item.codigo}.`
                );
                return;
            }
        }

        const cliente: DatosClientePedido = {
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            telefono: telefono.trim(),
            correo: correo.trim(),
            region,
            comuna,
            direccion: direccion.trim(),
            numeroVivienda: numeroVivienda.trim(),
            codigoPostal: codigoPostal.trim()
        };

        const pedidoCreado = onConfirmarPedido({
            productos: productosPedido.filter(
                (item): item is NonNullable<typeof item> => item !== null
            ),
            subtotal,
            envio,
            iva: Math.round(subtotal * 19 / 119),
            total: subtotal + envio,
            metodoEntrega,
            metodoPago,
            cliente,
            correoCliente: correoUsuario
        });

        if (!pedidoCreado) {
            alert("No fue posible crear el pedido. Revisa el stock disponible.");
            return;
        }

        navigate("/confirmacion-pedido", {
            state: { codigoPedido: pedidoCreado.codigo }
        });
    };

    if (carrito.length === 0) {
        return (
            <main className="container py-5">
                <div className="alert alert-warning">
                    Tu carrito está vacío. Agrega productos antes de finalizar la compra.
                </div>

                <Link to="/catalogo" className="btn btn-primary">
                    Ir al catálogo
                </Link>
            </main>
        );
    }

    return (
        <main className="container my-5">

            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">
                            Inicio
                        </Link>
                    </li>

                    <li className="breadcrumb-item">
                        <Link to="/carrito" className="text-decoration-none">
                            Carrito
                        </Link>
                    </li>

                    <li className="breadcrumb-item active" aria-current="page">
                        Finalizar Compra
                    </li>
                </ol>
            </nav>

            <div className="mb-5">
                <h1 className="fw-bold">Finalizar Compra</h1>
                <p className="text-muted">
                    Revisa y completa tus datos para formalizar tu pedido.
                </p>
            </div>

            <form onSubmit={enviarPedido} noValidate>
                <div className="row g-4">

                    <div className="col-12 col-lg-8">

                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h2 className="h5 mb-0">1. Datos del Cliente</h2>
                            </div>

                            <div className="card-body">

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        País
                                    </label>
                                    <select className="form-select" value="Chile" disabled>
                                        <option value="Chile">Chile</option>
                                    </select>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="nombre" className="form-label fw-semibold">
                                            Nombre
                                        </label>
                                        <input
                                            id="nombre"
                                            className="form-control"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            required
                                        />
                                        {intentoEnviar && !nombre.trim() && (
                                            <div className="text-danger small">
                                                Ingresa tu nombre.
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="apellidos" className="form-label fw-semibold">
                                            Apellidos
                                        </label>
                                        <input
                                            id="apellidos"
                                            className="form-control"
                                            value={apellidos}
                                            onChange={(e) => setApellidos(e.target.value)}
                                            required
                                        />
                                        {intentoEnviar && !apellidos.trim() && (
                                            <div className="text-danger small">
                                                Ingresa tus apellidos.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="telefono" className="form-label fw-semibold">
                                            Teléfono
                                        </label>
                                        <input
                                            id="telefono"
                                            type="tel"
                                            className="form-control"
                                            placeholder="+56 9 1234 5678"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                            required
                                        />
                                        {intentoEnviar && !telefonoValido(telefono) && (
                                            <div className="text-danger small">
                                                Ingresa un celular chileno válido.
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="correo" className="form-label fw-semibold">
                                            Correo electrónico
                                        </label>
                                        <input
                                            id="correo"
                                            type="email"
                                            className="form-control"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="region" className="form-label fw-semibold">
                                        Región
                                    </label>
                                    <select
                                        id="region"
                                        className="form-select"
                                        value={region}
                                        onChange={(e) => {
                                            setRegion(e.target.value);
                                            setComuna("");
                                        }}
                                        required
                                    >
                                        <option value="">-- Selecciona una región --</option>
                                        {Object.keys(regionesComunas).map((nombreRegion) => (
                                            <option key={nombreRegion} value={nombreRegion}>
                                                {nombreRegion}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="comuna" className="form-label fw-semibold">
                                        Comuna
                                    </label>
                                    <select
                                        id="comuna"
                                        className="form-select"
                                        value={comuna}
                                        disabled={!region}
                                        onChange={(e) => setComuna(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Selecciona una comuna --</option>
                                        {comunasDisponibles.map((nombreComuna) => (
                                            <option key={nombreComuna} value={nombreComuna}>
                                                {nombreComuna}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="direccion" className="form-label fw-semibold">
                                        Dirección
                                    </label>
                                    <input
                                        id="direccion"
                                        className="form-control"
                                        placeholder="Calle Principal"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="numeroVivienda" className="form-label fw-semibold">
                                            N.º de Casa/Apartamento (opcional)
                                        </label>
                                        <input
                                            id="numeroVivienda"
                                            className="form-control"
                                            value={numeroVivienda}
                                            onChange={(e) => setNumeroVivienda(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="codigoPostal" className="form-label fw-semibold">
                                            Código Postal (opcional)
                                        </label>
                                        <input
                                            id="codigoPostal"
                                            className="form-control"
                                            value={codigoPostal}
                                            onChange={(e) => setCodigoPostal(e.target.value)}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h2 className="h5 mb-0">2. Método de Entrega</h2>
                            </div>

                            <div className="card-body">

                                <div className="form-check mb-3">
                                    <input
                                        id="metodoDespacho"
                                        className="form-check-input"
                                        type="radio"
                                        name="metodoEntrega"
                                        value="despacho"
                                        checked={metodoEntrega === "despacho"}
                                        onChange={() => setMetodoEntrega("despacho")}
                                    />
                                    <label className="form-check-label" htmlFor="metodoDespacho">
                                        <strong>Despacho a domicilio</strong>
                                        <span className="text-muted ms-2">
                                            — Costo: {formatoMoneda(8990)}
                                        </span>
                                    </label>
                                </div>

                                {metodoEntrega === "despacho" && (
                                    <p className="text-muted small ps-4">
                                        Tu pedido será entregado en la dirección indicada arriba.
                                    </p>
                                )}

                                <div className="form-check mb-3">
                                    <input
                                        id="metodoRetiro"
                                        className="form-check-input"
                                        type="radio"
                                        name="metodoEntrega"
                                        value="retiro"
                                        checked={metodoEntrega === "retiro"}
                                        onChange={() => setMetodoEntrega("retiro")}
                                    />
                                    <label className="form-check-label" htmlFor="metodoRetiro">
                                        <strong>Retiro en tienda</strong>
                                        <span className="text-muted ms-2">— Sin costo de envío</span>
                                    </label>
                                </div>

                                {metodoEntrega === "retiro" && (
                                    <div className="ps-4">
                                        <p className="text-muted small">
                                            Ubicación: Calle Principal 456, Viña del Mar (próximo a la estación).
                                        </p>
                                        <p className="text-muted small">
                                            Horarios: lunes a viernes 10:00–19:00; sábados 10:00–14:00.
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h2 className="h5 mb-0">3. Método de Pago</h2>
                            </div>

                            <div className="card-body">
                                {([
                                    ["debito", "Tarjeta de Débito"],
                                    ["credito", "Tarjeta de Crédito"],
                                    ["transbank", "Transbank Webpay"],
                                    ["klap", "Klap"]
                                ] as [MetodoPago, string][]).map(([valor, etiqueta]) => (
                                    <div className="form-check mb-3" key={valor}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="metodoPago"
                                            id={`pago-${valor}`}
                                            value={valor}
                                            checked={metodoPago === valor}
                                            onChange={() => setMetodoPago(valor)}
                                        />
                                        <label className="form-check-label" htmlFor={`pago-${valor}`}>
                                            <strong>{etiqueta}</strong>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h2 className="h5 mb-0">4. Datos del Método de Pago</h2>
                            </div>

                            <div className="card-body">
                                {(metodoPago === "debito" || metodoPago === "credito") ? (
                                    <>
                                        <p className="fw-semibold">
                                            Datos de demostración para tarjeta de {metodoPago === "debito" ? "débito" : "crédito"}
                                        </p>

                                        <div className="alert alert-warning small">
                                            Esta es una simulación académica. No utilices datos reales de tarjetas.
                                            Los datos introducidos no se guardan en el pedido.
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="numeroTarjeta" className="form-label fw-semibold">
                                                Número de tarjeta
                                            </label>
                                            <input
                                                id="numeroTarjeta"
                                                className="form-control"
                                                inputMode="numeric"
                                                autoComplete="off"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                value={numeroTarjeta}
                                                onChange={(e) => manejarNumeroTarjeta(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-6 mb-3">
                                                <label htmlFor="fechaVencimiento" className="form-label fw-semibold">
                                                    Vencimiento (MM/AA)
                                                </label>
                                                <input
                                                    id="fechaVencimiento"
                                                    className="form-control"
                                                    inputMode="numeric"
                                                    placeholder="12/28"
                                                    maxLength={5}
                                                    value={fechaVencimiento}
                                                    onChange={(e) => manejarVencimiento(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="col-6 mb-3">
                                                <label htmlFor="codigoSeguridad" className="form-label fw-semibold">
                                                    CVV
                                                </label>
                                                <input
                                                    id="codigoSeguridad"
                                                    className="form-control"
                                                    type="password"
                                                    inputMode="numeric"
                                                    autoComplete="off"
                                                    maxLength={4}
                                                    value={codigoSeguridad}
                                                    onChange={(e) =>
                                                        setCodigoSeguridad(
                                                            e.target.value.replace(/\D/g, "").slice(0, 4)
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="nombreTitular" className="form-label fw-semibold">
                                                Nombre del titular
                                            </label>
                                            <input
                                                id="nombreTitular"
                                                className="form-control"
                                                value={nombreTitular}
                                                onChange={(e) => setNombreTitular(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-6 mb-3">
                                                <label htmlFor="rutPago" className="form-label fw-semibold">
                                                    RUT
                                                </label>
                                                <input
                                                    id="rutPago"
                                                    className="form-control"
                                                    value={rutPago}
                                                    onChange={(e) => setRutPago(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="col-6 mb-3">
                                                <label htmlFor="numeroDocumento" className="form-label fw-semibold">
                                                    Número de documento
                                                </label>
                                                <input
                                                    id="numeroDocumento"
                                                    className="form-control"
                                                    value={numeroDocumento}
                                                    onChange={(e) => setNumeroDocumento(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : metodoPago === "transbank" ? (
                                    <div className="alert alert-info mb-0">
                                        <strong>Transbank Webpay</strong>
                                        <p className="mb-1">
                                            En una integración real, continuarías en la plataforma de pago.
                                        </p>
                                        <small>Esta versión es una demostración y no realiza transacciones.</small>
                                    </div>
                                ) : (
                                    <div className="alert alert-info mb-0">
                                        <strong>Klap</strong>
                                        <p className="mb-1">
                                            En una integración real, continuarías en la plataforma correspondiente.
                                        </p>
                                        <small>Esta versión es una demostración y no realiza transacciones.</small>
                                    </div>
                                )}

                                {intentoEnviar &&
                                    (metodoPago === "debito" || metodoPago === "credito") &&
                                    !tarjetaValida() && (
                                        <p className="text-danger small mb-0">
                                            Revisa los campos de la tarjeta. Todos deben tener un formato válido.
                                        </p>
                                    )}
                            </div>
                        </div>

                    </div>

                    <aside className="col-12 col-lg-4">
                        <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
                            <div className="card-header bg-success text-white">
                                <h2 className="h5 mb-0">Resumen del Pedido</h2>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    {carrito.map((item) => {
                                        const producto = productos.find(
                                            (p) => p.codigo === item.codigo
                                        );

                                        if (!producto) return null;

                                        return (
                                            <div
                                                key={item.codigo}
                                                className="d-flex justify-content-between mb-3 gap-3"
                                            >
                                                <div>
                                                    <p className="mb-0 fw-semibold">
                                                        {producto.nombre}
                                                    </p>
                                                    <small className="text-muted">
                                                        Cantidad: {item.cantidad}
                                                    </small>
                                                </div>

                                                <span className="text-end">
                                                    {formatoMoneda(producto.precio * item.cantidad)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <hr />

                                <ResumenCompra
                                    subtotal={subtotal}
                                    envio={envio}
                                    mostrarEnvio
                                />

                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg w-100 fw-bold"
                                >
                                    Confirmar Pedido
                                </button>

                                <Link
                                    to="/carrito"
                                    className="btn btn-outline-secondary w-100 mt-2"
                                >
                                    Volver al Carrito
                                </Link>
                            </div>
                        </div>
                    </aside>

                </div>
            </form>
        </main>
    );
}

export default Checkout;
