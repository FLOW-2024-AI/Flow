'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LiveStats() {
  const [stats, setStats] = useState({
    transactions: 1247893,
    companies: 156,
    savings: 2.4
  })

  useEffect(() => {
    // Simular actualización en tiempo real
    const interval = setInterval(() => {
      setStats(prev => ({
        transactions: prev.transactions + Math.floor(Math.random() * 10),
        companies: prev.companies + (Math.random() > 0.95 ? 1 : 0),
        savings: prev.savings + (Math.random() * 0.01)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(Math.floor(num))
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium text-neutral-500 tracking-wider uppercase mb-4">
            En tiempo real
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Flow en acción{' '}
            <span className="inline-flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block w-2 h-2 bg-green-400 rounded-full"
              />
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Transactions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="text-xs text-neutral-500 mb-2">Transacciones procesadas</div>
              <motion.div
                key={stats.transactions}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold text-blue-400 mb-2"
              >
                {formatNumber(stats.transactions)}
              </motion.div>
              <div className="text-xs text-neutral-600">Este mes</div>
            </div>
          </motion.div>

          {/* Companies */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="text-xs text-neutral-500 mb-2">Empresas activas</div>
              <motion.div
                key={stats.companies}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold text-purple-400 mb-2"
              >
                {stats.companies}+
              </motion.div>
              <div className="text-xs text-neutral-600">Usando Flow ahora</div>
            </div>
          </motion.div>

          {/* Savings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="text-xs text-neutral-500 mb-2">Ahorros generados</div>
              <motion.div
                key={stats.savings}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold text-green-400 mb-2"
              >
                ${stats.savings.toFixed(1)}M
              </motion.div>
              <div className="text-xs text-neutral-600">Para nuestros clientes</div>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-neutral-500 mt-8"
        >
          Datos actualizados en tiempo real • Última actualización: hace {Math.floor(Math.random() * 10)} segundos
        </motion.p>
      </div>
    </section>
  )
}
