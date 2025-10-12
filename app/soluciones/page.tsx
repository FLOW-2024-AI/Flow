'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const solutions = [
  {
    title: "RPA + IA: Automatización Inteligente",
    description: "Elimina 80% del trabajo manual. Conecta tu ERP, bancos y SUNAT automáticamente.",
    icon: "🤖",
    impact: "450% ROI promedio",
    features: [
      "Sincronización automática con ERPs (QuickBooks, Siigo, Concar)",
      "Conciliación bancaria automática en minutos",
      "Clasificación inteligente de gastos con IA",
      "Detección automática de duplicados y errores"
    ],
    color: "from-primary-500 to-secondary-500",
    stat: "80% menos tiempo manual"
  },
  {
    title: "CFO Digital: Dashboard Ejecutivo",
    description: "Score de salud financiera, ratios, predicciones ML y alertas proactivas en tiempo real.",
    icon: "💚",
    impact: "Tiempo real",
    features: [
      "Health Score financiero actualizado en vivo",
      "Ratios clave: Liquidez, Endeudamiento, ROE, Margen",
      "Predicciones con ML: Ingresos, gastos, flujo neto",
      "Alertas inteligentes antes de que surjan problemas"
    ],
    color: "from-secondary-500 to-secondary-600",
    stat: "100% visibilidad en tiempo real"
  },
  {
    title: "Integraciones: Open Banking",
    description: "Conecta bancos peruanos, ERPs y SUNAT. Sincronización automática continua.",
    icon: "🏦",
    impact: "Multi-sistema",
    features: [
      "Open Banking con bancos peruanos (BCP, BBVA, Interbank)",
      "Integración SUNAT: SOL, PLAME, PLE, SIRE",
      "Pasarelas: Mercado Pago, Niubiz, Culqi",
      "API abierta para tu sistema custom"
    ],
    color: "from-blue-500 to-cyan-600",
    stat: "Sincronización continua"
  },
  {
    title: "Ecosistema Financiero",
    description: "Accede a Confirming, Factoring y líneas Flash desde la plataforma.",
    icon: "💰",
    impact: "Financiamiento",
    features: [
      "Confirming: Paga a proveedores, cobra después",
      "Factoring: Anticipa tus facturas al instante",
      "Líneas Flash: Crédito en 24-48 horas",
      "Múltiples instituciones financieras conectadas"
    ],
    color: "from-orange-500 to-red-600",
    stat: "Aprobación rápida"
  },
  {
    title: "Compliance SUNAT Automático",
    description: "PLAME, PLE, SIRE y libros electrónicos generados automáticamente.",
    icon: "🏛️",
    impact: "100% compliance",
    features: [
      "PLAME: Generación automática de planilla",
      "PLE: Libros electrónicos automáticos",
      "SIRE: Sincronización de facturas",
      "Alertas de vencimientos tributarios"
    ],
    color: "from-secondary-600 to-primary-600",
    stat: "Cumplimiento garantizado"
  },
  {
    title: "Copiloto IA Conversacional",
    description: "Pregunta en lenguaje natural. Como hablar con tu CFO personal.",
    icon: "💬",
    impact: "IA avanzada",
    features: [
      "\"¿Cuál es mi flujo de caja proyectado?\"",
      "\"¿Qué clientes me deben más de 30 días?\"",
      "\"¿Puedo pagar esta factura sin afectar liquidez?\"",
      "Insights proactivos y recomendaciones"
    ],
    color: "from-primary-600 to-secondary-500",
    stat: "Respuestas instantáneas"
  }
]

export default function SolucionesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary-400 to-secondary-400 rounded-full blur-3xl opacity-20"
        />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 border border-primary-200 dark:border-primary-800 rounded-full px-6 py-2.5 text-sm font-bold text-primary-900 dark:text-primary-100 mb-6 shadow-lg">
              🚀 6 Soluciones. 1 Plataforma. ROI 450%
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              No reemplazamos tu ERP.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500">
                Lo conectamos todo.
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-400 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Flow es la capa inteligente que conecta tu ERP, bancos, SUNAT y más. 
              <span className="text-gray-900 dark:text-white font-semibold"> RPA automatiza, IA analiza, tú decides.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Conecta tu ecosistema</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">80% menos tiempo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">450% ROI</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-gray-100 dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 hover:border-gray-300 dark:border-gray-600 transition-all relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-10 blur-3xl transition-all duration-500`}></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-2xl flex items-center justify-center text-3xl shadow-xl`}>
                      {solution.icon}
                    </div>
                    <div className={`text-right`}>
                      <div className={`text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r ${solution.color}`}>
                        {solution.impact}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gray-900 dark:text-white transition-colors">{solution.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">{solution.description}</p>
                  <ul className="space-y-3 mb-6">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-400 dark:text-gray-300">
                        <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className={`pt-4 border-t border-gray-200 dark:border-gray-700 text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r ${solution.color}`}>
                    {solution.stat}
                  </div>
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
              ✓ Implementación en 2 semanas • Sin contratos largos
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Reduce 80% el tiempo manual.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Empieza hoy.
              </span>
            </h2>
            <p className="text-lg text-gray-400 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Más de 20 empresas ya confían en Flow. 
              <span className="text-gray-900 dark:text-white font-semibold"> ROI promedio: 450%.</span> 
              {' '}Agenda tu demo gratuita y descubre por qué.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/consulta" className="inline-block bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-full font-bold text-base hover:opacity-90 transition-opacity shadow-xl">
                Agendar demo gratuita →
              </Link>
              <Link href="/precios" className="inline-block border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base hover:border-neutral-500 hover:bg-gray-100 dark:bg-secondary-800 transition-all">
                Ver precios
              </Link>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              Sin tarjeta de crédito • Implementación en 48h • Soporte en español
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
