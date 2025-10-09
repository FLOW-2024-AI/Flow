'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

const steps = [
  {
    number: "01",
    title: "Conecta. Todo tu ecosistema en días.",
    description: "No reemplazamos nada. Conectamos tu ERP (QuickBooks, Siigo, Concar), bancos (BCP, BBVA, Interbank) y SUNAT automáticamente.",
    icon: "🔌",
    time: "2 semanas",
    details: [
      "API segura con encriptación end-to-end",
      "Zero downtime - Sin interrumpir operaciones",
      "Integraciones pre-construidas con ERPs y bancos",
      "Soporte técnico en español"
    ],
    stat: "Multi-sistema"
  },
  {
    number: "02",
    title: "RPA trabaja. Tú descansas.",
    description: "Nuestros robots automatizan conciliación bancaria, clasificación de gastos, recordatorios y más. Reduce 80% el tiempo manual.",
    icon: "🤖",
    time: "Inmediato",
    details: [
      "Conciliación bancaria automática en minutos",
      "Clasificación automática con IA",
      "Detección de duplicados y errores",
      "Automatización continua de tareas repetitivas"
    ],
    stat: "80% menos tiempo"
  },
  {
    number: "03",
    title: "IA analiza. Tú decides mejor.",
    description: "Dashboard CFO con score de salud financiera, predicciones ML y alertas proactivas. Decisiones basadas en datos, no intuición.",
    icon: "🧠",
    time: "Tiempo real",
    details: [
      "Health Score financiero en vivo",
      "Predicciones: Ingresos, gastos, flujo",
      "Alertas antes de que surjan problemas",
      "Copiloto IA responde tus preguntas"
    ],
    stat: "Precisión avanzada"
  },
  {
    number: "04",
    title: "Financia. Cuando lo necesitas.",
    description: "Accede a Confirming, Factoring y líneas Flash desde la plataforma. Aprobación rápida.",
    icon: "💰",
    time: "24-48h",
    details: [
      "Confirming: Paga a proveedores, cobra después",
      "Factoring: Anticipa facturas al instante",
      "Líneas Flash: Crédito rápido",
      "Múltiples instituciones financieras integradas"
    ],
    stat: "Financiamiento ágil"
  }
]

export default function ComoFuncionaPage() {
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
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-sm font-semibold text-blue-400 mb-6">
              ⚡ De 0 a automatizado en 2 semanas
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Conecta. Automatiza. Analiza.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Financia.
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-400 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Flow no reemplaza tu ERP. Es la capa inteligente que conecta todo tu ecosistema financiero.
              <span className="text-gray-900 dark:text-gray-900 dark:text-white font-semibold"> 4 pasos. ROI 450%.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Setup: 2 semanas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Ahorro: 80% tiempo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">ROI: 450%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20 last:mb-0"
            >
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{step.number}</div>
                    <div className="text-6xl">{step.icon}</div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-semibold">
                      ⏱️ {step.time}
                    </span>
                    <span className="text-xs px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-semibold">
                      ✓ {step.stat}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h2>
                  <p className="text-base text-gray-400 dark:text-gray-300 mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-400 dark:text-gray-300">
                        <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gray-200 dark:border-gray-700">
                    <Image
                      src={`https://images.unsplash.com/photo-${
                        index === 0 ? '1551288049-bebda4e38f71' : // Conexión/Tecnología
                        index === 1 ? '1460925895917-afdab827c52f' : // Dashboard/Analytics
                        index === 2 ? '1551434678-e076c223a692' : // IA/Cerebro
                        '1579621970563-ebec7560ff3e' // Finanzas/Dinero
                      }?w=800&h=800&fit=crop&q=80`}
                      alt={step.title}
                      fill
                      className="object-cover opacity-40"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-secondary-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-16">Timeline de implementación</h2>
          <div className="space-y-8">
            {[
              { week: "Semana 1-2", title: "Onboarding y configuración", desc: "Conectamos sistemas y configuramos accesos" },
              { week: "Semana 3-4", title: "Personalización", desc: "Adaptamos flujos a tu operación específica" },
              { week: "Semana 5-6", title: "Capacitación", desc: "Entrenamos a tu equipo en el uso de Flow" },
              { week: "Semana 7+", title: "Go Live y optimización", desc: "Lanzamiento y mejora continua" }
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0 w-32 text-blue-400 font-bold">{phase.week}</div>
                <div className="flex-1 bg-gray-100 dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-sm font-bold mb-2">{phase.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{phase.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-6 py-2 text-sm font-semibold text-green-400 mb-6">
              ✓ Implementación en 2 semanas • ROI 450%
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              De Excel a IA.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                En 2 semanas.
              </span>
            </h2>
            <p className="text-lg text-gray-400 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Más de 20 empresas ya automatizaron sus finanzas con Flow. 
              <span className="text-gray-900 dark:text-gray-900 dark:text-white font-semibold"> Reduce 80% el tiempo manual.</span> 
              {' '}Agenda tu demo y empieza hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/consulta" className="inline-block bg-white dark:bg-secondary-800 dark:bg-secondary-800 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-full font-bold text-base hover:opacity-90 transition-opacity shadow-xl">
                Agendar demo gratuita →
              </Link>
              <Link href="/precios" className="inline-block border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base hover:border-neutral-500 hover:bg-gray-100 dark:bg-secondary-800 transition-all">
                Ver precios
              </Link>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              Sin tarjeta de crédito • Setup en 48h • Soporte 24/7 en español
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
