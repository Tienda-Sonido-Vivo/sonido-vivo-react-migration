export interface SeccionArticulo {
  titulo: string
  parrafo: string
  lista?: { etiqueta: string; texto: string }[]
}

export interface Novedad {
  slug: string
  titulo: string
  resumen: string
  categoria: string
  lecturaMin: number
  imagenAlt: string
  imagenId: string
  intro: string
  secciones: SeccionArticulo[]
  cta: { texto: string; ruta: string }
}

const unsplash = (id: string, ancho: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${ancho}&q=80`

export const imagenNovedad = (n: Novedad, ancho: number) => unsplash(n.imagenId, ancho)

export const novedades: Novedad[] = [
  {
    slug: 'guitarra',
    titulo: '¿Cómo elegir tu primera guitarra acústica?',
    resumen:
      'Conoce algunos aspectos importantes que debes considerar al elegir una guitarra acústica, como el tamaño, los materiales, la comodidad y el tipo de sonido.',
    categoria: 'Guías de Compra',
    lecturaMin: 4,
    imagenAlt: 'Guitarra Acústica',
    imagenId: 'photo-1510915361894-db8b60106cb1',
    intro:
      'Elegir tu primera guitarra es un paso emocionante. En el mercado existen muchas opciones, por lo que te presentamos los puntos clave para tomar la mejor decisión.',
    secciones: [
      {
        titulo: '1. Tamaño y comodidad',
        parrafo:
          'El cuerpo debe adaptarse bien a tu estatura. Un cuerpo Dreadnought proyecta mucho volumen, mientras que un cuerpo Concert o Parlor ofrece mayor comodidad al practicar por varias horas.',
      },
      {
        titulo: '2. Materiales y maderas',
        parrafo: 'Las maderas definen el timbre del sonido:',
        lista: [
          { etiqueta: 'Abeto (Spruce):', texto: 'Ofrece un sonido brillante, claro y con excelente resonancia.' },
          { etiqueta: 'Caoba (Mahogany):', texto: 'Aporta un tono cálido, suave y centrado en rangos medios.' },
        ],
      },
      {
        titulo: '3. Tipo de cuerdas',
        parrafo:
          'Las guitarras clásicas utilizan cuerdas de nylon (más suaves al tacto), mientras que las acústicas llevan cuerdas de metal para un sonido brillante y potente.',
      },
      {
        titulo: '4. Recomendación Sonido Vivo',
        parrafo:
          'Te invitamos a revisar los modelos de guitarras en nuestro catálogo, ajustadas para ofrecer la mejor experiencia desde el primer día.',
      },
    ],
    cta: { texto: 'Ver Catálogo', ruta: '/' },
  },
  {
    slug: 'reparacion',
    titulo: 'Mantenimiento y reparación de instrumentos de cuerda',
    resumen:
      'Conoce los principales cuidados que necesitan las guitarras, bajos y otros instrumentos de cuerda, y cuándo es recomendable recurrir a un servicio de reparación.',
    categoria: 'Taller y Cuidados',
    lecturaMin: 5,
    imagenAlt: 'Reparación de Instrumentos',
    imagenId: 'photo-1564186763535-ebb21ef5277f',
    intro:
      'Los instrumentos de cuerda requieren cuidados continuos para mantener su sonido, quintado y durabilidad a lo largo del tiempo.',
    secciones: [
      {
        titulo: '1. Limpieza diaria',
        parrafo:
          'Limpia las cuerdas y el diapasón con un paño de microfibra seco después de tocar para evitar que el sudor inactive o desgaste el material.',
      },
      {
        titulo: '2. Cambio de cuerdas',
        parrafo:
          'Se recomienda cambiar las cuerdas cada 2 a 3 meses para conservar una afinación estable y un tono brillante.',
      },
      {
        titulo: '3. Cuándo llevarlo al taller',
        parrafo:
          'Acude a un especialista si notas trasteos en las notas, cuerdas excesivamente altas o ruidos estáticos en los componentes electrónicos.',
      },
      {
        titulo: '4. Servicio Técnico Sonido Vivo',
        parrafo:
          'En Sonido Vivo ofrecemos servicios de calibración, quintado y mantenimiento integral para instrumentos de cuerda.',
      },
    ],
    cta: { texto: 'Ver Servicios', ruta: '/nosotros' },
  },
]