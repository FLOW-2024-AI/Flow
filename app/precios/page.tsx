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
    name: "Essentials",
    price: "$399",
    period: "/mes",
    description: "Automatiza lo básico. Perfecto para PYMEs que empiezan.",
    tagline: "RPA Básico",
    features: [
      "✅ Dashboard Overview + Analytics",
      "✅ Facturas Registradas",
      "✅ Tesorería (Caja y Bancos)",
      "✅ Conciliación Bancaria",
      "✅ Reportes Financieros Básicos",
      "✅ Alertas y Notificaciones",
      "✅ Integraciones: 1 ERP + 2 Bancos",
      "❌ Copiloto IA",
      "❌ Predicciones ML",
      "❌ Ecosistema Financiero",
      "📧 Soporte: Email (48h)"
    ],
    popular: false,
    color: "blue",
    savings: "Ahorra 15h/mes"
  },
  {
    name: "Professional",
    price: "$799",
    period: "/mes",
    description: "RPA + IA + CFO Digital. Lo que necesita tu empresa.",
    tagline: "Más Popular",
    features: [
      "✅ Todo de Essentials +",
      "✅ Facturación Electrónica (SUNAT)",
      "✅ Cobranza Automatizada",
      "✅ Cuentas por Pagar",
      "✅ Presupuesto y Control",
      "✅ Flujo de Caja Proyectado",
      "✅ Copiloto IA Conversacional",
      "✅ Predicciones con ML",
      "✅ Automatizaciones RPA",
      "✅ Salud Financiera (Score)",
      "✅ Integraciones: 3 ERPs + Bancos ilimitados",
      "✅ SUNAT: SOL, PLAME, PLE, SIRE",
      "💬 Soporte: Chat prioritario (4h)"
    ],
    popular: true,
    color: "green",
    savings: "Ahorra 40h/mes"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Todo Flow + Ecosistema Financiero + CFO Digital completo.",
    tagline: "Solución Completa",
    features: [
      "✅ Todo de Professional +",
      "✅ Planificación Estratégica",
      "✅ Gestión de Riesgos",
      "✅ Ecosistema Financiero (Confirming, Factoring, Flash)",
      "✅ Productos Bancarios (Líneas, Leasing)",
      "✅ Integraciones: Ilimitadas + API Custom",
      "✅ Dashboard Personalizado",
      "✅ Automatizaciones Custom",
      "✅ White-label disponible",
      "✅ Implementación dedicada",
      "✅ SLA garantizado 99.9%",
      "✅ Account Manager dedicado",
      "🚀 Soporte: 24/7 + WhatsApp directo"
    ],
    popular: false,
    color: "purple",
    savings: "ROI 450%+"
  }
]

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
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
              <div className="inline-block bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-2 text-sm font-semibold text-purple-400 mb-6">
                💰 Desde $399/mes • ROI promedio 450%
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Precios transparentes.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Sin sorpresas.
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed">
                Elige el plan perfecto según las funcionalidades que necesitas.
                <span className="text-gray-900 dark:text-white font-semibold"> Todos incluyen implementación y capacitación.</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ✓ Sin contratos largos • ✓ Cancela cuando quieras • ✓ 30 días de prueba gratis
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={plan.name}
                  className={`relative bg-gray-50 dark:bg-secondary-800 border rounded-2xl p-8 transition-colors duration-200 ${
                    plan.popular 
                      ? 'border-green-500 ring-2 ring-green-500/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl">
                        ⭐ {plan.tagline}
                      </span>
                    </div>
                  )}
                  {!plan.popular && plan.tagline && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-semibold border border-gray-300 dark:border-gray-600">
                        {plan.tagline}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold mb-3">{plan.name}</h3>
                    <div className="mb-3">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-lg">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{plan.description}</p>
                    <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-semibold text-blue-400">
                      {plan.savings}
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
                    {plan.name === 'Enterprise' ? (
                      <Link 
                        href="/consulta"
                        className={`w-full block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                          plan.popular
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-white text-black hover:opacity-90'
                        }`}
                      >
                        Contactar Ventas
                      </Link>
                    ) : (
                      <Link 
                        href="/consulta"
                        className={`w-full block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                          plan.popular
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-white text-black hover:opacity-90'
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
            <motion.div variants={itemVariants} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Preguntas Frecuentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Hay período de prueba gratuito?</h3>
                  <p className="text-neutral-500 text-xs">
                    Sí, ofrecemos 30 días de prueba gratuita para todos los planes. No se requiere tarjeta de crédito.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
                  <p className="text-neutral-500 text-xs">
                    Absolutamente. Puedes actualizar o reducir tu plan en cualquier momento. Los cambios se aplican en el siguiente ciclo de facturación.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Qué incluye la implementación?</h3>
                  <p className="text-neutral-500 text-xs">
                    Incluye configuración inicial, integración con tus sistemas existentes, migración de datos y capacitación del equipo.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Hay costos adicionales por integraciones?</h3>
                  <p className="text-neutral-500 text-xs">
                    Las integraciones estándar están incluidas. Integraciones personalizadas pueden tener costo adicional según complejidad.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Ofrecen descuentos por pago anual?</h3>
                  <p className="text-neutral-500 text-xs">
                    Sí, ofrecemos 15% de descuento en todos los planes al pagar anualmente por adelantado.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">¿Qué nivel de soporte incluye cada plan?</h3>
                  <p className="text-neutral-500 text-xs">
                    Starter: Email (48h), Professional: Email prioritario (24h), Enterprise: Soporte dedicado 24/7.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="text-center bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-12">
              <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-6 py-2 text-sm font-semibold text-green-400 mb-6">
                ✓ 30 días gratis • Sin tarjeta de crédito
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿No estás seguro?{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Pruébalo gratis.
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Más de 20 empresas ya confían en Flow. 
                <span className="text-gray-900 dark:text-white font-semibold"> ROI promedio: 450%.</span>
                {' '}Agenda tu demo o empieza tu prueba gratuita hoy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/consulta" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-bold text-base transition-colors shadow-xl inline-block">
                  Agendar demo gratuita →
                </Link>
                <Link href="/login" className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-secondary-800 transition-all inline-block">
                  Empezar prueba gratis
                </Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                Sin tarjeta de crédito • Implementación en 2 semanas • Soporte en español
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
