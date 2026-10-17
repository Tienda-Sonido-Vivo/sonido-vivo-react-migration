import { Link } from 'react-router-dom'
import { novedades, imagenNovedad } from '../datos/novedades'

export default function Novedades() {
  return (
    <main className="container my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold color-azul">Novedades y Consejos</h1>
        <p className="lead text-muted">
          Descubre las últimas noticias, guías y consejos del mundo de la música y el cuidado de tus instrumentos.
        </p>
      </div>

      <div className="row g-4">
        {novedades.map((n) => (
          <div className="col-12 col-md-6" key={n.slug}>
            <div className="card h-100 shadow-sm border-0 bg-light">
              <img
                src={imagenNovedad(n, 800)}
                className="card-img-top"
                alt={n.imagenAlt}
                style={{ height: 250, objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h3 className="card-title h4 fw-bold">{n.titulo}</h3>
                <p className="card-text flex-grow-1">{n.resumen}</p>
                <div className="mt-3">
                  <Link
                    to={`/novedades/${n.slug}`}
                    className="btn btn-outline-primary fw-bold"
                    style={{ borderColor: '#005f7f', color: '#005f7f' }}
                  >
                    Leer más &raquo;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
