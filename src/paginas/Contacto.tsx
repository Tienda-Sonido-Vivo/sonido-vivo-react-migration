import { FormularioContacto } from '../componentes/moleculas/CampoFormulario'

interface Props {
  conBorde?: boolean
}

export function SeccionContacto({ conBorde = false }: Props) {
  return (
    <section id="ubicacion" className={`row ${conBorde ? 'border-top pt-5' : ''}`}>
      <div className="col-12 col-md-6 mb-4" id="contactos">
        <h3 className="fw-bold mb-3">Contáctanos</h3>
        <p className="mb-3 text-muted">
          Ubicación: Viña del Mar Libertad 1055, Región de Valparaíso | WhatsApp: +56 9 1234 5678 | Correo: info@tiendavivo.com
        </p>
        <FormularioContacto />
      </div>

      <div className="col-12 col-md-6">
        <h3 className="fw-bold mb-3">Dónde Encontrarnos</h3>
        <div className="ratio ratio-4x3 rounded overflow-hidden shadow-sm">
          <iframe
            title="Mapa de la tienda Sonido Vivo"
            src="https://www.google.com/maps?q=Libertad+1055,+Vi%C3%B1a+del+Mar,+Chile&output=embed"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default function Contacto() {
  return (
    <main className="container my-5">
      <SeccionContacto />
    </main>
  )
}
