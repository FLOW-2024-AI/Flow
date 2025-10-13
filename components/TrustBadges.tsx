'use client'

import { motion } from 'framer-motion'
import { Lock, CheckCircle, Globe, CreditCard, Shield, Zap } from 'lucide-react'

const badges = [
  {
    name: 'SOC 2 Type II',
    IconComponent: Lock,
    description: 'Certificación de seguridad'
  },
  {
    name: 'ISO 27001',
    IconComponent: CheckCircle,
    description: 'Gestión de seguridad'
  },
  {
    name: 'GDPR',
    IconComponent: Globe,
    description: 'Protección de datos'
  },
  {
    name: 'PCI DSS',
    IconComponent: CreditCard,
    description: 'Seguridad de pagos'
  },
  {
    name: '256-bit SSL',
    IconComponent: Shield,
    description: 'Encriptación bancaria'
  },
  {
    name: '99.9% Uptime',
    IconComponent: Zap,
    description: 'Disponibilidad garantizada'
  }
]

export default function TrustBadges() {
  return (
    <section id="trust-badges" className="py-12 px-4 sm:px-6 lg:px-8 border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#1A1A1A]">
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
              className="bg-white dark:bg-[#252525] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-center hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center mb-3">
                  <badge.IconComponent className="w-8 h-8 text-gray-900 dark:text-white" strokeWidth={1.5} />
                </div>
                <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{badge.name}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-500">{badge.description}</div>
              </div>
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
