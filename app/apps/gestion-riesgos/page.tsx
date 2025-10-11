'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  AlertTriangle, 
  Shield, 
  Search, 
  TrendingDown,
  CheckCircle2,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react'

export default function GestionRiesgosPage() {
  const sidebarSections = [
    {
      title: 'RIESGOS',
      items: [
        { name: 'Identificar', icon: Search, href: '/apps/gestion-riesgos/identificar' },
        { name: 'Activos', icon: AlertTriangle, href: '/apps/gestion-riesgos/activos', badge: '7' },
        { name: 'Mitigados', icon: CheckCircle2, href: '/apps/gestion-riesgos/mitigados' },
      ]
    },
    {
      title: 'ANÁLISIS',
      items: [
        { name: 'Evaluación', icon: BarChart3, href: '/apps/gestion-riesgos/evaluacion' },
        { name: 'Impacto', icon: TrendingDown, href: '/apps/gestion-riesgos/impacto' },
        { name: 'Planes de Acción', icon: Shield, href: '/apps/gestion-riesgos/planes' },
      ]
    },
    {
      title: 'REPORTES',
      items: [
        { name: 'Informes', icon: FileText, href: '/apps/gestion-riesgos/informes' },
        { name: 'Ajustes', icon: Settings, href: '/apps/gestion-riesgos/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Gestión de Riesgos"
      appDescription="Identificación y mitigación de riesgos"
      icon={AlertTriangle}
      color="from-orange-500 to-orange-600"
      sidebarSections={sidebarSections}
      appSlug="gestion-riesgos"
    />
  )
}
