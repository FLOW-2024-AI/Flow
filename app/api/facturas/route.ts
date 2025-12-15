import { NextRequest, NextResponse } from 'next/server';
import { proxyFacturasRequest } from '@/lib/facturasProxy';

const proxyPath = '/facturas';
const serviceError = 'No se pudo conectar con el servicio de facturas.';

export async function GET(request: NextRequest) {
  try {
    return await proxyFacturasRequest(request, proxyPath);
  } catch (error) {
    console.error('Error proxying GET /facturas:', error);
    return NextResponse.json({ success: false, error: serviceError }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await proxyFacturasRequest(request, proxyPath);
  } catch (error) {
    console.error('Error proxying POST /facturas:', error);
    return NextResponse.json({ success: false, error: serviceError }, { status: 502 });
  }
}
