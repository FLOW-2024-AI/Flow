'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  FileText, 
  Plus, 
  List, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileCheck,
  Upload,
  Download,
  Settings
} from 'lucide-react'

export default function FacturacionPage() {
  const sidebarSections = [
    {
      title: 'GESTIÓN',
      items: [
        { name: 'Nueva Factura', icon: Plus, href: '/apps/facturacion/nueva', badge: 'Nuevo' },
        { name: 'Todas las Facturas', icon: List, href: '/apps/facturacion/todas' },
        { name: 'Borradores', icon: Clock, href: '/apps/facturacion/borradores' },
      ]
    },
    {
      title: 'ESTADO',
      items: [
        { name: 'Emitidas', icon: CheckCircle, href: '/apps/facturacion/emitidas' },
        { name: 'Anuladas', icon: XCircle, href: '/apps/facturacion/anuladas' },
        { name: 'Validadas SUNAT', icon: FileCheck, href: '/apps/facturacion/validadas' },
      ]
    },
    {
      title: 'OPERACIONES',
      items: [
        { name: 'Importar', icon: Upload, href: '/apps/facturacion/importar' },
        { name: 'Exportar', icon: Download, href: '/apps/facturacion/exportar' },
        { name: 'Configuración', icon: Settings, href: '/apps/facturacion/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Facturación"
      appDescription="Gestión completa de facturas electrónicas"
      icon={FileText}
      color="from-blue-600 to-blue-700"
      sidebarSections={sidebarSections}
      appSlug="facturacion"
    />
  )
}
