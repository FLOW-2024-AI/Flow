'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { FileBarChart } from 'lucide-react'

export default function ReportesPage() {
  return (
    <AppPlaceholder
      appName="Reportes"
      appDescription="Informes financieros y análisis"
      icon={FileBarChart}
      color="from-pink-600 to-pink-700"
    />
  )
}
