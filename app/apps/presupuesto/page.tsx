'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Calendar, 
  Plus, 
  List, 
  TrendingUp,
  AlertCircle,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react'

export default function PresupuestoPage() {
  const sidebarSections = [
    {
      title: 'PRESUPUESTOS',
      items: [
        { name: 'Crear Presupuesto', icon: Plus, href: '/apps/presupuesto/crear', badge: 'Nuevo' },
        { name: 'Todos', icon: List, href: '/apps/presupuesto/todos' },
        { name: 'Activos', icon: Calendar, href: '/apps/presupuesto/activos' },
      ]
    },
    {
      title: 'SEGUIMIENTO',
      items: [
        { name: 'Ejecución', icon: TrendingUp, href: '/apps/presupuesto/ejecucion' },
        { name: 'Desviaciones', icon: AlertCircle, href: '/apps/presupuesto/desviaciones', badge: '3' },
        { name: 'Análisis', icon: BarChart3, href: '/apps/presupuesto/analisis' },
        { name: 'Reportes', icon: FileText, href: '/apps/presupuesto/reportes' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/presupuesto/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Presupuesto"
      appDescription="Planificación y control presupuestario"
      icon={Calendar}
      color="from-violet-600 to-violet-700"
      sidebarSections={sidebarSections}
      appSlug="presupuesto"
    />
  )
}
