'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart,
  Activity,
  Target,
  Calendar,
  Download,
  Settings
} from 'lucide-react'

export default function AnalyticsPage() {
  const sidebarSections = [
    {
      title: 'DASHBOARDS',
      items: [
        { name: 'Vista General', icon: Activity, href: '/apps/analytics/general' },
        { name: 'Tendencias', icon: TrendingUp, href: '/apps/analytics/tendencias' },
        { name: 'KPIs', icon: Target, href: '/apps/analytics/kpis' },
      ]
    },
    {
      title: 'ANÁLISIS',
      items: [
        { name: 'Gráficos', icon: BarChart3, href: '/apps/analytics/graficos' },
        { name: 'Comparativas', icon: PieChart, href: '/apps/analytics/comparativas' },
        { name: 'Series Temporales', icon: LineChart, href: '/apps/analytics/series' },
        { name: 'Periódico', icon: Calendar, href: '/apps/analytics/periodico' },
      ]
    },
    {
      title: 'EXPORTAR',
      items: [
        { name: 'Descargar Reportes', icon: Download, href: '/apps/analytics/descargar' },
        { name: 'Configuración', icon: Settings, href: '/apps/analytics/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Analytics"
      appDescription="Análisis y métricas financieras avanzadas"
      icon={BarChart3}
      color="from-blue-500 to-primary-600"
      sidebarSections={sidebarSections}
      appSlug="analytics"
    />
  )
}
