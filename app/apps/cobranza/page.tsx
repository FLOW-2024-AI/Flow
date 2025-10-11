'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { CreditCard } from 'lucide-react'

export default function CobranzaPage() {
  return (
    <AppPlaceholder
      appName="Cobranza"
      appDescription="Seguimiento y gestión de cobros"
      icon={CreditCard}
      color="from-green-600 to-green-700"
    />
  )
}
