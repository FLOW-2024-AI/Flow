'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FacturasTable from '@/components/FacturasTable'
import ThemeToggle from '@/components/ThemeToggle'
import { FileText, DollarSign, CreditCard, BarChart3, TrendingUp, Bot, Zap, Heart, Globe, Plug, Building2, Landmark, Wallet, AlertCircle, AlertTriangle, Tag, Lightbulb, BookOpen, Sparkles, CircleDot, ArrowLeft } from 'lucide-react'

// Mock data para empresa cliente de Flow
const mockStats = {
  saldoCaja: 1250000,
  cuentasPorCobrar: 850000,
  cuentasPorPagar: 420000,
  flujoNeto: 830000,
  facturasPendientes: 23,
  facturasVencidas: 5,
  transaccionesHoy: 47,
  conciliacionPendiente: 12
}

// Flujo de caja últimos 6 meses
const cashFlowData = [
  { month: 'Ene', ingresos: 980000, egresos: 720000, neto: 260000 },
  { month: 'Feb', ingresos: 1150000, egresos: 850000, neto: 300000 },
  { month: 'Mar', ingresos: 1320000, egresos: 920000, neto: 400000 },
  { month: 'Abr', ingresos: 1480000, egresos: 980000, neto: 500000 },
  { month: 'May', ingresos: 1650000, egresos: 1050000, neto: 600000 },
  { month: 'Jun', ingresos: 1850000, egresos: 1120000, neto: 730000 }
]

// Cuentas por cobrar por antigüedad
const cuentasPorCobrarData = [
  { range: '0-30 días', amount: 450000, percentage: 53, color: 'bg-green-500' },
  { range: '31-60 días', amount: 250000, percentage: 29, color: 'bg-yellow-500' },
  { range: '61-90 días', amount: 100000, percentage: 12, color: 'bg-orange-500' },
  { range: '+90 días', amount: 50000, percentage: 6, color: 'bg-red-500' }
]

// Principales proveedores
const topProveedores = [
  { name: 'Proveedor ABC SAC', monto: 125000, facturas: 8, status: 'Al día' },
  { name: 'Distribuidora XYZ', monto: 98000, facturas: 12, status: 'Al día' },
  { name: 'Servicios Generales', monto: 75000, facturas: 5, status: 'Vencido' },
  { name: 'Logística Express', monto: 62000, facturas: 6, status: 'Al día' },
  { name: 'Tecnología Corp', monto: 60000, facturas: 4, status: 'Al día' }
]

// Transacciones recientes
const recentTransactions = [
  { type: 'ingreso', concepto: 'Pago Cliente - Factura #1234', amount: 85000, time: 'Hace 15 min', cuenta: 'BCP - Corriente' },
  { type: 'egreso', concepto: 'Pago Proveedor - ABC SAC', amount: 32000, time: 'Hace 1 hora', cuenta: 'BBVA - Corriente' },
  { type: 'ingreso', concepto: 'Transferencia Cliente XYZ', amount: 125000, time: 'Hace 2 horas', cuenta: 'BCP - Corriente' },
  { type: 'egreso', concepto: 'Planilla Empleados', amount: 180000, time: 'Hace 3 horas', cuenta: 'Interbank - Nómina' },
  { type: 'ingreso', concepto: 'Cobro Factura #1189', amount: 45000, time: 'Hace 4 horas', cuenta: 'BCP - Corriente' }
]

// Distribución de gastos
const gastosCategoria = [
  { categoria: 'Planilla', monto: 450000, porcentaje: 40 },
  { categoria: 'Proveedores', monto: 340000, porcentaje: 30 },
  { categoria: 'Servicios', monto: 170000, porcentaje: 15 },
  { categoria: 'Marketing', monto: 113000, porcentaje: 10 },
  { categoria: 'Otros', monto: 57000, porcentaje: 5 }
]

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
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'facturas' | 'tesoreria' | 'reportes' | 'conciliacion' | 'alertas' | 'copiloto' | 'predicciones' | 'automatizaciones' | 'salud' | 'planificacion' | 'riesgos' | 'ecosistema' | 'bancario' | 'presupuesto' | 'cobranza' | 'cuentasPorPagar' | 'flujoProyectado' | 'facturacion' | 'integraciones'>('overview')
  const [stats] = useState(mockStats)
  const [user] = useState({ name: 'Admin', email: 'admin@flow.finance' })
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu copiloto financiero. ¿En qué puedo ayudarte hoy?' }
  ])
  const [healthScore] = useState(82)
  const [reportesTab, setReportesTab] = useState<'financieros' | 'impuestos'>('financieros')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('demo_session')
      const urlParams = new URLSearchParams(window.location.search)
      const demoMode = urlParams.get('demo')
      const skipAuth = urlParams.get('skip_auth')
      
      // Allow access if: has session, demo mode, or skip_auth
      if (session === 'true' || demoMode === 'true' || skipAuth === 'true') {
        // Auto-login for demo mode
        if (demoMode === 'true' || skipAuth === 'true') {
          localStorage.setItem('demo_session', 'true')
          localStorage.setItem('demo_user', JSON.stringify({ name: 'Demo User', email: 'demo@flow.finance' }))
        }
        setIsAuthenticated(true)
      } else {
        // For production, redirect to login after a delay
        // This allows the dashboard to be accessed directly in development
        const timer = setTimeout(() => {
          // Only redirect if still not authenticated
          if (!localStorage.getItem('demo_session')) {
            window.location.href = '/login'
          }
        }, 500)
        
        // Auto-authenticate for demo purposes (can be removed in production)
        localStorage.setItem('demo_session', 'true')
        localStorage.setItem('demo_user', JSON.stringify({ name: 'Demo User', email: 'demo@flow.finance' }))
        setIsAuthenticated(true)
        
        return () => clearTimeout(timer)
      }
    }
  }, [])

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-white dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/apps" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Volver a Apps</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-neutral-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-colors duration-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <img 
                src="/images/icons/client-icon-dark.svg"
                alt="Cliente"
                className="w-10 h-10 dark:hidden"
              />
              <img 
                src="/images/icons/client-icon-light.svg"
                alt="Cliente"
                className="w-10 h-10 hidden dark:block"
              />
              <span className="text-2xl font-bold">Cliente Demo</span>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {/* PRINCIPAL */}
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'overview' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm">Analytics</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 px-3">OPERACIONES</p>

              <button
                onClick={() => setActiveTab('facturacion')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'facturacion' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Facturación</span>
              </button>

              <button
                onClick={() => setActiveTab('cobranza')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'cobranza' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm">Cobranza</span>
              </button>

              <button
                onClick={() => setActiveTab('cuentasPorPagar')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'cuentasPorPagar' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-sm">Cuentas por Pagar</span>
              </button>

              <button
                onClick={() => setActiveTab('facturas')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'facturas' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Facturas Registradas</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 px-3">TESORERÍA</p>

              <button
                onClick={() => setActiveTab('tesoreria')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'tesoreria' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-sm">Caja y Bancos</span>
              </button>

              <button
                onClick={() => setActiveTab('flujoProyectado')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'flujoProyectado' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm">Flujo Proyectado</span>
              </button>

              <button
                onClick={() => setActiveTab('conciliacion')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'conciliacion' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-sm">Conciliación</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 px-3">PLANIFICACIÓN</p>

              <button
                onClick={() => setActiveTab('presupuesto')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'presupuesto' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Presupuesto</span>
              </button>

              <button
                onClick={() => setActiveTab('reportes')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'reportes' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Reportes</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 px-3">COPILOTO IA</p>

              <button
                onClick={() => setActiveTab('copiloto')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'copiloto' 
                    ? 'bg-gradient-to-r from-blue-600 to-primary-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-sm font-medium">Chat IA</span>
              </button>

              <button
                onClick={() => setActiveTab('predicciones')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'predicciones' 
                    ? 'bg-gradient-to-r from-blue-600 to-primary-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sm font-medium">Predicciones</span>
              </button>

              <button
                onClick={() => setActiveTab('automatizaciones')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'automatizaciones' 
                    ? 'bg-gradient-to-r from-blue-600 to-primary-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">Automatizaciones</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 px-3">CFO DIGITAL</p>

              <button
                onClick={() => setActiveTab('salud')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'salud' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Salud Financiera</span>
              </button>

              <button
                onClick={() => setActiveTab('planificacion')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'planificacion' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">Planificación</span>
              </button>

              <button
                onClick={() => setActiveTab('riesgos')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'riesgos' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium">Gestión de Riesgos</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 px-3">FINANCIAMIENTO</p>

              <button
                onClick={() => setActiveTab('ecosistema')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'ecosistema' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium">Ecosistema</span>
              </button>

              <button
                onClick={() => setActiveTab('bancario')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'bancario' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span className="text-sm font-medium">Bancario</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

              <button
                onClick={() => setActiveTab('alertas')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'alertas' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm">Alertas</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 px-3">INTEGRACIONES</p>

              <button
                onClick={() => setActiveTab('integraciones')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === 'integraciones' 
                    ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white' 
                    : 'text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-neutral-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                <span className="text-sm font-medium">Integraciones</span>
              </button>
            </nav>
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
                <h1 className="text-2xl font-semibold">
                  {activeTab === 'overview' ? 'Dashboard Overview' : 
                   activeTab === 'analytics' ? 'Analytics' : 
                   activeTab === 'facturas' ? 'Facturas Registradas' :
                   activeTab === 'tesoreria' ? 'Tesorería' :
                   activeTab === 'reportes' ? 'Reportes Financieros' :
                   activeTab === 'conciliacion' ? 'Conciliación Bancaria' :
                   activeTab === 'alertas' ? 'Alertas y Notificaciones' :
                   activeTab === 'facturacion' ? 'Facturación Electrónica' :
                   activeTab === 'cobranza' ? 'Cobranza' :
                   activeTab === 'cuentasPorPagar' ? 'Cuentas por Pagar' :
                   activeTab === 'presupuesto' ? 'Presupuesto' :
                   activeTab === 'flujoProyectado' ? 'Flujo Proyectado' :
                   activeTab === 'copiloto' ? 'Copiloto Financiero IA' :
                   activeTab === 'predicciones' ? 'Predicciones Inteligentes' :
                   activeTab === 'automatizaciones' ? 'Automatizaciones' :
                   activeTab === 'salud' ? 'Salud Financiera' :
                   activeTab === 'planificacion' ? 'Planificación Estratégica' :
                   activeTab === 'riesgos' ? 'Gestión de Riesgos' :
                   activeTab === 'ecosistema' ? 'Ecosistema Financiero' :
                   activeTab === 'integraciones' ? 'Integraciones' :
                   'Productos Bancarios'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                  {activeTab === 'overview' ? 'Resumen general de tu plataforma' : 
                   activeTab === 'analytics' ? 'Análisis detallado de métricas' :
                   activeTab === 'facturas' ? 'Gestión y visualización de facturas' :
                   activeTab === 'tesoreria' ? 'Control de caja y bancos' :
                   activeTab === 'reportes' ? 'Informes y estados financieros' :
                   activeTab === 'conciliacion' ? 'Conciliación automática de cuentas' :
                   activeTab === 'alertas' ? 'Notificaciones importantes y pendientes' :
                   activeTab === 'facturacion' ? 'Emisión de facturas, boletas y notas de crédito electrónicas' :
                   activeTab === 'cobranza' ? 'Gestión de cuentas por cobrar y seguimiento de pagos' :
                   activeTab === 'cuentasPorPagar' ? 'Calendario de pagos y gestión de proveedores' :
                   activeTab === 'presupuesto' ? 'Control presupuestario y análisis de variaciones' :
                   activeTab === 'flujoProyectado' ? 'Proyección de flujo de caja y escenarios' :
                   activeTab === 'copiloto' ? 'Asistente inteligente para tus finanzas' :
                   activeTab === 'predicciones' ? 'Forecasting con inteligencia artificial' :
                   activeTab === 'automatizaciones' ? 'Reglas y workflows automáticos' :
                   activeTab === 'salud' ? 'Análisis integral de tu situación financiera' :
                   activeTab === 'planificacion' ? 'Escenarios y simulaciones para decisiones estratégicas' :
                   activeTab === 'riesgos' ? 'Identificación y mitigación de riesgos financieros' :
                   activeTab === 'ecosistema' ? 'Confirming, Factoring y Líneas de Crédito Flash' :
                   activeTab === 'integraciones' ? 'Conecta tu ERP, Bancos, SUNAT y más con RPA + IA' :
                   'Líneas de Crédito, Leasing y Financiamiento a Mediano Plazo'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400">Última actualización</p>
                <p className="text-sm font-medium">{new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </motion.div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <>
                {/* CFO Scorecard - Health Score */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-500/90 to-emerald-600/90 dark:from-green-900/20 dark:to-emerald-900/10 border-0 dark:border dark:border-green-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 dark:text-gray-400 text-xs mb-2">Score de Salud Financiera</p>
                      <div className="flex items-baseline gap-3">
                        <p className="text-4xl font-bold text-white dark:text-green-400">{healthScore}</p>
                        <span className="text-sm text-green-100 dark:text-gray-400">/100</span>
                      </div>
                      <p className="text-xs text-green-100 dark:text-green-400 mt-2">Excelente • +5 pts vs mes anterior</p>
                    </div>
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-neutral-800" />
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="40" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="6" 
                          strokeDasharray={`${(healthScore / 100) * 251} 251`}
                          className="text-green-400"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-green-400 fill-green-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* KPIs Financieros Clave */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:from-blue-900/20 dark:to-blue-900/5 border-0 dark:border dark:border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-100 dark:text-gray-400 text-xs mb-1">Liquidez</p>
                    <p className="text-2xl font-bold text-white dark:text-gray-100">${(stats.saldoCaja / 1000000).toFixed(2)}M</p>
                    <p className="text-xs text-blue-100 dark:text-green-400 mt-1">+15% MoM</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/90 to-green-600/90 dark:from-green-900/20 dark:to-green-900/5 border-0 dark:border dark:border-green-500/20 rounded-xl p-4">
                    <p className="text-green-100 dark:text-gray-400 text-xs mb-1">Por Cobrar</p>
                    <p className="text-2xl font-bold text-white dark:text-gray-100">${(stats.cuentasPorCobrar / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-green-100 dark:text-gray-400 mt-1">23 facturas</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/90 to-red-600/90 dark:from-red-900/20 dark:to-red-900/5 border-0 dark:border dark:border-red-500/20 rounded-xl p-4">
                    <p className="text-red-100 dark:text-gray-400 text-xs mb-1">Por Pagar</p>
                    <p className="text-2xl font-bold text-white dark:text-gray-100">${(stats.cuentasPorPagar / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-red-100 dark:text-red-400 mt-1">Vence 7 días</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/90 to-purple-600/90 dark:from-purple-900/20 dark:to-purple-900/5 border-0 dark:border dark:border-purple-500/20 rounded-xl p-4">
                    <p className="text-purple-100 dark:text-gray-400 text-xs mb-1">Flujo Neto</p>
                    <p className="text-2xl font-bold text-white dark:text-gray-100">${(stats.flujoNeto / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-purple-100 dark:text-green-400 mt-1">+22% MoM</p>
                  </div>
                </motion.div>

                {/* Ratios Financieros + Predicciones */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Ratios Clave */}
                  <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Ratios Financieros</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Liquidez Corriente', value: '2.8', target: '2.0', status: 'good' },
                        { name: 'Endeudamiento', value: '0.45', target: '0.50', status: 'good' },
                        { name: 'Margen Neto', value: '18%', target: '15%', status: 'good' },
                        { name: 'ROE', value: '22%', target: '20%', status: 'good' }
                      ].map((ratio, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-400 dark:text-gray-300">{ratio.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                ratio.status === 'good' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                              }`}>
                                ✓
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold">{ratio.value}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">vs {ratio.target}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Predicciones IA */}
                  <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Predicciones IA - Próximo Mes</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-500/90 to-blue-600/90 dark:from-blue-900/20 dark:to-blue-900/5 border-0 dark:border dark:border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-100 dark:text-gray-400 mb-1">Ingresos Proyectados</p>
                        <p className="text-2xl font-bold text-white dark:text-gray-100 mb-1">$2.1M</p>
                        <p className="text-xs text-blue-100 dark:text-green-400">+14% vs mes actual • Confianza: 87%</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-orange-500/90 to-orange-600/90 dark:from-purple-900/20 dark:to-purple-900/5 border-0 dark:border dark:border-purple-500/20 rounded-xl">
                        <p className="text-xs text-orange-100 dark:text-gray-400 mb-1">Gastos Estimados</p>
                        <p className="text-2xl font-bold text-white dark:text-gray-100 mb-1">$1.3M</p>
                        <p className="text-xs text-orange-100 dark:text-yellow-400">+8% vs mes actual • Confianza: 92%</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-500/90 to-green-600/90 dark:from-green-900/20 dark:to-green-900/5 border-0 dark:border dark:border-green-500/20 rounded-xl">
                        <p className="text-xs text-green-100 dark:text-gray-400 mb-1">Flujo Neto Proyectado</p>
                        <p className="text-2xl font-bold text-white dark:text-gray-100 mb-1">$800K</p>
                        <p className="text-xs text-green-100 dark:text-green-400">+22% vs mes actual • Confianza: 85%</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Operaciones + Tesorería */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Facturación */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:bg-neutral-800 border-0 dark:border dark:border-gray-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white dark:text-gray-100">Facturación</h3>
                      <span className="text-xs px-2 py-1 bg-white/20 text-white dark:bg-green-900/20 dark:text-green-400 rounded-full">Hoy</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-blue-100 dark:text-gray-400">Emitidas</p>
                        <p className="text-xl font-bold text-white dark:text-gray-100">12</p>
                        <p className="text-xs text-blue-100 dark:text-blue-400">$45K facturado</p>
                      </div>
                      <div className="pt-3 border-t border-white/20 dark:border-gray-700">
                        <p className="text-xs text-blue-100 dark:text-gray-400">Este Mes</p>
                        <p className="text-xl font-bold text-white dark:text-gray-100">156</p>
                        <p className="text-xs text-blue-100 dark:text-green-400">$850K total</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Cobranza */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-orange-500/90 to-orange-600/90 dark:bg-neutral-800 border-0 dark:border dark:border-gray-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white dark:text-gray-100">Cobranza</h3>
                      <span className="text-xs px-2 py-1 bg-white/20 text-white dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full">Atención</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-orange-100 dark:text-gray-400">Por Vencer (7 días)</p>
                        <p className="text-xl font-bold text-white dark:text-gray-100">$320K</p>
                        <p className="text-xs text-orange-100 dark:text-yellow-400">8 facturas</p>
                      </div>
                      <div className="pt-3 border-t border-white/20 dark:border-gray-700">
                        <p className="text-xs text-orange-100 dark:text-gray-400">Vencidas</p>
                        <p className="text-xl font-bold text-white dark:text-red-400">$180K</p>
                        <p className="text-xs text-orange-100 dark:text-red-400">5 facturas • Acción requerida</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tesorería */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-cyan-500/90 to-cyan-600/90 dark:bg-neutral-800 border-0 dark:border dark:border-gray-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white dark:text-gray-100">Tesorería</h3>
                      <span className="text-xs px-2 py-1 bg-white/20 text-white dark:bg-blue-900/20 dark:text-blue-400 rounded-full">3 Cuentas</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-cyan-100 dark:text-gray-400">Saldo Total</p>
                        <p className="text-xl font-bold text-white dark:text-gray-100">$1.25M</p>
                        <p className="text-xs text-cyan-100 dark:text-green-400">BCP: $850K • BBVA: $280K</p>
                      </div>
                      <div className="pt-3 border-t border-white/20 dark:border-gray-700">
                        <p className="text-xs text-cyan-100 dark:text-gray-400">Movimientos Hoy</p>
                        <p className="text-xl font-bold text-white dark:text-gray-100">{stats.transaccionesHoy}</p>
                        <p className="text-xs text-cyan-100 dark:text-gray-400">+$125K / -$85K</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Presupuesto + Alertas */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Presupuesto */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-500/90 to-indigo-600/90 dark:bg-neutral-800 border-0 dark:border dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white dark:text-gray-100 mb-4">Presupuesto 2025</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/20 dark:bg-blue-900/10 rounded-lg">
                        <p className="text-xs text-indigo-100 dark:text-gray-400 mb-1">Anual</p>
                        <p className="text-lg font-bold text-white dark:text-gray-100">$12M</p>
                      </div>
                      <div className="text-center p-3 bg-white/20 dark:bg-green-900/10 rounded-lg">
                        <p className="text-xs text-indigo-100 dark:text-gray-400 mb-1">Ejecutado</p>
                        <p className="text-lg font-bold text-white dark:text-gray-100">$9.2M</p>
                        <p className="text-xs text-indigo-100 dark:text-green-400">77%</p>
                      </div>
                      <div className="text-center p-3 bg-white/20 dark:bg-purple-900/10 rounded-lg">
                        <p className="text-xs text-indigo-100 dark:text-gray-400 mb-1">Disponible</p>
                        <p className="text-lg font-bold text-white dark:text-gray-100">$2.8M</p>
                        <p className="text-xs text-indigo-100 dark:text-purple-400">23%</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { cat: 'Nómina', exec: 100, color: 'bg-blue-600' },
                        { cat: 'Operaciones', exec: 105, color: 'bg-red-500' },
                        { cat: 'Marketing', exec: 97, color: 'bg-green-600' }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-indigo-100 dark:text-gray-400">{item.cat}</span>
                            <span className={item.exec > 100 ? 'text-white dark:text-red-400' : 'text-white dark:text-green-400'}>{item.exec}%</span>
                          </div>
                          <div className="w-full bg-white/20 dark:bg-neutral-700 rounded-full h-1.5">
                            <div className={`${item.color} h-full rounded-full`} style={{ width: `${Math.min(item.exec, 100)}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Alertas Críticas */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-rose-500/90 to-rose-600/90 dark:bg-neutral-800 border-0 dark:border dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white dark:text-gray-100 mb-4">Alertas Críticas</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'Facturas Vencidas', count: 5, amount: '$180K', level: 'high', IconComponent: AlertCircle, color: 'text-red-400' },
                        { type: 'Pagos Esta Semana', count: 7, amount: '$180K', level: 'medium', IconComponent: AlertTriangle, color: 'text-yellow-400' },
                        { type: 'Conciliación Pendiente', count: 3, amount: '-', level: 'medium', IconComponent: AlertTriangle, color: 'text-yellow-400' },
                        { type: 'Sobregasto Operaciones', count: 1, amount: '+5.4%', level: 'medium', IconComponent: AlertTriangle, color: 'text-yellow-400' }
                      ].map((alert, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border ${
                          alert.level === 'high' ? 'bg-white/20 dark:bg-red-900/10 border-white/30 dark:border-red-500/20' : 'bg-white/20 dark:bg-yellow-900/10 border-white/30 dark:border-yellow-500/20'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <alert.IconComponent className={`w-5 h-5 text-white dark:${alert.color}`} />
                              <div>
                                <p className="text-sm font-semibold text-white dark:text-gray-100">{alert.type}</p>
                                <p className="text-xs text-rose-100 dark:text-gray-400">{alert.count} items • {alert.amount}</p>
                              </div>
                            </div>
                            <button className="text-xs px-2 py-1 bg-white/30 dark:bg-neutral-700 text-white dark:text-gray-100 hover:bg-white/40 dark:hover:bg-neutral-600 rounded transition-colors">
                              Ver
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Flujo Proyectado + Financiamiento */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Flujo Proyectado */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-violet-500/90 to-violet-600/90 dark:bg-neutral-800 border-0 dark:border dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white dark:text-gray-100 mb-4">Flujo de Caja Proyectado (12 semanas)</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-white/20 dark:bg-blue-900/10 rounded-lg">
                        <p className="text-xs text-violet-100 dark:text-gray-400 mb-1">Saldo Inicial</p>
                        <p className="text-lg font-bold text-white dark:text-gray-100">$1.25M</p>
                      </div>
                      <div className="text-center p-3 bg-white/20 dark:bg-green-900/10 rounded-lg">
                        <p className="text-xs text-violet-100 dark:text-gray-400 mb-1">Ingresos</p>
                        <p className="text-lg font-bold text-white dark:text-green-400">+$2.8M</p>
                      </div>
                      <div className="text-center p-3 bg-white/20 dark:bg-red-900/10 rounded-lg">
                        <p className="text-xs text-violet-100 dark:text-gray-400 mb-1">Egresos</p>
                        <p className="text-lg font-bold text-white dark:text-red-400">-$2.4M</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/20 dark:bg-gradient-to-r dark:from-purple-900/20 dark:to-purple-900/5 border border-white/30 dark:border-purple-500/20 rounded-xl">
                      <p className="text-xs text-violet-100 dark:text-gray-400 mb-1">Saldo Final Proyectado</p>
                      <p className="text-3xl font-bold text-white dark:text-gray-100 mb-1">$1.65M</p>
                      <p className="text-xs text-violet-100 dark:text-green-400">+32% vs saldo inicial • Estado: Óptimo ✓</p>
                    </div>
                  </motion.div>

                  {/* Financiamiento Disponible */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-500/90 to-amber-600/90 dark:bg-neutral-800 border-0 dark:border dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white dark:text-gray-100 mb-4">Financiamiento Disponible</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-orange-900/20 to-orange-900/5 border border-orange-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold">Ecosistema</p>
                          <span className="text-xs px-2 py-1 bg-orange-900/20 text-orange-400 rounded-full">12 activas</span>
                        </div>
                        <p className="text-2xl font-bold mb-1">$850K</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Confirming • Factoring • Líneas Flash</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold">Bancario</p>
                          <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 rounded-full">3 líneas</span>
                        </div>
                        <p className="text-2xl font-bold mb-1">$680K</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">BCP • BBVA • Interbank • 57% disponible</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* SUNAT + Automatizaciones */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* SUNAT */}
                  <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Cumplimiento SUNAT</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-red-900/10 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">IGV por Pagar</p>
                        <p className="text-lg font-bold">$45K</p>
                        <p className="text-xs text-red-400">Vence: 15/11</p>
                      </div>
                      <div className="p-3 bg-orange-900/10 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Renta Mensual</p>
                        <p className="text-lg font-bold">$12K</p>
                        <p className="text-xs text-orange-400">Vence: 20/11</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { item: 'PLAME', status: 'Enviado', color: 'green' },
                        { item: 'Libros Electrónicos', status: '6/6 Al día', color: 'green' },
                        { item: 'SIRE', status: '156 facturas', color: 'blue' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-neutral-700/30 rounded">
                          <span className="text-sm text-gray-400 dark:text-gray-300">{item.item}</span>
                          <span className={`text-xs px-2 py-1 bg-${item.color}-900/20 text-${item.color}-400 rounded-full`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Automatizaciones */}
                  <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Automatizaciones</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-blue-900/10 rounded-lg">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Activas</p>
                      </div>
                      <div className="text-center p-3 bg-green-900/10 rounded-lg">
                        <p className="text-2xl font-bold">48h</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Ahorradas/mes</p>
                      </div>
                      <div className="text-center p-3 bg-purple-900/10 rounded-lg">
                        <p className="text-2xl font-bold">89</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Errores evitados</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        'Conciliación Bancaria Automática',
                        'Recordatorio Facturas Vencidas',
                        'Clasificación Automática Gastos'
                      ].map((auto, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-neutral-700/30 rounded">
                          <div className="w-6 h-6 bg-blue-900/20 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-300">{auto}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'Emitir Factura', IconComponent: FileText, tab: 'facturacion' },
                      { name: 'Ver Cobranza', IconComponent: DollarSign, tab: 'cobranza' },
                      { name: 'Revisar Presupuesto', IconComponent: BarChart3, tab: 'presupuesto' },
                      { name: 'Chat con IA', IconComponent: Bot, tab: 'copiloto' }
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(action.tab as any)}
                        className="p-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-100 dark:bg-neutral-700/50 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 rounded-xl transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-2">
                          <action.IconComponent className="w-6 h-6 text-primary-500" />
                        </div>
                        <p className="text-sm font-semibold">{action.name}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === 'analytics' && (
              <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-100 dark:bg-neutral-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Métricas de Rendimiento</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 dark:text-gray-300">Ingresos del Mes</span>
                        <span className="text-green-400 font-bold">$2.1M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 dark:text-gray-300">Gastos del Mes</span>
                        <span className="text-red-400 font-bold">$1.3M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 dark:text-gray-300">Margen Neto</span>
                        <span className="text-blue-400 font-bold">18%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-neutral-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Crecimiento</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 dark:text-gray-300">vs Mes Anterior</span>
                        <span className="text-green-400 font-bold">+14%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 dark:text-gray-300">vs Año Anterior</span>
                        <span className="text-green-400 font-bold">+28%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center mt-8">Gráficos y análisis detallados próximamente...</p>
              </motion.div>
            )}

            {activeTab === 'facturas' && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <FacturasTable />
                </div>
              </motion.div>
            )}

            {/* TESORERÍA */}
            {activeTab === 'tesoreria' && (
              <div className="space-y-6">
                {/* Cuentas Bancarias */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">BCP - Corriente</p>
                        <p className="text-2xl font-bold">$680K</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-green-400">+$45K hoy</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">BBVA - Corriente</p>
                        <p className="text-2xl font-bold">$420K</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-red-400">-$12K hoy</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Interbank - Nómina</p>
                        <p className="text-2xl font-bold">$150K</p>
                      </div>
                      <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sin movimientos</p>
                  </div>
                </motion.div>

                {/* Movimientos del Día */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Movimientos de Hoy</h3>
                  <div className="space-y-4">
                    {recentTransactions.slice(0, 8).map((tx, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'ingreso' ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                            {tx.type === 'ingreso' ? '↑' : '↓'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{tx.concepto}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{tx.cuenta}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-bold ${tx.type === 'ingreso' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'ingreso' ? '+' : '-'}${(tx.amount / 1000).toFixed(1)}K
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* REPORTES */}
            {activeTab === 'reportes' && (
              <div className="space-y-6">
                {/* Tabs */}
                <motion.div variants={itemVariants} className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setReportesTab('financieros')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      reportesTab === 'financieros'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-white'
                    }`}
                  >
                    Reportes Financieros
                  </button>
                  <button
                    onClick={() => setReportesTab('impuestos')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      reportesTab === 'impuestos'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-white'
                    }`}
                  >
                    Impuestos y SUNAT
                  </button>
                </motion.div>

                {/* Reportes Financieros */}
                {reportesTab === 'financieros' && (
                  <>
                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { name: 'Estado de Resultados', IconComponent: BarChart3, color: 'blue' },
                        { name: 'Balance General', IconComponent: TrendingUp, color: 'green' },
                        { name: 'Flujo de Caja', IconComponent: DollarSign, color: 'purple' },
                        { name: 'Libro Diario', IconComponent: BookOpen, color: 'orange' }
                      ].map((report, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ y: -4 }}
                          className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-left hover:border-gray-300 dark:border-gray-600 transition-all"
                        >
                          <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                            <report.IconComponent className="w-7 h-7 text-primary-500" />
                          </div>
                          <h3 className="text-sm font-semibold mb-2">{report.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Generar reporte</p>
                        </motion.button>
                      ))}
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                      <h3 className="text-lg font-bold mb-6">Reportes Recientes</h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Estado de Resultados - Junio 2025', date: '01/07/2025', size: '2.4 MB' },
                          { name: 'Balance General - Q2 2025', date: '30/06/2025', size: '1.8 MB' },
                          { name: 'Flujo de Caja - Mayo 2025', date: '31/05/2025', size: '1.2 MB' }
                        ].map((report, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{report.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{report.date} • {report.size}</p>
                              </div>
                            </div>
                            <button className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                              Descargar
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}

                {/* Impuestos y SUNAT */}
                {reportesTab === 'impuestos' && (
                  <>
                    {/* Stats Overview */}
                    <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 rounded-xl p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">IGV por Pagar</p>
                        <p className="text-2xl font-bold">$45K</p>
                        <p className="text-xs text-red-400">Vence: 15/11/2025</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border border-orange-500/20 rounded-xl p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Renta Mensual</p>
                        <p className="text-2xl font-bold">$12K</p>
                        <p className="text-xs text-orange-400">Vence: 20/11/2025</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">PLAME Enviado</p>
                        <p className="text-2xl font-bold">✓</p>
                        <p className="text-xs text-green-400">Octubre 2025</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-xl p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Libros Electrónicos</p>
                        <p className="text-2xl font-bold">6/6</p>
                        <p className="text-xs text-purple-400">Al día</p>
                      </div>
                    </motion.div>

                    {/* Declaraciones y Libros SUNAT */}
                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                      {/* Declaraciones Mensuales */}
                      <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-6">Declaraciones Mensuales</h3>
                        <div className="space-y-4">
                          {[
                            { name: 'PDT 621 - IGV Renta', periodo: 'Octubre 2025', vence: '15/11/2025', status: 'Pendiente' },
                            { name: 'PLAME', periodo: 'Octubre 2025', vence: '17/11/2025', status: 'Enviado' },
                            { name: 'PDT 617 - Otras Retenciones', periodo: 'Octubre 2025', vence: '20/11/2025', status: 'Pendiente' }
                          ].map((dec, idx) => (
                            <div key={idx} className="p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">{dec.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  dec.status === 'Enviado' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'
                                }`}>
                                  {dec.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                <span>{dec.periodo}</span>
                                <span>Vence: {dec.vence}</span>
                              </div>
                              {dec.status === 'Pendiente' && (
                                <button className="w-full mt-3 text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                  Generar y Enviar
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Libros Electrónicos */}
                      <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-6">Libros Electrónicos (PLE)</h3>
                        <div className="space-y-4">
                          {[
                            { name: 'Registro de Ventas', periodo: 'Octubre 2025', status: 'Enviado' },
                            { name: 'Registro de Compras', periodo: 'Octubre 2025', status: 'Enviado' },
                            { name: 'Libro Diario', periodo: 'Octubre 2025', status: 'Enviado' },
                            { name: 'Libro Mayor', periodo: 'Octubre 2025', status: 'Enviado' },
                            { name: 'Libro de Inventarios', periodo: 'Octubre 2025', status: 'Enviado' },
                            { name: 'Libro Caja y Bancos', periodo: 'Octubre 2025', status: 'Enviado' }
                          ].map((libro, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                              <div>
                                <p className="text-sm font-semibold">{libro.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{libro.periodo}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded-full">
                                  {libro.status}
                                </span>
                                <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded transition-colors">
                                  Ver
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* SIRE y Comprobantes */}
                    <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                      <h3 className="text-lg font-bold mb-6">SIRE - Sistema Integrado de Registros Electrónicos</h3>
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-xl">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Facturas Emitidas</p>
                          <p className="text-3xl font-bold mb-1">156</p>
                          <p className="text-xs text-green-400">Octubre 2025</p>
                        </div>
                        <div className="text-center p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-xl">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Notas de Crédito</p>
                          <p className="text-3xl font-bold mb-1">8</p>
                          <p className="text-xs text-yellow-400">Octubre 2025</p>
                        </div>
                        <div className="text-center p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-xl">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Comprobantes Recibidos</p>
                          <p className="text-3xl font-bold mb-1">234</p>
                          <p className="text-xs text-blue-400">Octubre 2025</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 text-sm px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                          Enviar a SIRE
                        </button>
                        <button className="flex-1 text-sm px-4 py-3 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                          Descargar Reporte
                        </button>
                      </div>
                    </motion.div>

                    {/* Calendario Tributario */}
                    <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                      <h3 className="text-lg font-bold mb-6">Calendario Tributario - Noviembre 2025</h3>
                      <div className="space-y-3">
                        {[
                          { fecha: '12 Nov', obligacion: 'PDT 621 - IGV Renta (RUC termina en 0-1)', monto: '$45K' },
                          { fecha: '13 Nov', obligacion: 'PDT 621 - IGV Renta (RUC termina en 2-3)', monto: '-' },
                          { fecha: '14 Nov', obligacion: 'PDT 621 - IGV Renta (RUC termina en 4-5)', monto: '-' },
                          { fecha: '15 Nov', obligacion: 'PDT 621 - IGV Renta (RUC termina en 6-7)', monto: '-' },
                          { fecha: '17 Nov', obligacion: 'PLAME - Planilla Electrónica', monto: '$180K' },
                          { fecha: '20 Nov', obligacion: 'PDT 617 - Otras Retenciones', monto: '$12K' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg hover:bg-gray-100 dark:bg-neutral-700/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-16 text-center">
                                <p className="text-xs font-bold text-blue-400">{item.fecha}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.obligacion}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold">{item.monto}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            )}

            {/* CONCILIACIÓN */}
            {activeTab === 'conciliacion' && (
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-2xl p-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Conciliadas</p>
                    <p className="text-3xl font-bold mb-1">35</p>
                    <p className="text-xs text-green-400">Este mes</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border border-yellow-500/20 rounded-2xl p-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Pendientes</p>
                    <p className="text-3xl font-bold mb-1">12</p>
                    <p className="text-xs text-yellow-400">Requieren atención</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 rounded-2xl p-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Discrepancias</p>
                    <p className="text-3xl font-bold mb-1">3</p>
                    <p className="text-xs text-red-400">Revisar urgente</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Transacciones Pendientes de Conciliar</h3>
                  <div className="space-y-3">
                    {[
                      { banco: 'BCP', monto: 45000, fecha: '03/10/2025', concepto: 'Transferencia Cliente XYZ' },
                      { banco: 'BBVA', monto: -32000, fecha: '03/10/2025', concepto: 'Pago Proveedor ABC' },
                      { banco: 'BCP', monto: 28000, fecha: '02/10/2025', concepto: 'Cobro Factura #1245' }
                    ].map((tx, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-400">{tx.banco}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{tx.concepto}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{tx.fecha}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className={`text-sm font-bold ${tx.monto > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${Math.abs(tx.monto / 1000).toFixed(1)}K
                          </p>
                          <button className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            Conciliar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* ALERTAS */}
            {activeTab === 'alertas' && (
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Críticas</p>
                    <p className="text-2xl font-bold text-red-400">5</p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Advertencias</p>
                    <p className="text-2xl font-bold text-yellow-400">12</p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Informativas</p>
                    <p className="text-2xl font-bold text-blue-400">8</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Resueltas</p>
                    <p className="text-2xl font-bold text-green-400">23</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Alertas Activas</h3>
                  <div className="space-y-4">
                    {[
                      { tipo: 'Crítica', mensaje: '5 facturas vencidas hace más de 30 días', tiempo: 'Hace 2 horas', color: 'red' },
                      { tipo: 'Advertencia', mensaje: 'Saldo en cuenta BCP por debajo del mínimo', tiempo: 'Hace 5 horas', color: 'yellow' },
                      { tipo: 'Advertencia', mensaje: '12 transacciones pendientes de conciliar', tiempo: 'Hace 1 día', color: 'yellow' },
                      { tipo: 'Info', mensaje: 'Nuevo reporte disponible: Estado de Resultados', tiempo: 'Hace 2 días', color: 'blue' }
                    ].map((alert, idx) => (
                      <div key={idx} className={`flex items-start gap-4 p-4 bg-${alert.color}-900/10 border border-${alert.color}-500/20 rounded-lg`}>
                        <div className={`w-10 h-10 bg-${alert.color}-900/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <svg className={`w-5 h-5 text-${alert.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold text-${alert.color}-400`}>{alert.tipo}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{alert.tiempo}</span>
                          </div>
                          <p className="text-sm text-gray-400 dark:text-gray-300">{alert.mensaje}</p>
                        </div>
                        <button className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                          Resolver
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* COPILOTO IA - CHAT */}
            {activeTab === 'copiloto' && (
              <div className="space-y-6">
                {/* Quick Insights */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-xs font-semibold text-blue-400">Insight del Día</p>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-300">Tus gastos en Marketing aumentaron 25% este mes</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-900/30 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <p className="text-xs font-semibold text-green-400">Oportunidad</p>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-300">Puedes ahorrar $8K renegociando con proveedores</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-yellow-900/30 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      </div>
                      <p className="text-xs font-semibold text-yellow-400">Recomendación</p>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-300">Considera aumentar tu reserva de caja en 10%</p>
                  </div>
                </motion.div>

                {/* Chat Interface */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-900/30 to-primary-900/30 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-primary-600 rounded-xl flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Copiloto Financiero</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Siempre listo para ayudarte</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 dark:bg-neutral-700 text-neutral-200'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Pregúntame sobre tus finanzas..."
                        className="flex-1 bg-gray-100 dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                      <button className="bg-gradient-to-r from-blue-600 to-primary-600 px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                        Enviar
                      </button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {['¿Cómo va mi flujo de caja?', '¿Cuándo debo pagar facturas?', 'Analiza mis gastos'].map((q, idx) => (
                        <button key={idx} className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* PREDICCIONES IA */}
            {activeTab === 'predicciones' && (
              <div className="space-y-6">
                {/* Forecast Cards */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-2xl p-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Ingresos Proyectados - Julio</p>
                    <p className="text-3xl font-bold mb-2">$2.1M</p>
                    <p className="text-xs text-green-400">+14% vs mes anterior</p>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">Confianza: 87%</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-2xl p-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Gastos Estimados - Julio</p>
                    <p className="text-3xl font-bold mb-2">$1.3M</p>
                    <p className="text-xs text-yellow-400">+8% vs mes anterior</p>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">Confianza: 92%</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-2xl p-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Flujo Neto Proyectado</p>
                    <p className="text-3xl font-bold mb-2">$800K</p>
                    <p className="text-xs text-green-400">+22% vs mes anterior</p>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">Confianza: 85%</div>
                  </div>
                </motion.div>

                {/* Predicción de Flujo de Caja */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <h3 className="text-lg font-bold mb-6">Predicción de Flujo de Caja - Próximos 3 Meses</h3>
                  <div className="h-64 flex items-end justify-between gap-4 px-4">
                    {[
                      { month: 'Jul', amount: 2100, confidence: 87 },
                      { month: 'Ago', amount: 2350, confidence: 78 },
                      { month: 'Sep', amount: 2580, confidence: 65 }
                    ].map((data, idx) => {
                      const height = (data.amount / 2600) * 100
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full h-56 flex items-end">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ duration: 1, delay: idx * 0.2 }}
                              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg relative group cursor-pointer"
                            >
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded-lg text-xs whitespace-nowrap">
                                <p className="font-bold">${(data.amount / 1000).toFixed(1)}M</p>
                                <p className="text-gray-600 dark:text-gray-400">Confianza: {data.confidence}%</p>
                              </div>
                            </motion.div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{data.month}</span>
                          <span className="text-xs font-semibold text-purple-400">${(data.amount / 1000).toFixed(1)}M</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Recomendaciones IA */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Recomendaciones Basadas en IA</h3>
                  <div className="space-y-4">
                    {[
                      { IconComponent: DollarSign, title: 'Optimiza tu capital de trabajo', desc: 'Basado en tu flujo proyectado, considera reducir inventario en 15%', impact: 'Alto' },
                      { IconComponent: BarChart3, title: 'Diversifica ingresos', desc: 'El 60% de tus ingresos depende de 3 clientes. Recomendamos diversificar', impact: 'Medio' },
                      { IconComponent: Zap, title: 'Automatiza pagos recurrentes', desc: 'Puedes ahorrar 12 horas/mes automatizando pagos a proveedores fijos', impact: 'Alto' }
                    ].map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
                          <rec.IconComponent className="w-6 h-6 text-primary-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold">{rec.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              rec.impact === 'Alto' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'
                            }`}>
                              Impacto {rec.impact}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{rec.desc}</p>
                        </div>
                        <button className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                          Ver más
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* AUTOMATIZACIONES */}
            {activeTab === 'automatizaciones' && (
              <div className="space-y-6">
                {/* Stats */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Automatizaciones Activas</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tiempo Ahorrado</p>
                    <p className="text-2xl font-bold">48h/mes</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tareas Ejecutadas</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Errores Evitados</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                </motion.div>

                {/* Automatizaciones Activas */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Automatizaciones Activas</h3>
                    <button className="text-xs px-4 py-2 bg-gradient-to-r from-blue-600 to-primary-600 rounded-lg hover:opacity-90 transition-opacity">
                      + Nueva Automatización
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Conciliación Bancaria Automática', trigger: 'Diario a las 8:00 AM', status: 'Activa', executions: 30 },
                      { name: 'Recordatorio de Facturas Vencidas', trigger: 'Cada 3 días', status: 'Activa', executions: 45 },
                      { name: 'Clasificación Automática de Gastos', trigger: 'Al recibir factura', status: 'Activa', executions: 156 },
                      { name: 'Reporte Semanal de Flujo de Caja', trigger: 'Lunes 9:00 AM', status: 'Activa', executions: 12 }
                    ].map((auto, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-primary-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{auto.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{auto.trigger} • {auto.executions} ejecuciones</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded-full">
                            {auto.status}
                          </span>
                          <button className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                            Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Templates de Automatización */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Templates Populares</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'Auto-pago de Facturas', IconComponent: CreditCard, desc: 'Paga facturas automáticamente en fecha de vencimiento' },
                      { name: 'Alertas de Saldo Bajo', IconComponent: AlertTriangle, desc: 'Notifica cuando el saldo esté por debajo del mínimo' },
                      { name: 'Categorización IA', IconComponent: Tag, desc: 'Clasifica gastos automáticamente con IA' }
                    ].map((template, idx) => (
                      <button key={idx} className="text-left p-4 bg-gray-100 dark:bg-neutral-700/30 hover:bg-gray-100 dark:bg-neutral-700/50 rounded-xl transition-colors">
                        <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-3">
                          <template.IconComponent className="w-6 h-6 text-primary-500" />
                        </div>
                        <h4 className="text-sm font-semibold mb-2">{template.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{template.desc}</p>
                        <span className="text-xs text-blue-400">Usar template →</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* SALUD FINANCIERA */}
            {activeTab === 'salud' && (
              <div className="space-y-6">
                {/* Health Score */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-900/20 to-emerald-900/5 border border-green-500/20 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Score de Salud Financiera</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Basado en 12 indicadores clave</p>
                    </div>
                    <div className="text-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-neutral-800" />
                          <circle 
                            cx="64" 
                            cy="64" 
                            r="56" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="8" 
                            strokeDasharray={`${(healthScore / 100) * 352} 352`}
                            className="text-green-400"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">{healthScore}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Excelente</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Liquidez</p>
                      <p className="text-2xl font-bold text-green-400">92</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Solvencia</p>
                      <p className="text-2xl font-bold text-green-400">85</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Rentabilidad</p>
                      <p className="text-2xl font-bold text-yellow-400">68</p>
                    </div>
                  </div>
                </motion.div>

                {/* Ratios Financieros */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Ratios Financieros Clave</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { name: 'Ratio de Liquidez', value: '2.8', benchmark: '2.0', status: 'good', desc: 'Capacidad para cubrir obligaciones a corto plazo' },
                      { name: 'Ratio de Endeudamiento', value: '0.45', benchmark: '0.50', status: 'good', desc: 'Proporción de deuda vs activos totales' },
                      { name: 'Margen de Utilidad', value: '18%', benchmark: '15%', status: 'good', desc: 'Rentabilidad sobre ventas' },
                      { name: 'ROE', value: '22%', benchmark: '20%', status: 'good', desc: 'Retorno sobre patrimonio' },
                      { name: 'Días de Cobro', value: '42', benchmark: '45', status: 'good', desc: 'Tiempo promedio de cobro' },
                      { name: 'Rotación de Inventario', value: '6.2', benchmark: '5.0', status: 'good', desc: 'Veces que rota el inventario al año' }
                    ].map((ratio, idx) => (
                      <div key={idx} className="p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold">{ratio.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            ratio.status === 'good' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                          }`}>
                            {ratio.status === 'good' ? '✓ Saludable' : '⚠ Revisar'}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-2xl font-bold">{ratio.value}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">vs {ratio.benchmark} industria</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{ratio.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Comparación con Industria */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Comparación con tu Industria (Retail)</h3>
                  <div className="space-y-4">
                    {[
                      { metric: 'Margen Bruto', tuEmpresa: 35, industria: 28, unit: '%' },
                      { metric: 'Gastos Operativos', tuEmpresa: 22, industria: 25, unit: '%' },
                      { metric: 'Crecimiento Anual', tuEmpresa: 18, industria: 12, unit: '%' }
                    ].map((comp, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 dark:text-gray-300">{comp.metric}</span>
                          <div className="flex gap-4">
                            <span className="text-green-400 font-semibold">Tú: {comp.tuEmpresa}{comp.unit}</span>
                            <span className="text-gray-500 dark:text-gray-400">Industria: {comp.industria}{comp.unit}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-gray-100 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: `${(comp.tuEmpresa / 50) * 100}%` }}></div>
                          </div>
                          <div className="flex-1 bg-gray-100 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                            <div className="bg-neutral-600 h-full" style={{ width: `${(comp.industria / 50) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* PLANIFICACIÓN ESTRATÉGICA */}
            {activeTab === 'planificacion' && (
              <div className="space-y-6">
                {/* Escenarios What-If */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Simulador de Escenarios "What-If"</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-6">
                      <h4 className="text-sm font-semibold mb-4 text-green-400">Escenario Optimista</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Crecimiento ventas: +25%</p>
                          <p className="text-2xl font-bold">$3.2M</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Utilidad neta</p>
                          <p className="text-xl font-bold text-green-400">$640K</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-6">
                      <h4 className="text-sm font-semibold mb-4 text-blue-400">Escenario Base</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Crecimiento ventas: +15%</p>
                          <p className="text-2xl font-bold">$2.9M</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Utilidad neta</p>
                          <p className="text-xl font-bold text-blue-400">$520K</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 rounded-xl p-6">
                      <h4 className="text-sm font-semibold mb-4 text-red-400">Escenario Pesimista</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Crecimiento ventas: +5%</p>
                          <p className="text-2xl font-bold">$2.4M</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Utilidad neta</p>
                          <p className="text-xl font-bold text-red-400">$360K</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-neutral-700/30 rounded-xl p-6">
                    <h4 className="text-sm font-semibold mb-4">Simula tu Escenario</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Crecimiento Ventas (%)</label>
                        <input type="number" defaultValue="15" className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Aumento Costos (%)</label>
                        <input type="number" defaultValue="8" className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Nueva Inversión ($)</label>
                        <input type="number" defaultValue="50000" className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <button className="mt-4 bg-gradient-to-r from-blue-600 to-primary-600 px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      Calcular Escenario
                    </button>
                  </div>
                </motion.div>

                {/* Objetivos y Metas */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Objetivos 2025</h3>
                    <button className="text-xs px-4 py-2 bg-blue-600 rounded-lg hover:opacity-90 transition-opacity">
                      + Nuevo Objetivo
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Ingresos Anuales', target: 35000000, current: 28500000, unit: '$' },
                      { name: 'Margen de Utilidad', target: 20, current: 18, unit: '%' },
                      { name: 'Nuevos Clientes', target: 150, current: 89, unit: '' }
                    ].map((goal, idx) => {
                      const progress = (goal.current / goal.target) * 100
                      return (
                        <div key={idx} className="p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold">{goal.name}</h4>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{progress.toFixed(0)}% completado</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-neutral-700 rounded-full h-3 overflow-hidden mb-2">
                            <div className="bg-gradient-to-r from-blue-600 to-primary-600 h-full" style={{ width: `${progress}%` }}></div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Actual: {goal.unit}{goal.current.toLocaleString()}</span>
                            <span className="text-gray-600 dark:text-gray-400">Meta: {goal.unit}{goal.target.toLocaleString()}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
            )}

            {/* GESTIÓN DE RIESGOS */}
            {activeTab === 'riesgos' && (
              <div className="space-y-6">
                {/* Matriz de Riesgos */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Matriz de Riesgos Identificados</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'Concentración de Clientes', impact: 'Alto', probability: 'Media', level: 'high', mitigation: 'Diversificar cartera de clientes' },
                      { name: 'Fluctuación de Tipo de Cambio', impact: 'Medio', probability: 'Alta', level: 'medium', mitigation: 'Cobertura cambiaria con forwards' },
                      { name: 'Retraso en Cobros', impact: 'Medio', probability: 'Media', level: 'medium', mitigation: 'Implementar política de crédito más estricta' },
                      { name: 'Aumento de Costos Operativos', impact: 'Alto', probability: 'Baja', level: 'medium', mitigation: 'Contratos de largo plazo con proveedores' }
                    ].map((risk, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${
                        risk.level === 'high' ? 'bg-red-900/10 border-red-500/20' : 'bg-yellow-900/10 border-yellow-500/20'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-sm font-semibold">{risk.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            risk.level === 'high' ? 'bg-red-900/20 text-red-400' : 'bg-yellow-900/20 text-yellow-400'
                          }`}>
                            {risk.level === 'high' ? 'Alto' : 'Medio'}
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Impacto:</span>
                            <span className="font-semibold">{risk.impact}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Probabilidad:</span>
                            <span className="font-semibold">{risk.probability}</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Mitigación:</p>
                          <p className="text-xs text-gray-400 dark:text-gray-300">{risk.mitigation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Alertas Tempranas */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Sistema de Alertas Tempranas</h3>
                  <div className="space-y-3">
                    {[
                      { indicator: 'Ratio de Liquidez', current: 2.8, threshold: 2.0, status: 'safe', trend: 'up' },
                      { indicator: 'Días de Cobro', current: 42, threshold: 45, status: 'safe', trend: 'down' },
                      { indicator: 'Nivel de Endeudamiento', current: 45, threshold: 50, status: 'warning', trend: 'up' },
                      { indicator: 'Margen de Utilidad', current: 18, threshold: 15, status: 'safe', trend: 'stable' }
                    ].map((alert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            alert.status === 'safe' ? 'bg-green-900/20' : 'bg-yellow-900/20'
                          }`}>
                            {alert.status === 'safe' ? '✓' : '⚠'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{alert.indicator}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Umbral: {alert.threshold}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{alert.current}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {alert.trend === 'up' ? '↑' : alert.trend === 'down' ? '↓' : '→'} {alert.trend === 'up' ? 'Subiendo' : alert.trend === 'down' ? 'Bajando' : 'Estable'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recomendaciones de Seguros */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Coberturas Recomendadas</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'Seguro de Crédito', coverage: 'Hasta $500K', premium: '$2,500/mes', priority: 'Alta' },
                      { name: 'Seguro de Responsabilidad', coverage: 'Hasta $1M', premium: '$1,800/mes', priority: 'Media' },
                      { name: 'Seguro de Interrupción', coverage: 'Hasta $300K', premium: '$1,200/mes', priority: 'Media' }
                    ].map((insurance, idx) => (
                      <div key={idx} className="p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-xl">
                        <h4 className="text-sm font-semibold mb-3">{insurance.name}</h4>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Cobertura:</span>
                            <span className="font-semibold">{insurance.coverage}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Prima:</span>
                            <span className="font-semibold">{insurance.premium}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Prioridad:</span>
                            <span className={`font-semibold ${insurance.priority === 'Alta' ? 'text-red-400' : 'text-yellow-400'}`}>
                              {insurance.priority}
                            </span>
                          </div>
                        </div>
                        <button className="w-full text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                          Solicitar Cotización
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* ECOSISTEMA FINANCIERO */}
            {activeTab === 'ecosistema' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border border-orange-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Disponible</p>
                    <p className="text-2xl font-bold">$850K</p>
                    <p className="text-xs text-orange-400">Línea total</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">En Uso</p>
                    <p className="text-2xl font-bold">$420K</p>
                    <p className="text-xs text-blue-400">49% utilizado</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Aprobadas</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-green-400">Operaciones activas</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ahorro</p>
                    <p className="text-2xl font-bold">$45K</p>
                    <p className="text-xs text-purple-400">Este mes</p>
                  </div>
                </motion.div>

                {/* Productos Disponibles */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Confirming */}
                  <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-orange-900/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Confirming</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Paga a tus proveedores de inmediato y extiende tu plazo de pago</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Tasa desde:</span>
                        <span className="font-bold text-orange-400">1.2%/mes</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Plazo:</span>
                        <span className="font-semibold">30-90 días</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                        <span className="font-semibold">Hasta $500K</span>
                      </div>
                    </div>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Solicitar
                    </button>
                  </div>

                  {/* Factoring */}
                  <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Factoring</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Adelanta el cobro de tus facturas y mejora tu flujo de caja</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Tasa desde:</span>
                        <span className="font-bold text-blue-400">1.5%/mes</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Adelanto:</span>
                        <span className="font-semibold">Hasta 90%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                        <span className="font-semibold">Hasta $300K</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Solicitar
                    </button>
                  </div>

                  {/* Línea Spot */}
                  <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Línea Spot</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Crédito instantáneo para oportunidades de negocio urgentes</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Tasa desde:</span>
                        <span className="font-bold text-purple-400">2.0%/mes</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Aprobación:</span>
                        <span className="font-semibold">24 horas</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                        <span className="font-semibold">Hasta $150K</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Solicitar
                    </button>
                  </div>

                  {/* Línea Flash */}
                  <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-green-900/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Línea Flash</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Crédito express para cubrir necesidades inmediatas de capital</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Tasa desde:</span>
                        <span className="font-bold text-green-400">1.8%/mes</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Aprobación:</span>
                        <span className="font-semibold">2 horas</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                        <span className="font-semibold">Hasta $100K</span>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Solicitar
                    </button>
                  </div>
                </motion.div>

                {/* Operaciones Activas */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Operaciones Activas</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'Confirming', proveedor: 'Proveedor ABC SAC', monto: 125000, vencimiento: '15/11/2025', tasa: 1.2, status: 'Activa' },
                      { type: 'Factoring', cliente: 'Cliente XYZ Corp', monto: 85000, vencimiento: '30/10/2025', tasa: 1.5, status: 'Activa' },
                      { type: 'Línea Flash', concepto: 'Capital de trabajo', monto: 50000, vencimiento: '20/10/2025', tasa: 1.8, status: 'Activa' }
                    ].map((op, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-orange-400">{op.type.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{op.type}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{op.proveedor || op.cliente || op.concepto}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">${(op.monto / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{op.tasa}% • Vence {op.vencimiento}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded-full">
                          {op.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* BANCARIO */}
            {activeTab === 'bancario' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Líneas Activas</p>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-blue-400">$1.2M total</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Disponible</p>
                    <p className="text-2xl font-bold">$680K</p>
                    <p className="text-xs text-green-400">57% libre</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Leasing Activos</p>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-xs text-purple-400">$350K</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border border-orange-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Solicitudes</p>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-xs text-orange-400">En evaluación</p>
                  </div>
                </motion.div>

                {/* Productos Bancarios */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                  {/* Línea de Crédito */}
                  <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                    <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Línea de Crédito</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Crédito revolvente para capital de trabajo con tasa preferencial</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Tasa anual:</span>
                        <span className="font-bold text-blue-400">12-18%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Plazo:</span>
                        <span className="font-semibold">12-36 meses</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                        <span className="font-semibold">Hasta $1M</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Solicitar
                    </button>
                  </div>

                  {/* Leasing */}
                  <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                    <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Leasing</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Financiamiento de activos fijos con opción de compra</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Tasa anual:</span>
                        <span className="font-bold text-purple-400">10-15%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Plazo:</span>
                        <span className="font-semibold">24-60 meses</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Financiamiento:</span>
                        <span className="font-semibold">Hasta 100%</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Solicitar
                    </button>
                  </div>

                  {/* Mediano Plazo */}
                  <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                    <div className="w-12 h-12 bg-green-900/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Mediano Plazo</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Crédito estructurado para proyectos de expansión e inversión</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Tasa anual:</span>
                        <span className="font-bold text-green-400">8-14%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Plazo:</span>
                        <span className="font-semibold">36-84 meses</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                        <span className="font-semibold">Desde $500K</span>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Solicitar
                    </button>
                  </div>
                </motion.div>

                {/* Líneas Activas */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Líneas de Crédito Activas</h3>
                  <div className="space-y-4">
                    {[
                      { banco: 'BCP', tipo: 'Línea Revolvente', monto: 500000, usado: 320000, tasa: 14.5, vencimiento: '2026-12-31' },
                      { banco: 'BBVA', tipo: 'Línea Capital Trabajo', monto: 400000, usado: 180000, tasa: 15.2, vencimiento: '2026-06-30' },
                      { banco: 'Interbank', tipo: 'Línea Comercial', monto: 300000, usado: 20000, tasa: 13.8, vencimiento: '2027-03-31' }
                    ].map((linea, idx) => {
                      const porcentajeUsado = (linea.usado / linea.monto) * 100
                      return (
                        <div key={idx} className="p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-400">{linea.banco.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold">{linea.banco} - {linea.tipo}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Tasa: {linea.tasa}% • Vence: {linea.vencimiento}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold">${(linea.monto / 1000).toFixed(0)}K</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Disponible: ${((linea.monto - linea.usado) / 1000).toFixed(0)}K</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-600 h-full" style={{ width: `${porcentajeUsado}%` }}></div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{porcentajeUsado.toFixed(0)}% utilizado</p>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Solicitudes en Proceso */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Solicitudes en Proceso</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Scotiabank - Leasing Maquinaria</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Solicitado: 03/10/2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">$250K</p>
                          <span className="text-xs px-2 py-1 bg-yellow-900/20 text-yellow-400 rounded-full">
                            En evaluación
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                          Ver Detalles
                        </button>
                        <button className="flex-1 text-xs px-3 py-2 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                          Seguimiento
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* FACTURACIÓN ELECTRÓNICA */}
            {activeTab === 'facturacion' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Emitidas Hoy</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-blue-400">$45K facturado</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Este Mes</p>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-green-400">$850K total</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pendientes</p>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-yellow-400">Por enviar</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border border-orange-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Rechazadas</p>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-green-400">100% aceptación</p>
                  </div>
                </motion.div>

                {/* Nueva Factura */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-900/10 to-blue-900/5 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Emitir Nuevo Comprobante</h3>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                        + Factura
                      </button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                        + Boleta
                      </button>
                      <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium transition-colors">
                        + Nota Crédito
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-xl">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-sm font-semibold mb-1">Factura Electrónica</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Para empresas con RUC</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-xl">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-6 h-6 text-green-500" />
                      </div>
                      <p className="text-sm font-semibold mb-1">Boleta de Venta</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Para consumidores finales</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-xl">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-6 h-6 text-orange-500" />
                      </div>
                      <p className="text-sm font-semibold mb-1">Nota de Crédito</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Anulaciones y devoluciones</p>
                    </div>
                  </div>
                </motion.div>

                {/* Comprobantes Recientes */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Comprobantes Recientes</h3>
                  <div className="space-y-3">
                    {[
                      { tipo: 'Factura', numero: 'F001-00156', cliente: 'Empresa ABC SAC', monto: 12500, fecha: '04/10/2025', estado: 'Aceptado' },
                      { tipo: 'Factura', numero: 'F001-00155', cliente: 'Corporación XYZ', monto: 8900, fecha: '04/10/2025', estado: 'Aceptado' },
                      { tipo: 'Boleta', numero: 'B001-00234', cliente: 'Juan Pérez', monto: 450, fecha: '04/10/2025', estado: 'Aceptado' },
                      { tipo: 'Factura', numero: 'F001-00154', cliente: 'Distribuidora LMN', monto: 15600, fecha: '03/10/2025', estado: 'Aceptado' }
                    ].map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg hover:bg-gray-100 dark:bg-neutral-700/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            comp.tipo === 'Factura' ? 'bg-blue-900/20' : 'bg-purple-900/20'
                          }`}>
                            <span className="text-xs font-bold">{comp.tipo === 'Factura' ? 'F' : 'B'}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{comp.numero}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{comp.cliente} • {comp.fecha}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold">${comp.monto.toLocaleString()}</p>
                            <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded-full">
                              {comp.estado}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded transition-colors">
                              Ver
                            </button>
                            <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded transition-colors">
                              PDF
                            </button>
                            <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded transition-colors">
                              XML
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* COBRANZA */}
            {activeTab === 'cobranza' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Por Cobrar</p>
                    <p className="text-2xl font-bold">$850K</p>
                    <p className="text-xs text-green-400">23 facturas</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Por Vencer (7 días)</p>
                    <p className="text-2xl font-bold">$320K</p>
                    <p className="text-xs text-yellow-400">8 facturas</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Vencidas</p>
                    <p className="text-2xl font-bold">$180K</p>
                    <p className="text-xs text-red-400">5 facturas</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cobrado Este Mes</p>
                    <p className="text-2xl font-bold">$1.2M</p>
                    <p className="text-xs text-blue-400">45 facturas</p>
                  </div>
                </motion.div>

                {/* Aging de Cuentas por Cobrar */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Aging de Cuentas por Cobrar</h3>
                  <div className="grid md:grid-cols-5 gap-4">
                    {[
                      { rango: '0-30 días', monto: 350000, facturas: 10, color: 'green' },
                      { rango: '31-60 días', monto: 280000, facturas: 8, color: 'blue' },
                      { rango: '61-90 días', monto: 120000, facturas: 3, color: 'yellow' },
                      { rango: '91-120 días', monto: 80000, facturas: 2, color: 'orange' },
                      { rango: '+120 días', monto: 20000, facturas: 1, color: 'red' }
                    ].map((aging, idx) => (
                      <div key={idx} className={`p-4 bg-${aging.color}-900/10 border border-${aging.color}-500/20 rounded-xl`}>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{aging.rango}</p>
                        <p className="text-xl font-bold mb-1">${(aging.monto / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{aging.facturas} facturas</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Facturas por Cobrar */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Facturas por Cobrar</h3>
                    <button className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      Enviar Recordatorios
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { cliente: 'Empresa ABC SAC', factura: 'F001-00145', monto: 125000, vence: '10/10/2025', dias: 6, status: 'Por vencer' },
                      { cliente: 'Corporación XYZ', factura: 'F001-00142', monto: 89000, vence: '08/10/2025', dias: 4, status: 'Por vencer' },
                      { cliente: 'Distribuidora LMN', factura: 'F001-00138', monto: 156000, vence: '01/10/2025', dias: -3, status: 'Vencida' },
                      { cliente: 'Comercial PQR', factura: 'F001-00135', monto: 45000, vence: '28/09/2025', dias: -6, status: 'Vencida' }
                    ].map((fact, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            fact.status === 'Vencida' ? 'bg-red-900/20' : 'bg-yellow-900/20'
                          }`}>
                            <span className="text-xs font-bold">{fact.cliente.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{fact.cliente}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{fact.factura} • Vence: {fact.vence}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold">${(fact.monto / 1000).toFixed(0)}K</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              fact.status === 'Vencida' ? 'bg-red-900/20 text-red-400' : 'bg-yellow-900/20 text-yellow-400'
                            }`}>
                              {fact.status === 'Vencida' ? `${Math.abs(fact.dias)} días vencida` : `${fact.dias} días`}
                            </span>
                          </div>
                          <button className="text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            Contactar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* CUENTAS POR PAGAR */}
            {activeTab === 'cuentasPorPagar' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Por Pagar</p>
                    <p className="text-2xl font-bold">$420K</p>
                    <p className="text-xs text-red-400">18 facturas</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Esta Semana</p>
                    <p className="text-2xl font-bold">$180K</p>
                    <p className="text-xs text-yellow-400">7 pagos</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border border-orange-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Vencidas</p>
                    <p className="text-2xl font-bold">$45K</p>
                    <p className="text-xs text-orange-400">2 facturas</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pagado Este Mes</p>
                    <p className="text-2xl font-bold">$680K</p>
                    <p className="text-xs text-green-400">32 facturas</p>
                  </div>
                </motion.div>

                {/* Calendario de Pagos */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Calendario de Pagos - Próximos 7 Días</h3>
                  <div className="space-y-3">
                    {[
                      { proveedor: 'Proveedor ABC SAC', factura: 'F-2025-1234', monto: 85000, fecha: '05/10/2025', dias: 1, descuento: 2 },
                      { proveedor: 'Distribuidora XYZ', factura: 'F-2025-5678', monto: 45000, fecha: '06/10/2025', dias: 2, descuento: 0 },
                      { proveedor: 'Comercial LMN', factura: 'F-2025-9012', monto: 32000, fecha: '08/10/2025', dias: 4, descuento: 1.5 },
                      { proveedor: 'Importadora PQR', factura: 'F-2025-3456', monto: 125000, fecha: '10/10/2025', dias: 6, descuento: 3 }
                    ].map((pago, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-red-900/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-red-400">{pago.proveedor.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{pago.proveedor}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{pago.factura} • Vence: {pago.fecha}</p>
                            {pago.descuento > 0 && (
                              <p className="text-xs text-green-400">Descuento {pago.descuento}% por pronto pago</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold">${(pago.monto / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">En {pago.dias} días</p>
                          </div>
                          <button className="text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            Pagar Ahora
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Top Proveedores */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Top Proveedores por Monto</h3>
                  <div className="space-y-3">
                    {[
                      { nombre: 'Proveedor ABC SAC', monto: 450000, facturas: 12, promedioDias: 35 },
                      { nombre: 'Distribuidora XYZ', monto: 320000, facturas: 8, promedioDias: 42 },
                      { nombre: 'Importadora PQR', monto: 280000, facturas: 6, promedioDias: 30 }
                    ].map((prov, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-400">#{idx + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{prov.nombre}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{prov.facturas} facturas • Promedio: {prov.promedioDias} días</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold">${(prov.monto / 1000).toFixed(0)}K</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* PRESUPUESTO */}
            {activeTab === 'presupuesto' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Presupuesto Anual</p>
                    <p className="text-2xl font-bold">$12M</p>
                    <p className="text-xs text-blue-400">2025</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ejecutado</p>
                    <p className="text-2xl font-bold">$9.2M</p>
                    <p className="text-xs text-green-400">77% del año</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Disponible</p>
                    <p className="text-2xl font-bold">$2.8M</p>
                    <p className="text-xs text-purple-400">23% restante</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Variación</p>
                    <p className="text-2xl font-bold">+3%</p>
                    <p className="text-xs text-yellow-400">vs presupuesto</p>
                  </div>
                </motion.div>

                {/* Presupuesto por Categoría */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Presupuesto por Categoría - Octubre 2025</h3>
                  <div className="space-y-4">
                    {[
                      { categoria: 'Ventas y Marketing', presupuesto: 150000, real: 145000, variacion: -3.3 },
                      { categoria: 'Operaciones', presupuesto: 280000, real: 295000, variacion: 5.4 },
                      { categoria: 'Nómina', presupuesto: 420000, real: 420000, variacion: 0 },
                      { categoria: 'Tecnología', presupuesto: 85000, real: 92000, variacion: 8.2 },
                      { categoria: 'Administración', presupuesto: 65000, real: 58000, variacion: -10.8 }
                    ].map((cat, idx) => {
                      const porcentaje = (cat.real / cat.presupuesto) * 100
                      return (
                        <div key={idx} className="p-4 bg-gray-100 dark:bg-neutral-700/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold">{cat.categoria}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              cat.variacion > 5 ? 'bg-red-900/20 text-red-400' : 
                              cat.variacion < -5 ? 'bg-green-900/20 text-green-400' : 
                              'bg-blue-900/20 text-blue-400'
                            }`}>
                              {cat.variacion > 0 ? '+' : ''}{cat.variacion.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                            <span>Presupuesto: ${(cat.presupuesto / 1000).toFixed(0)}K</span>
                            <span>Real: ${(cat.real / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full ${porcentaje > 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                              style={{ width: `${Math.min(porcentaje, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Alertas de Presupuesto */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Alertas de Presupuesto</h3>
                  <div className="space-y-3">
                    {[
                      { categoria: 'Tecnología', mensaje: 'Sobregasto de 8.2% - Revisar gastos en software', nivel: 'warning' },
                      { categoria: 'Operaciones', mensaje: 'Sobregasto de 5.4% - Costos de logística aumentaron', nivel: 'warning' },
                      { categoria: 'Administración', mensaje: 'Ahorro de 10.8% - Optimización de procesos', nivel: 'success' }
                    ].map((alert, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${
                        alert.nivel === 'warning' ? 'bg-yellow-900/10 border-yellow-500/20' : 'bg-green-900/10 border-green-500/20'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            alert.nivel === 'warning' ? 'bg-yellow-900/20' : 'bg-green-900/20'
                          }`}>
                            {alert.nivel === 'warning' ? '⚠️' : '✓'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">{alert.categoria}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{alert.mensaje}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* FLUJO PROYECTADO */}
            {activeTab === 'flujoProyectado' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Saldo Inicial</p>
                    <p className="text-2xl font-bold">$1.25M</p>
                    <p className="text-xs text-blue-400">Hoy</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ingresos Proyectados</p>
                    <p className="text-2xl font-bold">$2.8M</p>
                    <p className="text-xs text-green-400">Próximas 12 semanas</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Egresos Proyectados</p>
                    <p className="text-2xl font-bold">$2.4M</p>
                    <p className="text-xs text-red-400">Próximas 12 semanas</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Saldo Final Proyectado</p>
                    <p className="text-2xl font-bold">$1.65M</p>
                    <p className="text-xs text-purple-400">En 12 semanas</p>
                  </div>
                </motion.div>

                {/* Proyección Semanal */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Proyección de Flujo de Caja - 12 Semanas</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Semana</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Saldo Inicial</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Ingresos</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Egresos</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Saldo Final</th>
                          <th className="text-center py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { semana: 'S1 (Oct 7-13)', inicial: 1250, ingresos: 280, egresos: 220, final: 1310 },
                          { semana: 'S2 (Oct 14-20)', inicial: 1310, ingresos: 250, egresos: 195, final: 1365 },
                          { semana: 'S3 (Oct 21-27)', inicial: 1365, ingresos: 310, egresos: 240, final: 1435 },
                          { semana: 'S4 (Oct 28-Nov 3)', inicial: 1435, ingresos: 220, egresos: 280, final: 1375 },
                          { semana: 'S5 (Nov 4-10)', inicial: 1375, ingresos: 290, egresos: 210, final: 1455 },
                          { semana: 'S6 (Nov 11-17)', inicial: 1455, ingresos: 240, egresos: 195, final: 1500 }
                        ].map((sem, idx) => (
                          <tr key={idx} className="border-b border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:bg-neutral-700/30">
                            <td className="py-3 px-2 font-medium">{sem.semana}</td>
                            <td className="py-3 px-2 text-right">${(sem.inicial / 1000).toFixed(1)}M</td>
                            <td className="py-3 px-2 text-right text-green-400">+${sem.ingresos}K</td>
                            <td className="py-3 px-2 text-right text-red-400">-${sem.egresos}K</td>
                            <td className="py-3 px-2 text-right font-bold">${(sem.final / 1000).toFixed(2)}M</td>
                            <td className="py-3 px-2 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                sem.final > 1400 ? 'bg-green-900/20 text-green-400' : 
                                sem.final > 1200 ? 'bg-blue-900/20 text-blue-400' : 
                                'bg-yellow-900/20 text-yellow-400'
                              }`}>
                                {sem.final > 1400 ? 'Óptimo' : sem.final > 1200 ? 'Normal' : 'Alerta'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Escenarios */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-2xl p-6">
                    <h4 className="text-sm font-semibold mb-4 text-green-400">Escenario Optimista</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ingresos:</span>
                        <span className="font-semibold">+15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Egresos:</span>
                        <span className="font-semibold">-5%</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-green-500/20">
                        <span className="text-gray-600 dark:text-gray-400">Saldo Final:</span>
                        <span className="font-bold text-green-400">$1.95M</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-2xl p-6">
                    <h4 className="text-sm font-semibold mb-4 text-blue-400">Escenario Base</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ingresos:</span>
                        <span className="font-semibold">Sin cambio</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Egresos:</span>
                        <span className="font-semibold">Sin cambio</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-500/20">
                        <span className="text-gray-600 dark:text-gray-400">Saldo Final:</span>
                        <span className="font-bold text-blue-400">$1.65M</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 rounded-2xl p-6">
                    <h4 className="text-sm font-semibold mb-4 text-red-400">Escenario Pesimista</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ingresos:</span>
                        <span className="font-semibold">-10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Egresos:</span>
                        <span className="font-semibold">+5%</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-red-500/20">
                        <span className="text-gray-600 dark:text-gray-400">Saldo Final:</span>
                        <span className="font-bold text-red-400">$1.28M</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* INTEGRACIONES */}
            {activeTab === 'integraciones' && (
              <div className="space-y-6">
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Conecta tu Ecosistema Financiero</h2>
                      <p className="text-gray-600 dark:text-gray-400">Flow se integra con tus sistemas existentes mediante RPA + IA para automatizar y potenciar tus finanzas</p>
                    </div>
                    <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                      <Plug className="w-12 h-12 text-purple-500" />
                    </div>
                  </div>
                </motion.div>

                {/* Status Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Conectadas</p>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-xs text-green-400 mt-1">Activas</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Sincronizaciones</p>
                    <p className="text-3xl font-bold">1.2K</p>
                    <p className="text-xs text-blue-400 mt-1">Este mes</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Última Sync</p>
                    <p className="text-3xl font-bold">5m</p>
                    <p className="text-xs text-purple-400 mt-1">Hace minutos</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border border-orange-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tiempo Ahorrado</p>
                    <p className="text-3xl font-bold">48h</p>
                    <p className="text-xs text-orange-400 mt-1">Este mes</p>
                  </div>
                </motion.div>

                {/* ERP & Contabilidad */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">ERP & Contabilidad</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'QuickBooks', status: 'Conectado', IconComponent: BarChart3, color: 'green', lastSync: 'Hace 5 min' },
                      { name: 'Siigo', status: 'Conectado', IconComponent: TrendingUp, color: 'green', lastSync: 'Hace 12 min' },
                      { name: 'Concar', status: 'Disponible', IconComponent: Wallet, color: 'gray', lastSync: '-' }
                    ].map((erp, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${
                        erp.status === 'Conectado' ? 'bg-green-900/10 border-green-500/20' : 'bg-gray-100 dark:bg-neutral-700/30 border-gray-300 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                              <erp.IconComponent className="w-6 h-6 text-primary-500" />
                            </div>
                            <div>
                              <p className="font-semibold">{erp.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{erp.lastSync}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            erp.status === 'Conectado' ? 'bg-green-900/20 text-green-400' : 'bg-neutral-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            {erp.status}
                          </span>
                        </div>
                        {erp.status === 'Conectado' ? (
                          <button className="w-full text-xs px-3 py-2 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                            Configurar
                          </button>
                        ) : (
                          <button className="w-full text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            Conectar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Bancos */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Bancos (Open Banking)</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { name: 'BCP', status: 'Conectado', IconComponent: Building2, accounts: 3, lastSync: 'Hace 2 min' },
                      { name: 'BBVA', status: 'Conectado', IconComponent: Building2, accounts: 2, lastSync: 'Hace 8 min' },
                      { name: 'Interbank', status: 'Conectado', IconComponent: Building2, accounts: 1, lastSync: 'Hace 15 min' },
                      { name: 'Scotiabank', status: 'Disponible', IconComponent: Building2, accounts: 0, lastSync: '-' }
                    ].map((bank, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${
                        bank.status === 'Conectado' ? 'bg-blue-900/10 border-blue-500/20' : 'bg-gray-100 dark:bg-neutral-700/30 border-gray-300 dark:border-gray-600'
                      }`}>
                        <div className="text-center mb-3">
                          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <bank.IconComponent className="w-6 h-6 text-blue-500" />
                          </div>
                          <p className="font-semibold text-sm">{bank.name}</p>
                          {bank.status === 'Conectado' && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{bank.accounts} cuentas</p>
                          )}
                        </div>
                        <span className={`block text-center text-xs px-2 py-1 rounded-full ${
                          bank.status === 'Conectado' ? 'bg-blue-900/20 text-blue-400' : 'bg-neutral-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {bank.status}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">{bank.lastSync}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* SUNAT & Gobierno */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">SUNAT & Gobierno</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'SUNAT SOL', status: 'Conectado', icon: '🏛️', color: 'green', data: 'Facturas, Libros, SIRE' },
                      { name: 'PLAME', status: 'Conectado', icon: '👥', color: 'green', data: 'Planilla electrónica' },
                      { name: 'PLE', status: 'Conectado', icon: '📚', color: 'green', data: '6 libros electrónicos' }
                    ].map((gov, idx) => (
                      <div key={idx} className="p-4 bg-green-900/10 border border-green-500/20 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-3xl">{gov.icon}</div>
                          <div className="flex-1">
                            <p className="font-semibold">{gov.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{gov.data}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded-full">
                            ✓
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 text-xs px-3 py-2 bg-gray-100 dark:bg-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                            Ver Logs
                          </button>
                          <button className="flex-1 text-xs px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                            Sync Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Pagos & Facturación */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Pasarelas de Pago</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { name: 'Mercado Pago', status: 'Conectado', icon: '💳', color: 'blue' },
                      { name: 'Niubiz', status: 'Conectado', icon: '💳', color: 'blue' },
                      { name: 'Culqi', status: 'Disponible', icon: '💳', color: 'gray' },
                      { name: 'PayPal', status: 'Disponible', icon: '💳', color: 'gray' }
                    ].map((payment, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border text-center ${
                        payment.status === 'Conectado' ? 'bg-blue-900/10 border-blue-500/20' : 'bg-gray-100 dark:bg-neutral-700/30 border-gray-300 dark:border-gray-600'
                      }`}>
                        <div className="text-3xl mb-2">{payment.icon}</div>
                        <p className="font-semibold text-sm mb-2">{payment.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'Conectado' ? 'bg-blue-900/20 text-blue-400' : 'bg-neutral-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Activity Feed - RPA en Acción */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Activity Feed - RPA en Acción</h3>
                    <span className="text-xs px-3 py-1 bg-green-900/20 text-green-400 rounded-full">
                      ● Live
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: '🤖', action: 'IA clasificó 45 gastos automáticamente', time: 'Hace 2 min', type: 'success' },
                      { icon: '✅', action: 'Conciliación bancaria BCP completada (3 min vs 2 días)', time: 'Hace 5 min', type: 'success' },
                      { icon: '⚠️', action: 'Detecté 2 facturas duplicadas - Acción requerida', time: 'Hace 8 min', type: 'warning' },
                      { icon: '📊', action: 'Reporte SUNAT generado automáticamente', time: 'Hace 12 min', type: 'success' },
                      { icon: '💡', action: 'Insight: Puedes ahorrar $5K en gastos operativos', time: 'Hace 15 min', type: 'info' },
                      { icon: '🔄', action: 'Sincronizando 234 transacciones desde QuickBooks', time: 'Hace 18 min', type: 'info' },
                      { icon: '📧', action: 'Recordatorios enviados a 5 clientes con facturas vencidas', time: 'Hace 25 min', type: 'success' },
                      { icon: '🏦', action: 'Saldo bancario actualizado: $1.25M disponible', time: 'Hace 30 min', type: 'info' }
                    ].map((activity, idx) => (
                      <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${
                        activity.type === 'success' ? 'bg-green-900/10 border-green-500/20' :
                        activity.type === 'warning' ? 'bg-yellow-900/10 border-yellow-500/20' :
                        'bg-blue-900/10 border-blue-500/20'
                      }`}>
                        <div className="text-2xl">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ROI Dashboard */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">ROI de Automatización - Este Mes</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Tiempo Ahorrado</p>
                      <p className="text-4xl font-bold text-green-400">48h</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs manual</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Errores Evitados</p>
                      <p className="text-4xl font-bold text-blue-400">89</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">detecciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Ahorro Estimado</p>
                      <p className="text-4xl font-bold text-purple-400">$2.4K</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">en costos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">ROI</p>
                      <p className="text-4xl font-bold text-orange-400">450%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">retorno</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-green-500/20">
                    <p className="text-sm text-center text-gray-400 dark:text-gray-300">
                      Flow ha automatizado <span className="font-bold text-green-400">1,234 tareas</span> este mes, 
                      ahorrándote el equivalente a <span className="font-bold text-green-400">1.2 empleados full-time</span>
                    </p>
                  </div>
                </motion.div>

                {/* Otras Integraciones */}
                <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-6">Otras Integraciones</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'Google Sheets', status: 'Conectado', icon: '📊', desc: 'Sync bidireccional' },
                      { name: 'WhatsApp Business', status: 'Conectado', icon: '💬', desc: 'Recordatorios automáticos' },
                      { name: 'Email', status: 'Conectado', icon: '📧', desc: 'Parsing de facturas' },
                      { name: 'Slack', status: 'Disponible', icon: '💼', desc: 'Notificaciones' },
                      { name: 'Zapier', status: 'Disponible', icon: '⚡', desc: '1000+ apps' },
                      { name: 'API Custom', status: 'Disponible', icon: '🔧', desc: 'Tu propio sistema' }
                    ].map((other, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${
                        other.status === 'Conectado' ? 'bg-purple-900/10 border-purple-500/20' : 'bg-gray-100 dark:bg-neutral-700/30 border-gray-300 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">{other.icon}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{other.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{other.desc}</p>
                          </div>
                        </div>
                        <span className={`block text-center text-xs px-2 py-1 rounded-full ${
                          other.status === 'Conectado' ? 'bg-purple-900/20 text-purple-400' : 'bg-neutral-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {other.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
