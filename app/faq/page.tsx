'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "¿Qué es Flow?",
        a: "Flow es una plataforma de RPA + IA que conecta y automatiza tu ecosistema financiero. No reemplazamos tu ERP, lo potenciamos conectándolo con bancos, SUNAT y más para automatizar tareas manuales."
      },
      {
        q: "¿Cuánto tiempo toma la implementación?",
        a: "La implementación típica toma 2 semanas. Esto incluye la conexión con tus sistemas, configuración de automatizaciones y capacitación del equipo."
      },
      {
        q: "¿Necesito reemplazar mi ERP actual?",
        a: "No. Flow se integra con tu ERP existente (QuickBooks, Siigo, Concar, etc.). Somos la capa inteligente que conecta todos tus sistemas."
      }
    ]
  },
  {
    category: "Precios y Planes",
    questions: [
      {
        q: "¿Cuánto cuesta Flow?",
        a: "Tenemos 3 planes: Essentials ($399/mes), Professional ($799/mes) y Enterprise (personalizado). Todos incluyen implementación y capacitación."
      },
      {
        q: "¿Hay período de prueba?",
        a: "Sí, ofrecemos 30 días de prueba gratuita. No se requiere tarjeta de crédito."
      },
      {
        q: "¿Puedo cambiar de plan?",
        a: "Sí, puedes actualizar o reducir tu plan en cualquier momento. Los cambios se aplican en el siguiente ciclo de facturación."
      }
    ]
  },
  {
    category: "Integraciones",
    questions: [
      {
        q: "¿Con qué sistemas se integra Flow?",
        a: "Flow se integra con ERPs (QuickBooks, Siigo, Concar), bancos peruanos (BCP, BBVA, Interbank), SUNAT (SOL, PLAME, PLE, SIRE) y pasarelas de pago (Mercado Pago, Niubiz, Culqi)."
      },
      {
        q: "¿Cuánto tiempo toma conectar mis sistemas?",
        a: "Las integraciones estándar se configuran en 1-3 días. Integraciones personalizadas pueden tomar más tiempo según la complejidad."
      },
      {
        q: "¿Es segura la conexión con mis bancos?",
        a: "Sí, usamos Open Banking con encriptación end-to-end y cumplimos con estándares SOC 2, ISO 27001 y regulaciones locales."
      }
    ]
  },
  {
    category: "Seguridad",
    questions: [
      {
        q: "¿Cómo protegen mis datos?",
        a: "Usamos encriptación AES-256, autenticación multi-factor, backups automáticos cada 6 horas y cumplimos con SOC 2, GDPR e ISO 27001."
      },
      {
        q: "¿Dónde se almacenan mis datos?",
        a: "Tus datos se almacenan en servidores seguros en la nube (AWS/Azure) con redundancia geográfica y backups automáticos."
      },
      {
        q: "¿Quién tiene acceso a mi información?",
        a: "Solo tu equipo autorizado tiene acceso. Nuestro equipo técnico solo accede con tu permiso explícito para soporte."
      }
    ]
  },
  {
    category: "Soporte",
    questions: [
      {
        q: "¿Qué tipo de soporte ofrecen?",
        a: "Essentials: Email (48h), Professional: Chat prioritario (4h), Enterprise: Soporte 24/7 + Account Manager dedicado."
      },
      {
        q: "¿Ofrecen capacitación?",
        a: "Sí, todos los planes incluyen capacitación inicial. Enterprise incluye capacitación continua y on-site si es necesario."
      },
      {
        q: "¿Hay documentación disponible?",
        a: "Sí, tenemos documentación completa, videos tutoriales y una base de conocimientos actualizada constantemente."
      }
    ]
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-800 dark:bg-secondary-800 dark:bg-secondary-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl text-gray-400 dark:text-gray-300">
              Todo lo que necesitas saber sobre Flow
            </p>
          </motion.div>

          <div className="space-y-12">
            {faqs.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="text-2xl font-bold mb-6 text-blue-400">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, idx) => {
                    const key = `${catIdx}-${idx}`
                    const isOpen = openIndex === key
                    
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-100 dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : key)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 dark:bg-secondary-700/50 transition-colors"
                        >
                          <span className="font-semibold text-lg">{faq.q}</span>
                          <svg
                            className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-4"
                          >
                            <p className="text-gray-400 dark:text-gray-300 leading-relaxed">{faq.a}</p>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">¿No encuentras tu respuesta?</h3>
            <p className="text-gray-400 dark:text-gray-300 mb-6">
              Nuestro equipo está listo para ayudarte
            </p>
            <Link
              href="/consulta"
              className="inline-block bg-white dark:bg-secondary-800 dark:bg-secondary-800 text-gray-900 dark:text-gray-100 px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
