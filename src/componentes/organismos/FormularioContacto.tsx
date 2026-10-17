import { useState } from 'react'
import type { ChangeEvent, FocusEvent, FormEvent } from 'react'

type Campo = 'nombre' | 'correo' | 'mensaje'
type Valores = Record<Campo, string>
type Errores = Partial<Record<Campo, string>>

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALORES_INICIALES: Valores = { nombre: '', correo: '', mensaje: '' }

function validar(v: Valores): Errores {
  const errores: Errores = {}

  if (!v.nombre.trim() || v.nombre.length > 100) {
    errores.nombre = 'El nombre es obligatorio y debe tener máximo 100 caracteres.'
  }

  if (!v.correo.trim()) {
    errores.correo = 'El correo es obligatorio.'
  } else if (!REGEX_EMAIL.test(v.correo) || v.correo.length > 100) {
    errores.correo = 'Ingresa un correo con formato válido (máximo 100 caracteres).'
  }

  if (!v.mensaje.trim() || v.mensaje.length > 500) {
    errores.mensaje = 'El comentario es obligatorio y debe tener máximo 500 caracteres.'
  }

  return errores
}

export default function FormularioContacto() {
  const [valores, setValores] = useState<Valores>(VALORES_INICIALES)
  const [errores, setErrores] = useState<Errores>({})
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({})
  const [enviado, setEnviado] = useState(false)

  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const campo = e.target.name as Campo
    const nuevos = { ...valores, [campo]: e.target.value }
    setValores(nuevos)
    setEnviado(false)
    if (tocados[campo]) setErrores(validar(nuevos))
  }

  const manejarBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const campo = e.target.name as Campo
    setTocados((prev) => ({ ...prev, [campo]: true }))
    setErrores(validar(valores))
  }

  const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const erroresActuales = validar(valores)
    setErrores(erroresActuales)
    setTocados({ nombre: true, correo: true, mensaje: true })

    if (Object.keys(erroresActuales).length === 0) {
      setEnviado(true)
      setValores(VALORES_INICIALES)
      setTocados({})
      setErrores({})
    }
  }

  const clase = (campo: Campo) => {
    if (!tocados[campo]) return 'form-control'
    return `form-control ${errores[campo] ? 'is-invalid' : 'is-valid'}`
  }

  return (
    <form id="formContacto" onSubmit={manejarEnvio} noValidate>
      {enviado && (
        <div className="alert alert-success" role="status">
          ¡Mensaje enviado exitosamente!
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="nombreContacto" className="form-label">Nombre *</label>
        <input
          id="nombreContacto"
          name="nombre"
          type="text"
          className={clase('nombre')}
          value={valores.nombre}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          maxLength={100}
          placeholder="Tu nombre completo"
        />
        <div className="invalid-feedback">{errores.nombre}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="correoContacto" className="form-label">Correo electrónico *</label>
        <input
          id="correoContacto"
          name="correo"
          type="email"
          className={clase('correo')}
          value={valores.correo}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          maxLength={100}
          placeholder="ejemplo@correo.com"
        />
        <div className="invalid-feedback">{errores.correo}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="mensajeContacto" className="form-label">Comentario o mensaje *</label>
        <textarea
          id="mensajeContacto"
          name="mensaje"
          rows={4}
          className={clase('mensaje')}
          value={valores.mensaje}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          maxLength={500}
          placeholder="Escribe tu consulta aquí..."
        />
        <div className="form-text">{valores.mensaje.length}/500</div>
        <div className="invalid-feedback">{errores.mensaje}</div>
      </div>

      <button type="submit" className="btn text-white fw-bold" style={{ backgroundColor: '#005f7f' }}>
        Enviar mensaje
      </button>
    </form>
  )
}