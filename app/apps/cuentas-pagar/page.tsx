'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { Receipt } from 'lucide-react'

export default function CuentasPagarPage() {
  return (
    <AppPlaceholder
      appName="Cuentas por Pagar"
      appDescription="Gestión de pagos a proveedores"
      icon={Receipt}
      color="from-orange-600 to-orange-700"
    />
  )
}
