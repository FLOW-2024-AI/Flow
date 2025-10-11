'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Scale, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Zap,
  FileText,
  Download,
  Settings
} from 'lucide-react'

export default function ConciliacionPage() {
  const sidebarSections = [
    {
      title: 'ESTADO',
      items: [
        { name: 'Conciliadas', icon: CheckCircle2, href: '/apps/conciliacion/conciliadas' },
        { name: 'Pendientes', icon: Clock, href: '/apps/conciliacion/pendientes', badge: '8' },
        { name: 'Con Diferencias', icon: AlertTriangle, href: '/apps/conciliacion/diferencias', badge: '2' },
      ]
    },
    {
      title: 'OPERACIONES',
      items: [
        { name: 'Conciliar Automático', icon: Zap, href: '/apps/conciliacion/automatico' },
        { name: 'Conciliar Manual', icon: Scale, href: '/apps/conciliacion/manual' },
        { name: 'Reportes', icon: FileText, href: '/apps/conciliacion/reportes' },
        { name: 'Exportar', icon: Download, href: '/apps/conciliacion/exportar' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/conciliacion/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Conciliación"
      appDescription="Conciliación bancaria automática"
      icon={Scale}
      color="from-teal-600 to-teal-700"
      sidebarSections={sidebarSections}
      appSlug="conciliacion"
    />
  )
}
