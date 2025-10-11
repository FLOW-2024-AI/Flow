'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { LineChart } from 'lucide-react'

export default function PlanificacionPage() {
  return (
    <AppPlaceholder
      appName="Planificación"
      appDescription="Estrategia financiera a largo plazo"
      icon={LineChart}
      color="from-blue-600 to-blue-700"
    />
  )
}
