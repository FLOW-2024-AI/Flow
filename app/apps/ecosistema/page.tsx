'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  Building2, 
  Users, 
  Handshake, 
  DollarSign,
  FileText,
  Star,
  Search,
  Settings
} from 'lucide-react'

export default function EcosistemaPage() {
  const sidebarSections = [
    {
      title: 'RED',
      items: [
        { name: 'Partners', icon: Handshake, href: '/apps/ecosistema/partners' },
        { name: 'Inversores', icon: Users, href: '/apps/ecosistema/inversores' },
        { name: 'Buscar', icon: Search, href: '/apps/ecosistema/buscar' },
      ]
    },
    {
      title: 'OPORTUNIDADES',
      items: [
        { name: 'Financiamiento', icon: DollarSign, href: '/apps/ecosistema/financiamiento' },
        { name: 'Solicitudes', icon: FileText, href: '/apps/ecosistema/solicitudes', badge: '2' },
        { name: 'Favoritos', icon: Star, href: '/apps/ecosistema/favoritos' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/ecosistema/config' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Ecosistema"
      appDescription="Red de financiamiento y partners"
      icon={Building2}
      color="from-indigo-600 to-indigo-700"
      sidebarSections={sidebarSections}
      appSlug="ecosistema"
    />
  )
}
