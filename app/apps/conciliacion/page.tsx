'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { Scale } from 'lucide-react'

export default function ConciliacionPage() {
  return (
    <AppPlaceholder
      appName="Conciliación"
      appDescription="Conciliación bancaria automática"
      icon={Scale}
      color="from-teal-600 to-teal-700"
    />
  )
}
