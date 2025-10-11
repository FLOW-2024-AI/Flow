'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { FileText } from 'lucide-react'

export default function FacturacionPage() {
  return (
    <AppPlaceholder
      appName="Facturación"
      appDescription="Gestión completa de facturas electrónicas"
      icon={FileText}
      color="from-blue-600 to-blue-700"
    />
  )
}
