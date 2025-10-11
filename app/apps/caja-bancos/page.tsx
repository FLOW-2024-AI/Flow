'use client'

import AppPlaceholder from '@/components/AppPlaceholder'
import { Wallet } from 'lucide-react'

export default function CajaBancosPage() {
  return (
    <AppPlaceholder
      appName="Caja y Bancos"
      appDescription="Control de efectivo y cuentas bancarias"
      icon={Wallet}
      color="from-emerald-600 to-emerald-700"
    />
  )
}
