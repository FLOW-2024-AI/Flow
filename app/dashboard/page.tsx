'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FacturasTable from '@/components/FacturasTable'

// Mock data para el dashboard
const mockStats = {
  totalUsuarios: 247,
  usuariosMes: 45,
  crecimiento: 12.5,
  sesionesActivas: 18,
  ingresosMes: 2850000,
  clientesActivos: 89
}

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'facturas'>('overview')
  const [stats] = useState(mockStats)
  const [user] = useState({ name: 'Admin', email: 'admin@finka.finance' })

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-neutral-900 border-r border-neutral-800 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">Finka Finance</span>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'overview' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
                </svg>
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('facturas')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'facturas' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Facturas Registradas</span>
              </button>
            </nav>

            {/* User Info */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-3 p-3 bg-neutral-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {activeTab === 'overview' ? 'Dashboard Overview' : 
                   activeTab === 'analytics' ? 'Analytics' : 'Facturas Registradas'}
                </h1>
                <p className="text-neutral-400 mt-1">
                  {activeTab === 'overview' 
                    ? 'Resumen general de tu plataforma' 
                    : activeTab === 'analytics'
                    ? 'Análisis detallado de métricas'
                    : 'Gestión y visualización de facturas desde Supabase'
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-400">Última actualización</p>
                <p className="text-sm font-medium">{new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </motion.div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-400 text-sm">Total Usuarios</p>
                        <p className="text-3xl font-bold">{stats.totalUsuarios}</p>
                      </div>
                      <div className="bg-blue-900/20 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-400 text-sm">Este Mes</p>
                        <p className="text-3xl font-bold">{stats.usuariosMes}</p>
                      </div>
                      <div className="bg-green-900/20 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-400 text-sm">Crecimiento</p>
                        <p className="text-3xl font-bold">{stats.crecimiento}%</p>
                      </div>
                      <div className="bg-yellow-900/20 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-400 text-sm">Sesiones Activas</p>
                        <p className="text-3xl font-bold">{stats.sesionesActivas}</p>
                      </div>
                      <div className="bg-purple-900/20 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Welcome Message */}
                <motion.div variants={itemVariants} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">¡Bienvenido al Dashboard de Finka Finance!</h2>
                  <p className="text-neutral-300 text-lg leading-relaxed">
                    Este es tu panel de control principal. Desde aquí puedes monitorear el rendimiento de tu plataforma,
                    analizar métricas clave y gestionar tu negocio fintech de manera eficiente.
                  </p>
                  <div className="mt-6 flex space-x-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      Ver Reportes
                    </button>
                    <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      Configuración
                    </button>
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === 'analytics' && (
              <motion.div variants={itemVariants} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Métricas de Rendimiento</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300">Ingresos del Mes</span>
                        <span className="font-bold text-green-400">
                          ${stats.ingresosMes.toLocaleString('es-CO')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300">Clientes Activos</span>
                        <span className="font-bold text-blue-400">{stats.clientesActivos}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300">Tasa de Crecimiento</span>
                        <span className="font-bold text-yellow-400">{stats.crecimiento}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Próximamente</h3>
                    <p className="text-neutral-400">
                      Gráficos interactivos, análisis de tendencias y reportes detallados 
                      estarán disponibles en futuras actualizaciones.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'facturas' && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                  <FacturasTable />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
