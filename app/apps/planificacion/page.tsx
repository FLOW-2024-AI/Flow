'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  LineChart, 
  Target, 
  Calendar, 
  GitBranch,
  TrendingUp,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react'

export default function PlanificacionPage() {
  const sidebarSections = [
    {
      title: 'ESTRATEGIA',
      items: [
        { name: 'Objetivos', icon: Target, href: '/apps/planificacion/objetivos' },
        { name: 'Plan Anual', icon: Calendar, href: '/apps/planificacion/anual' },
        { name: 'Escenarios', icon: GitBranch, href: '/apps/planificacion/escenarios' },
      ]
    },
    {
      title: 'SEGUIMIENTO',
      items: [
        { name: 'Progreso', icon: TrendingUp, href: '/apps/planificacion/progreso' },
        { name: 'Métricas', icon: BarChart3, href: '/apps/planificacion/metricas' },
        { name: 'Proyecciones', icon: LineChart, href: '/apps/planificacion/proyecciones' },
      ]
    },
    {
      title: 'REPORTES',
      items: [
        { name: 'Informes', icon: FileText, href: '/apps/planificacion/informes' },
        { name: 'Ajustes', icon: Settings, href: '/apps/planificacion/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Planificación"
      appDescription="Estrategia financiera a largo plazo"
      icon={LineChart}
      color="from-blue-600 to-blue-700"
      sidebarSections={sidebarSections}
      appSlug="planificacion"
    />
  )
}
