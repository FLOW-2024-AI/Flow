'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { Lightbulb } from 'lucide-react'

export default function PrediccionesPage() {
  return (
    <AppPlaceholder
      appName="Predicciones"
      appDescription="Análisis predictivo con IA"
      icon={Lightbulb}
      color="from-yellow-500 to-yellow-600"
    />
  )
}
