'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Download, Calendar, Filter } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)

  const handleRefresh = () => {
    setLoading(true)
    setIframeKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900 shadow-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/apps"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </Link>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                  📊 Dashboard y Analíticas
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Visualiza tendencias y patrones en tiempo real
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all text-white"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all text-white">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Cargando dashboard...
                </p>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                  Esto puede tomar unos segundos
                </p>
              </div>
            </div>
          )}

          {/* QuickSight Embed */}
          <div className="relative" style={{ minHeight: '800px' }}>
            <iframe
              key={iframeKey}
              src="https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/886436955626/dashboards/0bcf94e1-d432-4d4d-a08a-fc5db87de97f?directory_alias=nathanvr98"
              className="w-full transition-opacity duration-300"
              style={{
                height: 'calc(100vh - 200px)',
                minHeight: '800px',
                border: 'none',
                opacity: loading ? 0 : 1
              }}
              onLoad={() => setLoading(false)}
              allowFullScreen
              title="QuickSight Dashboard"
            />
          </div>
        </motion.div>

        {/* Info Cards debajo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Última actualización</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {new Date().toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-xl border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Filtros activos</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Solo facturas aprobadas
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Actualización automática</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Cada 1 hora
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Dashboard powered by{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              AWS QuickSight
            </span>
            {' '}• Datos sincronizados con Aurora PostgreSQL
          </p>
        </div>
      </div>
    </div>
  )
}
