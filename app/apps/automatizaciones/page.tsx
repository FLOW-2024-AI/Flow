'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { Zap } from 'lucide-react'

export default function AutomatizacionesPage() {
  return (
    <AppPlaceholder
      appName="Automatizaciones"
      appDescription="Flujos de trabajo automáticos"
      icon={Zap}
      color="from-amber-500 to-amber-600"
    />
  )
}
