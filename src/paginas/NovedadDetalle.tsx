import { Link, useParams } from 'react-router-dom'
import { novedades, imagenNovedad } from '../datos/novedades'

export default function NovedadDetalle() {
  const { slug } = useParams<{ slug: string }>()
  const novedad = novedades.find((n) => n.slug === slug)

  if (!novedad) {
    return (
      <main className="container my-5 text-center">
        <h1 className="fw-bold mb-3">Novedad no encontrada</h1>
        <p className="text-muted">El artículo que buscas no existe o fue retirado.</p>
        <Link to="/novedades" className="btn btn-secondary">&laquo; Volver a Novedades</Link>
      </main>
    )
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <Link to="/novedades" className="btn btn-outline-secondary mb-4">
            &laquo; Volver a Novedades
          </Link>

          <h1 className="fw-bold mb-3 color-azul">{novedad.titulo}</h1>
          <p className="text-muted mb-4">
            Publicado en {novedad.categoria} &bull; Lectura de {novedad.lecturaMin} min
          </p>

          <img
            src={imagenNovedad(novedad, 1200)}
            className="img-fluid rounded shadow-sm mb-4 w-100"
            style={{ maxHeight: 400, objectFit: 'cover' }}
            alt={novedad.imagenAlt}
          />

          <div className="contenido-articulo">
            <p className="lead mb-4">{novedad.intro}</p>

            {novedad.secciones.map((s) => (
              <section key={s.titulo}>
                <h3 className="fw-bold text-dark mt-4">{s.titulo}</h3>
                <p>{s.parrafo}</p>
                {s.lista && (
                  <ul>
                    {s.lista.map((item) => (
                      <li key={item.etiqueta}>
                        <strong>{item.etiqueta}</strong> {item.texto}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <hr className="my-5" />

          <div className="d-flex justify-content-between align-items-center">
            <Link to="/novedades" className="btn btn-secondary">&laquo; Volver a Novedades</Link>
            <Link
              to={novedad.cta.ruta}
              className="btn btn-primary"
              style={{ backgroundColor: '#005f7f', borderColor: '#005f7f' }}
            >
              {novedad.cta.texto}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
