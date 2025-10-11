'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Lightbulb, 
  TrendingUp, 
  Brain, 
  Target,
  BarChart3,
  AlertCircle,
  FileText,
  Settings
} from 'lucide-react'

export default function PrediccionesPage() {
  const sidebarSections = [
    {
      title: 'MODELOS',
      items: [
        { name: 'Flujo de Caja', icon: TrendingUp, href: '/apps/predicciones/flujo' },
        { name: 'Ventas', icon: Target, href: '/apps/predicciones/ventas' },
        { name: 'Gastos', icon: BarChart3, href: '/apps/predicciones/gastos' },
        { name: 'Entrenar Modelo', icon: Brain, href: '/apps/predicciones/entrenar' },
      ]
    },
    {
      title: 'ANÁLISIS',
      items: [
        { name: 'Predicciones Activas', icon: Lightbulb, href: '/apps/predicciones/activas' },
        { name: 'Precisión', icon: Target, href: '/apps/predicciones/precision' },
        { name: 'Alertas', icon: AlertCircle, href: '/apps/predicciones/alertas', badge: '4' },
        { name: 'Reportes', icon: FileText, href: '/apps/predicciones/reportes' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/predicciones/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Predicciones"
      appDescription="Análisis predictivo con IA"
      icon={Lightbulb}
      color="from-yellow-500 to-yellow-600"
      sidebarSections={sidebarSections}
      appSlug="predicciones"
    />
  )
}
