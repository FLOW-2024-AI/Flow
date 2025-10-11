'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { TrendingUp } from 'lucide-react'

export default function FlujoProyectadoPage() {
  return (
    <AppPlaceholder
      appName="Flujo Proyectado"
      appDescription="Proyección de flujo de caja"
      icon={TrendingUp}
      color="from-cyan-600 to-cyan-700"
    />
  )
}
