'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

export default function EstadoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Estado del Sistema</h1>
            <p className="text-xl text-gray-400 dark:text-gray-300">
              Monitoreo en tiempo real de todos nuestros servicios
            </p>
          </motion.div>

          {/* Status Overview */}
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold">Todos los sistemas operativos</h2>
            </div>
            <p className="text-center text-gray-400 dark:text-gray-300">
              Última actualización: {new Date().toLocaleString('es-ES')}
            </p>
          </div>

          {/* Services Status */}
          <div className="space-y-4">
            {[
              { name: 'API Principal', status: 'operational', uptime: '99.99%' },
              { name: 'Dashboard Web', status: 'operational', uptime: '99.98%' },
              { name: 'Integraciones Bancarias', status: 'operational', uptime: '99.95%' },
              { name: 'SUNAT Sync', status: 'operational', uptime: '99.97%' },
              { name: 'Base de Datos', status: 'operational', uptime: '99.99%' },
              { name: 'Copiloto IA', status: 'operational', uptime: '99.96%' }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Operacional</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                    <p className="font-semibold text-green-400">{service.uptime}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Historical Uptime */}
          <div className="mt-12 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Uptime Histórico (90 días)</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-400">99.98%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Promedio general</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Incidentes mayores</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary-400">2</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Mantenimientos</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Experimentas problemas? <a href="/contacto" className="text-blue-400 hover:text-blue-300">Contáctanos</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
