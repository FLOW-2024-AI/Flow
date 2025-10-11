'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { MessageSquare } from 'lucide-react'

export default function ChatIAPage() {
  return (
    <AppPlaceholder
      appName="Chat IA"
      appDescription="Asistente financiero inteligente"
      icon={MessageSquare}
      color="from-blue-500 to-blue-600"
    />
  )
}
