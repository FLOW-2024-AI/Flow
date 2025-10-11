'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { Landmark } from 'lucide-react'

export default function BancarioPage() {
  return (
    <AppPlaceholder
      appName="Bancario"
      appDescription="Productos y servicios bancarios"
      icon={Landmark}
      color="from-slate-600 to-slate-700"
    />
  )
}
