'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

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
    name: "Starter",
    price: "$299",
    period: "/mes",
    description: "Perfecto para pequeñas empresas que inician su automatización financiera",
    features: [
      "Hasta 500 transacciones/mes",
      "Conciliación bancaria automática",
      "2 cuentas bancarias",
      "Reportes básicos",
      "Soporte por email",
      "Integración con 1 ERP",
      "Dashboard básico"
    ],
    popular: false,
    color: "blue"
  },
  {
    name: "Professional",
    price: "$599",
    period: "/mes",
    description: "Ideal para empresas en crecimiento que necesitan automatización completa",
    features: [
      "Hasta 2,000 transacciones/mes",
      "Conciliación bancaria automática",
      "5 cuentas bancarias",
      "Cuentas por pagar automatizadas",
      "Reportes avanzados + BI",
      "Soporte prioritario",
      "Integración con 3 ERPs",
      "Dashboard avanzado",
      "API personalizada",
      "Flujos de aprobación"
    ],
    popular: true,
    color: "green"
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Solución completa para grandes empresas con necesidades específicas",
    features: [
      "Transacciones ilimitadas",
      "Todas las funcionalidades",
      "Cuentas bancarias ilimitadas",
      "Automatización completa A/P y A/R",
      "Reportes personalizados",
      "Soporte dedicado 24/7",
      "Integraciones ilimitadas",
      "Dashboard personalizado",
      "Implementación dedicada",
      "SLA garantizado",
      "Capacitación on-site"
    ],
    popular: false,
    color: "purple"
  }
]

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo/finka-logo.jpg" 
                alt="Finka Finance" 
                width={250} 
                height={60}
                className="h-15 w-auto object-contain"
                style={{ height: '60px' }}
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
              <h1 className="text-5xl font-bold mb-6">Planes y Precios</h1>
              <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                Elige el plan perfecto para automatizar las finanzas de tu empresa. Todos los planes incluyen implementación y capacitación inicial.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={plan.name}
                  className={`relative bg-neutral-900/50 border rounded-2xl p-8 ${
                    plan.popular 
                      ? 'border-green-500 ring-2 ring-green-500/20' 
                      : 'border-neutral-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Más Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-neutral-400">{plan.period}</span>
                    </div>
                    <p className="text-neutral-400">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-neutral-300">{feature}</span>
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
              <h2 className="text-3xl font-bold mb-8 text-center">Preguntas Frecuentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">¿Hay período de prueba gratuito?</h3>
                  <p className="text-neutral-400">
                    Sí, ofrecemos 30 días de prueba gratuita para todos los planes. No se requiere tarjeta de crédito.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">¿Puedo cambiar de plan en cualquier momento?</h3>
                  <p className="text-neutral-400">
                    Absolutamente. Puedes actualizar o reducir tu plan en cualquier momento. Los cambios se aplican en el siguiente ciclo de facturación.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">¿Qué incluye la implementación?</h3>
                  <p className="text-neutral-400">
                    Incluye configuración inicial, integración con tus sistemas existentes, migración de datos y capacitación del equipo.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">¿Hay costos adicionales por integraciones?</h3>
                  <p className="text-neutral-400">
                    Las integraciones estándar están incluidas. Integraciones personalizadas pueden tener costo adicional según complejidad.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">¿Ofrecen descuentos por pago anual?</h3>
                  <p className="text-neutral-400">
                    Sí, ofrecemos 15% de descuento en todos los planes al pagar anualmente por adelantado.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">¿Qué nivel de soporte incluye cada plan?</h3>
                  <p className="text-neutral-400">
                    Starter: Email (48h), Professional: Email prioritario (24h), Enterprise: Soporte dedicado 24/7.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Features Comparison */}
            <motion.div variants={itemVariants} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Comparación de Funcionalidades</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-700">
                      <th className="text-left py-4 px-4">Funcionalidad</th>
                      <th className="text-center py-4 px-4">Starter</th>
                      <th className="text-center py-4 px-4">Professional</th>
                      <th className="text-center py-4 px-4">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-neutral-800">
                      <td className="py-4 px-4">Conciliación Bancaria</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-neutral-800">
                      <td className="py-4 px-4">Cuentas por Pagar</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-neutral-800">
                      <td className="py-4 px-4">API Personalizada</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-neutral-800">
                      <td className="py-4 px-4">Soporte 24/7</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-neutral-800">
                      <td className="py-4 px-4">Implementación Dedicada</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">¿No estás seguro qué plan elegir?</h2>
              <p className="text-xl text-neutral-400 mb-8">
                Agenda una consulta gratuita y te ayudamos a encontrar la solución perfecta para tu empresa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/consulta" className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity focus-ring inline-block">
                  Agendar consulta gratis
                </Link>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors focus-ring inline-block">
                  Probar demo gratis
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
