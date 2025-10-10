'use client'

import { motion } from 'framer-motion'

const badges = [
  {
    name: 'SOC 2 Type II',
    icon: '🔒',
    description: 'Certificación de seguridad'
  },
  {
    name: 'ISO 27001',
    icon: '✓',
    description: 'Gestión de seguridad'
  },
  {
    name: 'GDPR',
    icon: '🇪🇺',
    description: 'Protección de datos'
  },
  {
    name: 'PCI DSS',
    icon: '💳',
    description: 'Seguridad de pagos'
  },
  {
    name: '256-bit SSL',
    icon: '🛡️',
    description: 'Encriptación bancaria'
  },
  {
    name: '99.9% Uptime',
    icon: '⚡',
    description: 'Disponibilidad garantizada'
  }
]

export default function TrustBadges() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-secondary-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500 tracking-wider uppercase">
            Seguridad y Confiabilidad
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{badge.name}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-500">{badge.description}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6"
        >
          Tus datos están protegidos con los más altos estándares de seguridad de la industria
        </motion.p>
      </div>
    </section>
  )
}
