'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const plans = [
  {
    name: "Essential",
    price: "$99",
    period: "/mes",
    description: "Digitaliza tus facturas. Perfecto para PYMEs que están empezando su transformación digital.",
    tagline: "Para Iniciar",
    limit: "Hasta 350 facturas/mes",
    features: [
      "Procesamiento automático de facturas por correo",
      "Dashboard financiero básico",
      "Validación con SUNAT",
      "Extracción de datos con IA",
      "Alertas de nuevas facturas",
      "Soporte por email (48h)"
    ],
    popular: false,
    color: "blue",
    savings: "Ahorra 20h/mes",
    ideal: "PYMEs no digitalizadas"
  },
  {
    name: "Flow",
    price: "$150",
    period: "/mes",
    description: "Automatización completa. Para PYMEs digitalizadas que buscan eficiencia máxima.",
    tagline: "Más popular",
    limit: "Hasta 600 facturas/mes",
    features: [
      "Incluye todo lo de Essential",
      "Integración directa con tu ERP",
      "Agente IA contextual para consultas",
      "Sincronización automática en tiempo real",
      "Analytics avanzados",
      "Multi-usuario (hasta 5)"
    ],
    popular: true,
    color: "green",
    savings: "Ahorra 40h/mes",
    ideal: "PYMEs digitalizadas"
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Sin límites. Solución empresarial a medida según tu volumen y necesidades específicas.",
    tagline: "Solución Completa",
    limit: "Facturas ilimitadas",
    features: [
      "Incluye todo lo de Flow",
      "Facturas ilimitadas",
      "Multi-empresa",
      "Usuarios ilimitados",
      "Integraciones custom ilimitadas",
      "Soporte dedicado 24/7"
    ],
    popular: false,
    color: "blue",
    savings: "ROI 450%+",
    ideal: "Empresas con alto volumen"
  },
  {
    name: "CFO Digital",
    price: "$350",
    period: "/mes",
    description: "El futuro de la gestión financiera. Suite completa de apps para el CFO moderno.",
    tagline: "Próximamente",
    limit: "Todo Flow +",
    features: [
      "Analytics avanzado",
      "Predicciones con IA",
      "Planificación estratégica",
      "Presupuesto inteligente",
      "Flujo de caja proyectado",
      "Gestión de riesgos"
    ],
    popular: false,
    color: "purple",
    savings: "Suite completa",
    ideal: "CFOs visionarios",
    comingSoon: true
  }
]

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6">
                Desde $99/mes • ROI promedio 450%
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Planes que se adaptan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-primary-500">
                  a tu crecimiento.
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed">
                Desde PYMEs que inician su digitalización hasta empresas con alto volumen de facturas.
                <span className="text-gray-900 dark:text-white font-semibold"> Paga solo por lo que necesitas.</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sin contratos largos • Cancela cuando quieras • 14 días de prueba gratis
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={plan.name}
                  className={`relative bg-gray-50 dark:bg-[#252525] border rounded-2xl p-6 lg:p-8 transition-colors duration-200 ${
                    plan.popular 
                      ? 'border-green-500 ring-2 ring-green-500/20' 
                      : plan.comingSoon
                      ? 'border-purple-500/30 ring-2 ring-purple-500/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-gray-900 dark:text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl">
                        {plan.tagline}
                      </span>
                    </div>
                  )}
                  {!plan.popular && plan.tagline && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gray-200 dark:bg-[#2F2F2F] text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-semibold border border-gray-300 dark:border-gray-600">
                        {plan.tagline}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-3">{plan.limit}</p>
                    <div className="mb-3">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-lg">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{plan.description}</p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                      <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-semibold text-blue-400">
                        {plan.savings}
                      </div>
                      <div className="inline-block bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs font-semibold text-purple-400">
                        {plan.ideal}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {plan.comingSoon ? (
                      <button 
                        disabled
                        className="w-full block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 border bg-purple-600/10 border-purple-500/30 text-purple-400 cursor-not-allowed"
                      >
                        Próximamente
                      </button>
                    ) : plan.name === 'Enterprise' ? (
                      <Link 
                        href="/consulta"
                        className={`w-full block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 border ${
                          plan.popular
                            ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                            : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                        }`}
                      >
                        Contactar Ventas
                      </Link>
                    ) : (
                      <Link 
                        href="/consulta"
                        className={`w-full block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 border ${
                          plan.popular
                            ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                            : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        Comenzar Prueba
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* FAQ Section */}
            <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Preguntas Frecuentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Hay período de prueba gratuito?</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Sí, ofrecemos 14 días de prueba gratuita para los planes Essential y Flow. No se requiere tarjeta de crédito.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Qué pasa si supero el límite de facturas?</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Te contactaremos para ayudarte a migrar al plan Flow o Enterprise según tu volumen. Sin cargos sorpresa.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Qué incluye la implementación?</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Incluye configuración inicial, conexión a tu correo, validación SUNAT y capacitación del equipo. En Flow también configuramos la integración con tu ERP.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Necesito tener un ERP para usar Flow?</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    No. El plan Essential funciona sin ERP. Flow está diseñado para empresas que ya tienen un ERP y quieren automatizar la integración.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Ofrecen descuentos por pago anual?</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Sí, ofrecemos 20% de descuento en los planes Essential y Flow al pagar anualmente por adelantado.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Qué nivel de soporte incluye cada plan?</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Essential: Email (48h), Flow: Email prioritario (24h), Enterprise: Soporte dedicado 24/7 + WhatsApp directo.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="text-center bg-gradient-to-br from-blue-50 to-primary-50 dark:from-blue-900/20 dark:to-primary-900/20 border-2 border-blue-300 dark:border-blue-500/30 rounded-2xl p-12">
              <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-6 py-2 text-sm font-semibold text-green-400 mb-6">
                14 días gratis • Sin tarjeta de crédito
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿No estás seguro?{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-primary-500">
                  Pruébalo gratis.
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Más de 50 PYMEs ya confían en Flow. 
                <span className="text-gray-900 dark:text-white font-semibold"> ROI promedio: 450%.</span>
                {' '}Agenda tu demo o empieza tu prueba gratuita de 14 días hoy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/consulta" className="bg-primary-600 hover:bg-primary-700 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold text-base transition-colors shadow-xl inline-block">
                  Agendar demo gratuita →
                </Link>
                <Link href="/login" className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-secondary-800 transition-all inline-block">
                  Empezar prueba gratis
                </Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                Sin tarjeta de crédito • Implementación en 1 semana • Soporte en español
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
