// src/componentes/organismos/CarruselPrincipal.tsx

function CarruselPrincipal() {

    return (

        <div
            id="carouselSonidoVivo"
            className="carousel slide"
            data-bs-ride="carousel"
        >

            <div className="carousel-inner">

                <div className="carousel-item active">

                    <img
                        src="/img/carruseles/SonidoVivoPortada1.jpeg"
                        className="d-block w-100"
                        alt="Instrumentos musicales Sonido Vivo"
                    />

                    <div className="textoCarrusel">

                        <h1>
                            Vive la Experiencia de la Música
                        </h1>

                    </div>

                </div>

                <div className="carousel-item">

                    <img
                        src="/img/carruseles/FondoRock.jpg"
                        className="d-block w-100"
                        alt="Ambiente de música rock"
                    />

                    <div className="textoCarrusel">

                        <h1>
                            Vive la Experiencia de la Música
                        </h1>

                    </div>

                </div>

                <div className="carousel-item">

                    <img
                        src="/img/carruseles/FondoPiano.jpeg"
                        className="d-block w-100"
                        alt="Piano"
                    />

                    <div className="textoCarrusel">

                        <h1>
                            Vive la Experiencia de la Música
                        </h1>

                    </div>

                </div>

            </div>

            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselSonidoVivo"
                data-bs-slide="prev"
            >

                <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                ></span>

                <span className="visually-hidden">
                    Anterior
                </span>

            </button>

            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselSonidoVivo"
                data-bs-slide="next"
            >

                <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                ></span>

                <span className="visually-hidden">
                    Siguiente
                </span>

            </button>

        </div>

    );

}

export default CarruselPrincipal;