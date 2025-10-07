'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/Logo'

const securityFeatures = [
  {
    icon: "🔐",
    title: "Encriptación end-to-end",
    description: "Todos tus datos están encriptados en tránsito y en reposo con AES-256"
  },
  {
    icon: "🛡️",
    title: "Autenticación multifactor",
    description: "Protección adicional con 2FA para todos los usuarios"
  },
  {
    icon: "🔍",
    title: "Auditoría completa",
    description: "Registro detallado de todas las acciones y cambios en el sistema"
  },
  {
    icon: "🏢",
    title: "Cumplimiento normativo",
    description: "Certificaciones SOC 2, ISO 27001 y cumplimiento GDPR"
  },
  {
    icon: "💾",
    title: "Backups automáticos",
    description: "Respaldos cada 6 horas con retención de 30 días"
  },
  {
    icon: "🚨",
    title: "Detección de amenazas",
    description: "Monitoreo 24/7 y alertas en tiempo real de actividad sospechosa"
  }
]

const certifications = [
  { name: "SOC 2 Type II", description: "Seguridad y disponibilidad" },
  { name: "ISO 27001", description: "Gestión de seguridad de la información" },
  { name: "GDPR", description: "Protección de datos europeos" },
  { name: "PCI DSS", description: "Seguridad en pagos" }
]

export default function SeguridadPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center">
              <Logo 
                width={168} 
                height={78}
                className="h-20 w-auto object-contain"
              />
            </Link>
            
            <Link 
              href="/" 
              className="text-neutral-300 hover:text-white transition-colors focus-ring rounded-md px-3 py-2"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Seguridad
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                de nivel empresarial
              </span>
            </h1>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Tus datos financieros protegidos con los más altos estándares de seguridad
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Certificaciones y cumplimiento</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">{cert.name}</h3>
                <p className="text-sm text-neutral-400">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Infraestructura robusta</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Cloud de clase mundial</h3>
              <ul className="space-y-4">
                {[
                  "Hosting en AWS con redundancia multi-región",
                  "CDN global para máxima velocidad",
                  "Uptime garantizado del 99.9%",
                  "Escalabilidad automática"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Monitoreo continuo</h3>
              <ul className="space-y-4">
                {[
                  "Equipo de seguridad 24/7",
                  "Pruebas de penetración trimestrales",
                  "Actualizaciones de seguridad automáticas",
                  "Plan de respuesta a incidentes"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">¿Preguntas sobre seguridad?</h2>
          <p className="text-xl text-neutral-300 mb-8">
            Nuestro equipo de seguridad está disponible para resolver todas tus dudas
          </p>
          <Link href="/consulta" className="inline-block bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
            Contactar equipo de seguridad
          </Link>
        </div>
      </section>
    </div>
  )
}
