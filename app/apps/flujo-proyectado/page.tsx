'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  TrendingUp, 
  Calendar, 
  GitBranch, 
  BarChart3,
  AlertCircle,
  Target,
  FileText,
  Settings
} from 'lucide-react'

export default function FlujoProyectadoPage() {
  const sidebarSections = [
    {
      title: 'PROYECCIONES',
      items: [
        { name: 'Vista General', icon: TrendingUp, href: '/apps/flujo-proyectado/general' },
        { name: 'Por Período', icon: Calendar, href: '/apps/flujo-proyectado/periodo' },
        { name: 'Escenarios', icon: GitBranch, href: '/apps/flujo-proyectado/escenarios' },
      ]
    },
    {
      title: 'ANÁLISIS',
      items: [
        { name: 'Gráficos', icon: BarChart3, href: '/apps/flujo-proyectado/graficos' },
        { name: 'Alertas', icon: AlertCircle, href: '/apps/flujo-proyectado/alertas', badge: '2' },
        { name: 'Objetivos', icon: Target, href: '/apps/flujo-proyectado/objetivos' },
        { name: 'Reportes', icon: FileText, href: '/apps/flujo-proyectado/reportes' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/flujo-proyectado/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Flujo Proyectado"
      appDescription="Proyección de flujo de caja"
      icon={TrendingUp}
      color="from-cyan-600 to-cyan-700"
      sidebarSections={sidebarSections}
      appSlug="flujo-proyectado"
    />
  )
}
