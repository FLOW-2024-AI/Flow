'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { FileBarChart } from 'lucide-react'

export default function FacturasRegistradasPage() {
  return (
    <AppPlaceholder
      appName="Facturas Registradas"
      appDescription="Historial completo de facturas"
      icon={FileBarChart}
      color="from-indigo-600 to-indigo-700"
    />
  )
}
