'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  CreditCard, 
  Receipt, 
  Wallet, 
  TrendingUp, 
  Scale,
  Calendar,
  FileBarChart,
  MessageSquare,
  Lightbulb,
  Zap,
  Heart,
  LineChart,
  AlertTriangle,
  Building2,
  Landmark
} from 'lucide-react'

interface App {
  name: string
  description: string
  icon: any
  href: string
  color: string
  gradient: string
  category: string
}

const apps: App[] = [
  // PRINCIPAL
  { 
    name: 'Dashboard', 
    description: 'Panel de control principal',
    icon: LayoutDashboard, 
    href: '/apps/dashboard', 
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    category: 'Principal'
  },
  { 
    name: 'Analytics', 
    description: 'Análisis y métricas',
    icon: BarChart3, 
    href: '/apps/analytics', 
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-primary-600',
    category: 'Principal'
  },
  
  // OPERACIONES
  { 
    name: 'Facturación', 
    description: 'Gestión de facturas',
    icon: FileText, 
    href: '/apps/facturacion', 
    color: 'bg-blue-600',
    gradient: 'from-blue-600 to-blue-700',
    category: 'Operaciones'
  },
  { 
    name: 'Cobranza', 
    description: 'Seguimiento de cobros',
    icon: CreditCard, 
    href: '/apps/cobranza', 
    color: 'bg-green-600',
    gradient: 'from-green-600 to-green-700',
    category: 'Operaciones'
  },
  { 
    name: 'Cuentas por Pagar', 
    description: 'Gestión de pagos',
    icon: Receipt, 
    href: '/apps/cuentas-pagar', 
    color: 'bg-orange-600',
    gradient: 'from-orange-600 to-orange-700',
    category: 'Operaciones'
  },
  { 
    name: 'Facturas Registradas', 
    description: 'Historial de facturas',
    icon: FileBarChart, 
    href: '/apps/facturas-registradas', 
    color: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-indigo-700',
    category: 'Operaciones'
  },
  
  // TESORERÍA
  { 
    name: 'Caja y Bancos', 
    description: 'Control de efectivo',
    icon: Wallet, 
    href: '/apps/caja-bancos', 
    color: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-emerald-700',
    category: 'Tesorería'
  },
  { 
    name: 'Flujo Proyectado', 
    description: 'Proyección de flujo',
    icon: TrendingUp, 
    href: '/apps/flujo-proyectado', 
    color: 'bg-cyan-600',
    gradient: 'from-cyan-600 to-cyan-700',
    category: 'Tesorería'
  },
  { 
    name: 'Conciliación', 
    description: 'Conciliación bancaria',
    icon: Scale, 
    href: '/apps/conciliacion', 
    color: 'bg-teal-600',
    gradient: 'from-teal-600 to-teal-700',
    category: 'Tesorería'
  },
  
  // PLANIFICACIÓN
  { 
    name: 'Presupuesto', 
    description: 'Planificación financiera',
    icon: Calendar, 
    href: '/apps/presupuesto', 
    color: 'bg-violet-600',
    gradient: 'from-violet-600 to-violet-700',
    category: 'Planificación'
  },
  { 
    name: 'Reportes', 
    description: 'Informes y análisis',
    icon: FileBarChart, 
    href: '/apps/reportes', 
    color: 'bg-pink-600',
    gradient: 'from-pink-600 to-pink-700',
    category: 'Planificación'
  },
  
  // COPILOTO IA
  { 
    name: 'Chat IA', 
    description: 'Asistente inteligente',
    icon: MessageSquare, 
    href: '/apps/chat-ia', 
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    category: 'Copiloto IA'
  },
  { 
    name: 'Predicciones', 
    description: 'Análisis predictivo',
    icon: Lightbulb, 
    href: '/apps/predicciones', 
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-yellow-600',
    category: 'Copiloto IA'
  },
  { 
    name: 'Automatizaciones', 
    description: 'Flujos automáticos',
    icon: Zap, 
    href: '/apps/automatizaciones', 
    color: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-600',
    category: 'Copiloto IA'
  },
  
  // CFO DIGITAL
  { 
    name: 'Salud Financiera', 
    description: 'Diagnóstico financiero',
    icon: Heart, 
    href: '/apps/salud-financiera', 
    color: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
    category: 'CFO Digital'
  },
  { 
    name: 'Planificación', 
    description: 'Estrategia financiera',
    icon: LineChart, 
    href: '/apps/planificacion', 
    color: 'bg-blue-600',
    gradient: 'from-blue-600 to-blue-700',
    category: 'CFO Digital'
  },
  { 
    name: 'Gestión de Riesgos', 
    description: 'Análisis de riesgos',
    icon: AlertTriangle, 
    href: '/apps/gestion-riesgos', 
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    category: 'CFO Digital'
  },
  
  // FINANCIAMIENTO
  { 
    name: 'Ecosistema', 
    description: 'Red de financiamiento',
    icon: Building2, 
    href: '/apps/ecosistema', 
    color: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-indigo-700',
    category: 'Financiamiento'
  },
  { 
    name: 'Bancario', 
    description: 'Productos bancarios',
    icon: Landmark, 
    href: '/apps/bancario', 
    color: 'bg-slate-600',
    gradient: 'from-slate-600 to-slate-700',
    category: 'Financiamiento'
  }
]

const categories = ['Principal', 'Operaciones', 'Tesorería', 'Planificación', 'Copiloto IA', 'CFO Digital', 'Financiamiento']

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#191919] dark:to-[#0C0A09] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-start justify-between gap-4"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <img 
              src="/images/icons/client-icon-dark.svg"
              alt="Cliente"
              className="w-10 h-10 sm:w-12 sm:h-12 dark:hidden"
            />
            <img 
              src="/images/icons/client-icon-light.svg"
              alt="Cliente"
              className="w-10 h-10 sm:w-12 sm:h-12 hidden dark:block"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                Aplicaciones
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Selecciona una aplicación para comenzar
              </p>
            </div>
          </div>
          <ThemeToggle />
        </motion.div>

        {/* Apps Grid by Category */}
        {categories.map((category, catIdx) => {
          const categoryApps = apps.filter(app => app.category === category)
          
          return (
            <div key={catIdx} className="mb-8 sm:mb-12">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
                {category}
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {categoryApps.map((app, idx) => {
                  const Icon = app.icon
                  
                  return (
                    <Link key={idx} href={app.href}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white dark:bg-[#252525] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700 group"
                      >
                        {/* Icon */}
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${app.gradient} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        
                        {/* Name */}
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-xs sm:text-sm leading-tight">
                          {app.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-tight">
                          {app.description}
                        </p>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
