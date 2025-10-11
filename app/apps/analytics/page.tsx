'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <AppPlaceholder
      appName="Analytics"
      appDescription="Análisis y métricas financieras avanzadas"
      icon={BarChart3}
      color="from-purple-500 to-purple-600"
    />
  )
}
