import { NextRequest, NextResponse } from 'next/server';
import { proxyFacturasRequest } from '@/lib/facturasProxy';

const proxyPath = '/factura-detalle';
const serviceError = 'No se pudo conectar con el servicio de facturas.';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      success: false,
      error: 'ID de factura requerido'
    }, { status: 400 });
  }

  try {
    return await proxyFacturasRequest(request, proxyPath);
  } catch (error) {
    console.error('Error proxying GET /factura-detalle:', error);
    return NextResponse.json({ success: false, error: serviceError }, { status: 502 });
  }
}
