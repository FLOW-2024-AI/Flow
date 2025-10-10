'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const features = [
  {
    category: 'Automatización',
    items: [
      { name: 'Conciliación bancaria automática', flow: true, comp1: true, comp2: false },
      { name: 'OCR inteligente de facturas', flow: true, comp1: false, comp2: true },
      { name: 'Flujos de aprobación personalizables', flow: true, comp1: true, comp2: false },
      { name: 'Predicción de flujo de caja con IA', flow: true, comp1: false, comp2: false },
      { name: 'Automatización de cuentas por pagar', flow: true, comp1: true, comp2: true }
    ]
  },
  {
    category: 'Integraciones',
    items: [
      { name: 'Conexión con bancos vía API', flow: true, comp1: true, comp2: true },
      { name: 'Integración con ERPs (Odoo, SAP, etc)', flow: true, comp1: 'Limitado', comp2: true },
      { name: 'Webhooks y API REST', flow: true, comp1: false, comp2: 'Limitado' },
      { name: 'Integraciones ilimitadas', flow: true, comp1: false, comp2: false }
    ]
  },
  {
    category: 'Soporte & Implementación',
    items: [
      { name: 'Implementación en días', flow: '3-5 días', comp1: '2-3 semanas', comp2: '1-2 meses' },
      { name: 'Soporte 24/7', flow: true, comp1: 'Solo email', comp2: true },
      { name: 'Capacitación incluida', flow: true, comp1: false, comp2: 'Costo extra' },
      { name: 'Gerente de cuenta dedicado', flow: true, comp1: 'Solo Enterprise', comp2: false }
    ]
  },
  {
    category: 'Precios',
    items: [
      { name: 'Precio inicial', flow: '$299/mes', comp1: '$499/mes', comp2: '$799/mes' },
      { name: 'Sin costos de implementación', flow: true, comp1: false, comp2: false },
      { name: 'Prueba gratuita 30 días', flow: true, comp1: '14 días', comp2: false },
      { name: 'Sin contrato mínimo', flow: true, comp1: false, comp2: '12 meses' }
    ]
  }
]

export default function ComparacionPage() {
  const renderValue = (value: any) => {
    if (value === true) {
      return (
        <svg className="w-5 h-5 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    if (value === false) {
      return (
        <svg className="w-5 h-5 text-red-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
    return <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
  }

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
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
              Comparación
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              Flow vs. Competidores
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre por qué las empresas líderes eligen Flow para automatizar sus finanzas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-100 dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-secondary-800/80">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Característica</div>
              <div className="text-center">
                <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-2">
                  <span className="text-xs font-semibold text-blue-400">FLOW</span>
                </div>
              </div>
              <div className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Competidor A</div>
              <div className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Competidor B</div>
            </div>

            {/* Categories */}
            {features.map((category, catIndex) => (
              <div key={catIndex} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="bg-gray-100 dark:bg-secondary-800 px-6 py-3">
                  <h3 className="text-sm font-semibold text-white">{category.category}</h3>
                </div>
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: itemIndex * 0.05 }}
                    className="grid grid-cols-4 gap-4 p-6 hover:bg-gray-50 dark:bg-secondary-800/30 transition-colors"
                  >
                    <div className="text-xs text-gray-400 dark:text-gray-300">{item.name}</div>
                    <div className="text-center font-semibold">{renderValue(item.flow)}</div>
                    <div className="text-center">{renderValue(item.comp1)}</div>
                    <div className="text-center">{renderValue(item.comp2)}</div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-xl font-semibold mb-4">¿Por qué elegir Flow?</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-2">3-5 días</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Implementación rápida</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-2">$299/mes</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Precio competitivo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Soporte dedicado</div>
              </div>
            </div>
            <Link href="/consulta" className="inline-block bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
              Comenzar con Flow
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
