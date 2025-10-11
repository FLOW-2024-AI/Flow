'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  FileBarChart, 
  FileText, 
  PieChart, 
  TrendingUp,
  Calendar,
  Download,
  Share2,
  Star,
  Settings
} from 'lucide-react'

export default function ReportesPage() {
  const sidebarSections = [
    {
      title: 'REPORTES',
      items: [
        { name: 'Financieros', icon: FileText, href: '/apps/reportes/financieros' },
        { name: 'Gráficos', icon: PieChart, href: '/apps/reportes/graficos' },
        { name: 'Tendencias', icon: TrendingUp, href: '/apps/reportes/tendencias' },
        { name: 'Periódicos', icon: Calendar, href: '/apps/reportes/periodicos' },
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { name: 'Favoritos', icon: Star, href: '/apps/reportes/favoritos' },
        { name: 'Compartir', icon: Share2, href: '/apps/reportes/compartir' },
        { name: 'Descargar', icon: Download, href: '/apps/reportes/descargar' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/reportes/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Reportes"
      appDescription="Informes financieros y análisis"
      icon={FileBarChart}
      color="from-pink-600 to-pink-700"
      sidebarSections={sidebarSections}
      appSlug="reportes"
    />
  )
}
