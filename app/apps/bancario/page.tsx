'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Landmark, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  FileText,
  Calculator,
  Search,
  Settings
} from 'lucide-react'

export default function BancarioPage() {
  const sidebarSections = [
    {
      title: 'PRODUCTOS',
      items: [
        { name: 'Préstamos', icon: DollarSign, href: '/apps/bancario/prestamos' },
        { name: 'Líneas de Crédito', icon: CreditCard, href: '/apps/bancario/lineas' },
        { name: 'Inversiones', icon: TrendingUp, href: '/apps/bancario/inversiones' },
        { name: 'Buscar', icon: Search, href: '/apps/bancario/buscar' },
      ]
    },
    {
      title: 'HERRAMIENTAS',
      items: [
        { name: 'Simulador', icon: Calculator, href: '/apps/bancario/simulador' },
        { name: 'Solicitudes', icon: FileText, href: '/apps/bancario/solicitudes', badge: '1' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/bancario/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Bancario"
      appDescription="Productos y servicios bancarios"
      icon={Landmark}
      color="from-slate-600 to-slate-700"
      sidebarSections={sidebarSections}
      appSlug="bancario"
    />
  )
}
