interface SelectorCantidadProps {
    cantidad: number;
    stock: number;
    onAumentar: () => void;
    onDisminuir: () => void;
}

function SelectorCantidad({
    cantidad,
    stock,
    onAumentar,
    onDisminuir
}: SelectorCantidadProps) {

    return (

        <div className="mb-4">

            <label className="form-label fw-semibold">
                Cantidad
            </label>

            <div
                className="btn-group"
                role="group"
                aria-label="Cantidad"
            >

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onDisminuir}
                    disabled={cantidad <= 1}
                >
                    −
                </button>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled
                >
                    {cantidad}
                </button>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onAumentar}
                    disabled={cantidad >= stock}
                >
                    +
                </button>

            </div>

        </div>

    );

}

export default SelectorCantidad;