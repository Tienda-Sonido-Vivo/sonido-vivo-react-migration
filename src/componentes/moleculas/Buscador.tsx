// src/componentes/moleculas/Buscador.tsx

function Buscador() {

    return (

        <form className="d-flex ms-3" role="search">

            <input
                className="form-control form-control-sm me-2"
                type="search"
                placeholder="Buscar..."
                aria-label="Buscar"
            />

            <button
                className="btn btn-outline-light btn-sm"
                type="submit"
            >
                Buscar
            </button>

        </form>

    );

}

export default Buscador;