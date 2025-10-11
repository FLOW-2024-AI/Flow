'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Target,
  BarChart3,
  Lightbulb,
  FileText,
  Settings
} from 'lucide-react'

export default function SaludFinancieraPage() {
  const sidebarSections = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Vista General', icon: Activity, href: '/apps/salud-financiera/general' },
        { name: 'Score Financiero', icon: Heart, href: '/apps/salud-financiera/score' },
        { name: 'Tendencias', icon: TrendingUp, href: '/apps/salud-financiera/tendencias' },
      ]
    },
    {
      title: 'INDICADORES',
      items: [
        { name: 'KPIs', icon: Target, href: '/apps/salud-financiera/kpis' },
        { name: 'Ratios', icon: BarChart3, href: '/apps/salud-financiera/ratios' },
        { name: 'Alertas', icon: AlertCircle, href: '/apps/salud-financiera/alertas', badge: '3' },
        { name: 'Recomendaciones', icon: Lightbulb, href: '/apps/salud-financiera/recomendaciones' },
      ]
    },
    {
      title: 'REPORTES',
      items: [
        { name: 'Informes', icon: FileText, href: '/apps/salud-financiera/informes' },
        { name: 'Ajustes', icon: Settings, href: '/apps/salud-financiera/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Salud Financiera"
      appDescription="Diagnóstico y métricas financieras"
      icon={Heart}
      color="from-red-500 to-red-600"
      sidebarSections={sidebarSections}
      appSlug="salud-financiera"
    />
  )
}
