import FormularioContacto from '../componentes/organismos/FormularioContacto'

interface Props {
  conBorde?: boolean
}

export function SeccionContacto({ conBorde = false }: Props) {
  return (
    <section id="ubicacion" className={`row ${conBorde ? 'border-top pt-5' : ''}`}>
      <div className="col-12 col-md-6 mb-4" id="contactos">
        <h3 className="fw-bold mb-3">Contáctanos</h3>
        <p className="mb-3 text-muted">
          Ubicación: Libertad 1055 Viña del Mar, Región de Valparaíso | WhatsApp: +56 9 5555 5555 | info@tiendavivo.cl
        </p>
        <FormularioContacto />
      </div>

      <div className="col-12 col-md-6">
        <h3 className="fw-bold mb-3">Dónde Encontrarnos</h3>
        <div className="bg-secondary text-white rounded p-5 text-center">
          <p className="mb-0 fs-5">[ Mapa interactivo de la tienda física ]</p>
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
