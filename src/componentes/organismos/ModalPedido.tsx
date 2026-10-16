// src/componentes/organismos/ModalPedido.tsx

import { useState } from "react";

import type { EstadoPedido, Pedido } from "../../interfaces/Pedido";
import { formatearMoneda } from "../../utilities/formato";

import ModalBase from "../moleculas/ModalBase";


const ORDEN_ESTADOS: EstadoPedido[] = [
    "En preparación",
    "Despachado",
    "Entregado"
];


interface ModalPedidoProps {

    pedido: Pedido;

    onGuardar: (nuevoEstado: EstadoPedido) => void;

    onCerrar: () => void;

}


function ModalPedido({ pedido, onGuardar, onCerrar }: ModalPedidoProps) {

    const [estado, setEstado] = useState<EstadoPedido>(pedido.estado);


    // Un pedido solo puede avanzar: preparación -> despachado -> entregado
    const indiceActual = ORDEN_ESTADOS.indexOf(pedido.estado);

    const estadosPermitidos = ORDEN_ESTADOS.slice(indiceActual);

    const estaEntregado = pedido.estado === "Entregado";


    return (

        <ModalBase
            titulo={"Gestionar pedido " + pedido.codigo}
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

                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={estaEntregado || estado === pedido.estado}
                        onClick={() => onGuardar(estado)}
                    >
                        Actualizar estado
                    </button>

                </>
            }
        >

            <dl className="row mb-3">

                <dt className="col-5 col-md-3">Pedido</dt>
                <dd className="col-7 col-md-9">{pedido.codigo}</dd>

                <dt className="col-5 col-md-3">Cliente</dt>
                <dd className="col-7 col-md-9">
                    {pedido.cliente.nombre} {pedido.cliente.apellidos}
                </dd>

                <dt className="col-5 col-md-3">Total</dt>
                <dd className="col-7 col-md-9">{formatearMoneda(pedido.total)}</dd>

                <dt className="col-5 col-md-3">Estado actual</dt>
                <dd className="col-7 col-md-9">{pedido.estado}</dd>

            </dl>


            <label htmlFor="estadoPedido" className="form-label fw-semibold">
                Nuevo estado
            </label>

            <select
                id="estadoPedido"
                className="form-select"
                value={estado}
                disabled={estaEntregado}
                onChange={(e) => setEstado(e.target.value as EstadoPedido)}
            >

                {estadosPermitidos.map((opcion) => (

                    <option key={opcion} value={opcion}>
                        {opcion}
                    </option>

                ))}

            </select>


            <div className="alert alert-info mt-3 mb-0">

                {estaEntregado
                    ? "Este pedido ya fue entregado y no puede cambiar de estado."
                    : "Solo puedes actualizar el estado del pedido y solo hacia adelante."}

            </div>

        </ModalBase>

    );

}


export default ModalPedido;
