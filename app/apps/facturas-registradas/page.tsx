'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  FileBarChart, 
  List, 
  Calendar, 
  Filter,
  Search,
  Download,
  Upload,
  Archive,
  Settings
} from 'lucide-react'

export default function FacturasRegistradasPage() {
  const sidebarSections = [
    {
      title: 'CONSULTA',
      items: [
        { name: 'Todas las Facturas', icon: List, href: '/apps/facturas-registradas/todas' },
        { name: 'Por Fecha', icon: Calendar, href: '/apps/facturas-registradas/fecha' },
        { name: 'Buscar', icon: Search, href: '/apps/facturas-registradas/buscar' },
        { name: 'Filtros Avanzados', icon: Filter, href: '/apps/facturas-registradas/filtros' },
      ]
    },
    {
      title: 'OPERACIONES',
      items: [
        { name: 'Exportar', icon: Download, href: '/apps/facturas-registradas/exportar' },
        { name: 'Importar', icon: Upload, href: '/apps/facturas-registradas/importar' },
        { name: 'Archivar', icon: Archive, href: '/apps/facturas-registradas/archivar' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/facturas-registradas/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Facturas Registradas"
      appDescription="Historial completo de facturas"
      icon={FileBarChart}
      color="from-indigo-600 to-indigo-700"
      sidebarSections={sidebarSections}
      appSlug="facturas-registradas"
    />
  )
}
