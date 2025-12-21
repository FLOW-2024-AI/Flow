import { NextResponse } from 'next/server'

const sampleFacturas = [
  {
    id: 'TEMP-2025-001',
    proveedor: 'Distribuidora Los Andes SAC',
    ruc: '20543210987',
    fecha: '2025-10-19',
    monto: 4500,
    impuesto: 810,
    total: 5310,
    estado: 'Pendiente',
    origen: 'Email'
  },
  {
    id: 'TEMP-2025-002',
    proveedor: 'Servicios Técnicos Premium',
    ruc: '20678901234',
    fecha: '2025-10-18',
    monto: 2300,
    impuesto: 414,
    total: 2714,
    estado: 'Pendiente',
    origen: 'SUNAT'
  },
  {
    id: 'TEMP-2025-003',
    proveedor: 'Consultora Business Pro SAC',
    ruc: '20123987456',
    fecha: '2025-10-18',
    monto: 8900,
    impuesto: 1602,
    total: 10502,
    estado: 'Aprobada',
    origen: 'Email'
  }
]

export async function GET() {
  const pendientes = sampleFacturas.filter(f => f.estado === 'Pendiente')
  const aprobadas = sampleFacturas.filter(f => f.estado === 'Aprobada')

  const stats = {
    facturasTotales: sampleFacturas.length,
    montoTotal: sampleFacturas.reduce((acc, f) => acc + f.total, 0),
    pendientes: pendientes.length,
    aprobadas: aprobadas.length
  }

  return NextResponse.json({
    pendientes,
    aprobadas,
    stats
  })
}
