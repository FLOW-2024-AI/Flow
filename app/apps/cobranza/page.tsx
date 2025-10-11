'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  CreditCard, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Mail,
  Phone,
  FileText,
  Settings
} from 'lucide-react'

export default function CobranzaPage() {
  const sidebarSections = [
    {
      title: 'CLIENTES',
      items: [
        { name: 'Todos los Clientes', icon: Users, href: '/apps/cobranza/clientes' },
        { name: 'Por Cobrar', icon: Clock, href: '/apps/cobranza/por-cobrar', badge: '23' },
        { name: 'Vencidos', icon: AlertCircle, href: '/apps/cobranza/vencidos', badge: '5' },
        { name: 'Al Día', icon: CheckCircle2, href: '/apps/cobranza/al-dia' },
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { name: 'Seguimiento', icon: TrendingUp, href: '/apps/cobranza/seguimiento' },
        { name: 'Enviar Recordatorios', icon: Mail, href: '/apps/cobranza/recordatorios' },
        { name: 'Llamadas', icon: Phone, href: '/apps/cobranza/llamadas' },
        { name: 'Reportes', icon: FileText, href: '/apps/cobranza/reportes' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/cobranza/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Cobranza"
      appDescription="Seguimiento y gestión de cobros"
      icon={CreditCard}
      color="from-green-600 to-green-700"
      sidebarSections={sidebarSections}
      appSlug="cobranza"
    />
  )
}
