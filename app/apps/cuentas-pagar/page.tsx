'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Receipt, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CreditCard,
  FileText,
  Settings
} from 'lucide-react'

export default function CuentasPagarPage() {
  const sidebarSections = [
    {
      title: 'PROVEEDORES',
      items: [
        { name: 'Todos los Proveedores', icon: Users, href: '/apps/cuentas-pagar/proveedores' },
        { name: 'Por Pagar', icon: Clock, href: '/apps/cuentas-pagar/por-pagar', badge: '12' },
        { name: 'Vencidas', icon: AlertTriangle, href: '/apps/cuentas-pagar/vencidas', badge: '3' },
        { name: 'Pagadas', icon: CheckCircle2, href: '/apps/cuentas-pagar/pagadas' },
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { name: 'Programar Pagos', icon: Calendar, href: '/apps/cuentas-pagar/programar' },
        { name: 'Realizar Pago', icon: CreditCard, href: '/apps/cuentas-pagar/pagar' },
        { name: 'Reportes', icon: FileText, href: '/apps/cuentas-pagar/reportes' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/cuentas-pagar/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Cuentas por Pagar"
      appDescription="Gestión de pagos a proveedores"
      icon={Receipt}
      color="from-orange-600 to-orange-700"
      sidebarSections={sidebarSections}
      appSlug="cuentas-pagar"
    />
  )
}
