'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const caseStudies = [
  {
    company: 'TechCorp',
    industry: 'Tecnología',
    logo: 'https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=TechCorp',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80',
    challenge: 'Cierre mensual tomaba 10 días con múltiples errores de conciliación',
    solution: 'Implementación de Flow con automatización completa de conciliación bancaria y cuentas por pagar',
    results: [
      { metric: '80%', label: 'Reducción en tiempo de cierre' },
      { metric: '$120K', label: 'Ahorros anuales' },
      { metric: '99.9%', label: 'Precisión en datos' }
    ],
    testimonial: {
      quote: 'Flow transformó completamente nuestra operación financiera. Lo que antes tomaba semanas ahora toma horas.',
      author: 'María González',
      role: 'CFO'
    }
  },
  {
    company: 'RetailMax',
    industry: 'Retail',
    logo: 'https://via.placeholder.com/200x80/10B981/FFFFFF?text=RetailMax',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80',
    challenge: 'Gestión manual de 500+ facturas mensuales con alto riesgo de error',
    solution: 'OCR inteligente y flujos de aprobación automatizados con Flow',
    results: [
      { metric: '95%', label: 'Reducción en errores' },
      { metric: '3 días', label: 'Tiempo de procesamiento' },
      { metric: '200hrs', label: 'Ahorradas mensualmente' }
    ],
    testimonial: {
      quote: 'La automatización de facturas nos permitió escalar sin contratar más personal. ROI en el primer mes.',
      author: 'Carlos Mendoza',
      role: 'Controller'
    }
  },
  {
    company: 'LogiPro',
    industry: 'Logística',
    logo: 'https://via.placeholder.com/200x80/8B5CF6/FFFFFF?text=LogiPro',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80',
    challenge: 'Sin visibilidad en tiempo real del flujo de caja en múltiples ubicaciones',
    solution: 'Dashboard centralizado con conexión a 15 cuentas bancarias y 3 ERPs',
    results: [
      { metric: '100%', label: 'Visibilidad en tiempo real' },
      { metric: '15', label: 'Cuentas integradas' },
      { metric: '24/7', label: 'Monitoreo automático' }
    ],
    testimonial: {
      quote: 'Ahora tomamos decisiones basadas en datos actualizados al segundo. Game changer total.',
      author: 'Ana Ruiz',
      role: 'Directora Financiera'
    }
  }
]

export default function CasosExitoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-800 dark:bg-secondary-800 dark:bg-secondary-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">
              Casos de Éxito
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              Empresas que transformaron{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                sus finanzas con Flow
              </span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre cómo empresas líderes están automatizando sus procesos financieros y obteniendo resultados extraordinarios
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-32">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Image */}
              <div className={`relative h-[400px] rounded-3xl overflow-hidden ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <Image
                  src={study.image}
                  alt={study.company}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <Image
                    src={study.logo}
                    alt={`${study.company} logo`}
                    width={200}
                    height={80}
                    className="opacity-90"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-6">
                  <span className="text-xs font-semibold text-blue-400">{study.industry}</span>
                </div>

                <h2 className="text-xl font-semibold mb-6">{study.company}</h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-red-400 mb-2">El Desafío</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{study.challenge}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-blue-400 mb-2">La Solución</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{study.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {study.results.map((result, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                      <div className="text-lg font-bold text-blue-400 mb-1">{result.metric}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{result.label}</div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="bg-gray-100 dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <p className="text-sm text-gray-400 dark:text-gray-300 mb-4 italic">
                    "{study.testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {study.testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{study.testimonial.author}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{study.testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-4">¿Listo para tu historia de éxito?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Únete a las empresas que ya están transformando sus finanzas con Flow
          </p>
          <Link href="/consulta" className="inline-block bg-white dark:bg-secondary-800 dark:bg-secondary-800 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
            Agendar consulta gratuita
          </Link>
        </div>
      </section>
    </div>
  )
}
