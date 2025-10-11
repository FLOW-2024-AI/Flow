'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Zap, 
  Plus, 
  List, 
  Play,
  Pause,
  GitBranch,
  Clock,
  FileText,
  Settings
} from 'lucide-react'

export default function AutomatizacionesPage() {
  const sidebarSections = [
    {
      title: 'FLUJOS',
      items: [
        { name: 'Crear Flujo', icon: Plus, href: '/apps/automatizaciones/crear', badge: 'Nuevo' },
        { name: 'Todos los Flujos', icon: List, href: '/apps/automatizaciones/todos' },
        { name: 'Activos', icon: Play, href: '/apps/automatizaciones/activos' },
        { name: 'Pausados', icon: Pause, href: '/apps/automatizaciones/pausados' },
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { name: 'Plantillas', icon: GitBranch, href: '/apps/automatizaciones/plantillas' },
        { name: 'Historial', icon: Clock, href: '/apps/automatizaciones/historial' },
        { name: 'Logs', icon: FileText, href: '/apps/automatizaciones/logs' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/automatizaciones/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Automatizaciones"
      appDescription="Flujos de trabajo automáticos"
      icon={Zap}
      color="from-amber-500 to-amber-600"
      sidebarSections={sidebarSections}
      appSlug="automatizaciones"
    />
  )
}
