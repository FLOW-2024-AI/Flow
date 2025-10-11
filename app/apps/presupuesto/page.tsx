'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { Calendar } from 'lucide-react'

export default function PresupuestoPage() {
  return (
    <AppPlaceholder
      appName="Presupuesto"
      appDescription="Planificación y control presupuestario"
      icon={Calendar}
      color="from-violet-600 to-violet-700"
    />
  )
}
