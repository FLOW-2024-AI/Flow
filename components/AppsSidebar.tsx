'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

interface AppCategory {
  title: string
  apps: {
    name: string
    icon: any
    href: string
    color: string
  }[]
}

const categories: AppCategory[] = [
  {
    title: 'PRINCIPAL',
    apps: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/apps/dashboard', color: 'bg-blue-500' },
      { name: 'Analytics', icon: BarChart3, href: '/apps/analytics', color: 'bg-primary-500' }
    ]
  },
  {
    title: 'OPERACIONES',
    apps: [
      { name: 'Facturación', icon: FileText, href: '/apps/facturacion', color: 'bg-blue-600' },
      { name: 'Cobranza', icon: CreditCard, href: '/apps/cobranza', color: 'bg-green-600' },
      { name: 'Cuentas por Pagar', icon: Receipt, href: '/apps/cuentas-pagar', color: 'bg-orange-600' },
      { name: 'Facturas Registradas', icon: FileBarChart, href: '/apps/facturas-registradas', color: 'bg-indigo-600' }
    ]
  },
  {
    title: 'TESORERÍA',
    apps: [
      { name: 'Caja y Bancos', icon: Wallet, href: '/apps/caja-bancos', color: 'bg-emerald-600' },
      { name: 'Flujo Proyectado', icon: TrendingUp, href: '/apps/flujo-proyectado', color: 'bg-cyan-600' },
      { name: 'Conciliación', icon: Scale, href: '/apps/conciliacion', color: 'bg-teal-600' }
    ]
  },
  {
    title: 'PLANIFICACIÓN',
    apps: [
      { name: 'Presupuesto', icon: Calendar, href: '/apps/presupuesto', color: 'bg-violet-600' },
      { name: 'Reportes', icon: FileBarChart, href: '/apps/reportes', color: 'bg-pink-600' }
    ]
  },
  {
    title: 'COPILOTO IA',
    apps: [
      { name: 'Chat IA', icon: MessageSquare, href: '/apps/chat-ia', color: 'bg-blue-500' },
      { name: 'Predicciones', icon: Lightbulb, href: '/apps/predicciones', color: 'bg-yellow-500' },
      { name: 'Automatizaciones', icon: Zap, href: '/apps/automatizaciones', color: 'bg-amber-500' }
    ]
  },
  {
    title: 'CFO DIGITAL',
    apps: [
      { name: 'Salud Financiera', icon: Heart, href: '/apps/salud-financiera', color: 'bg-red-500' },
      { name: 'Planificación', icon: LineChart, href: '/apps/planificacion', color: 'bg-blue-600' },
      { name: 'Gestión de Riesgos', icon: AlertTriangle, href: '/apps/gestion-riesgos', color: 'bg-orange-500' }
    ]
  },
  {
    title: 'FINANCIAMIENTO',
    apps: [
      { name: 'Ecosistema', icon: Building2, href: '/apps/ecosistema', color: 'bg-indigo-600' },
      { name: 'Bancario', icon: Landmark, href: '/apps/bancario', color: 'bg-slate-600' }
    ]
  }
]

export default function AppsSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-[#252525] dark:bg-[#1A1A1A] text-gray-100 h-screen fixed left-0 top-0 transition-all duration-300 overflow-y-auto border-r border-gray-700 dark:border-gray-800`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <Link href="/apps" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-lg">Flow</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-[#1A1A1A] dark:hover:bg-[#0C0A09] rounded transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        {categories.map((category, idx) => (
          <div key={idx} className="mb-4">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {category.title}
              </h3>
            )}
            <div className="space-y-1">
              {category.apps.map((app, appIdx) => {
                const Icon = app.icon
                const isActive = pathname === app.href
                
                return (
                  <Link
                    key={appIdx}
                    href={app.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-[#1A1A1A] dark:hover:bg-[#0C0A09] hover:text-white'
                    }`}
                    title={collapsed ? app.name : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium">{app.name}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
