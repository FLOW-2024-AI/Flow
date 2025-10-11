'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { 
  MessageSquare, 
  Plus, 
  History, 
  Star,
  Trash2,
  Search,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react'

export default function ChatIAPage() {
  const sidebarSections = [
    {
      title: 'CONVERSACIONES',
      items: [
        { name: 'Nueva Conversación', icon: Plus, href: '/apps/chat-ia/nueva', badge: 'Nuevo' },
        { name: 'Historial', icon: History, href: '/apps/chat-ia/historial' },
        { name: 'Favoritos', icon: Star, href: '/apps/chat-ia/favoritos' },
        { name: 'Buscar', icon: Search, href: '/apps/chat-ia/buscar' },
      ]
    },
    {
      title: 'ASISTENTES',
      items: [
        { name: 'Asistente Financiero', icon: Sparkles, href: '/apps/chat-ia/financiero' },
        { name: 'Asistente Contable', icon: Sparkles, href: '/apps/chat-ia/contable' },
        { name: 'Asistente Legal', icon: Sparkles, href: '/apps/chat-ia/legal' },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { name: 'Ajustes', icon: Settings, href: '/apps/chat-ia/config' },
        { name: 'Ayuda', icon: HelpCircle, href: '/apps/chat-ia/ayuda' },
        { name: 'Papelera', icon: Trash2, href: '/apps/chat-ia/papelera' },
      ]
    }
  ]

  return (
    <AppPlaceholder
      appName="Chat IA"
      appDescription="Asistente financiero inteligente"
      icon={MessageSquare}
      color="from-blue-500 to-blue-600"
      sidebarSections={sidebarSections}
      appSlug="chat-ia"
    />
  )
}
