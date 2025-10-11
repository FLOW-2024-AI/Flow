'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { Heart } from 'lucide-react'

export default function SaludFinancieraPage() {
  return (
    <AppPlaceholder
      appName="Salud Financiera"
      appDescription="Diagnóstico y métricas financieras"
      icon={Heart}
      color="from-red-500 to-red-600"
    />
  )
}
