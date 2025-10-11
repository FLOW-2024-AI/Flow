'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { AlertTriangle } from 'lucide-react'

export default function GestionRiesgosPage() {
  return (
    <AppPlaceholder
      appName="Gestión de Riesgos"
      appDescription="Identificación y mitigación de riesgos"
      icon={AlertTriangle}
      color="from-orange-500 to-orange-600"
    />
  )
}
