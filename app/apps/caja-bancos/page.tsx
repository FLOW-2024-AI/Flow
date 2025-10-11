'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Wallet, 
  Landmark, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileText,
  Plus,
  Settings
} from 'lucide-react'

export default function CajaBancosPage() {
  const sidebarSections = [
    {
      title: 'CUENTAS',
      items: [
        { name: 'Todas las Cuentas', icon: Landmark, href: '/apps/caja-bancos/cuentas' },
        { name: 'Efectivo', icon: DollarSign, href: '/apps/caja-bancos/efectivo' },
        { name: 'Nueva Cuenta', icon: Plus, href: '/apps/caja-bancos/nueva' },
      ]
    },
    {
      title: 'MOVIMIENTOS',
      items: [
        { name: 'Ingresos', icon: ArrowUpRight, href: '/apps/caja-bancos/ingresos' },
        { name: 'Egresos', icon: ArrowDownRight, href: '/apps/caja-bancos/egresos' },
        { name: 'Transferencias', icon: RefreshCw, href: '/apps/caja-bancos/transferencias' },
        { name: 'Historial', icon: FileText, href: '/apps/caja-bancos/historial' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/caja-bancos/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Caja y Bancos"
      appDescription="Control de efectivo y cuentas bancarias"
      icon={Wallet}
      color="from-emerald-600 to-emerald-700"
      sidebarSections={sidebarSections}
      appSlug="caja-bancos"
    />
  )
}
