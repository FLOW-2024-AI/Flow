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
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-neutral-800 bg-neutral-950/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-xs font-medium text-neutral-500 tracking-wider uppercase">
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
              className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center hover:border-neutral-700 transition-all"
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <div className="text-xs font-semibold text-white mb-1">{badge.name}</div>
              <div className="text-[10px] text-neutral-500">{badge.description}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-neutral-500 mt-6"
        >
          Tus datos están protegidos con los más altos estándares de seguridad de la industria
        </motion.p>
      </div>
    </section>
  )
}
