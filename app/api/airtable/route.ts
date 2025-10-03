import { NextRequest, NextResponse } from 'next/server';

// Configuración de Airtable
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Facturas';

export async function GET(request: NextRequest) {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { 
          error: 'Configuración de Airtable incompleta',
          message: 'Verifica que AIRTABLE_API_KEY y AIRTABLE_BASE_ID estén configurados'
        },
        { status: 400 }
      );
    }

    // Construir URL de la API de Airtable
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    // Parámetros de consulta opcionales
    const { searchParams } = new URL(request.url);
    const maxRecords = searchParams.get('maxRecords') || '100';
    const sort = searchParams.get('sort') || 'Created';
    const view = searchParams.get('view');

    // Construir parámetros de la consulta
    const params = new URLSearchParams({
      maxRecords,
      sort: `[{field: "${sort}", direction: "desc"}]`
    });

    if (view) {
      params.append('view', view);
    }

    // Realizar solicitud a Airtable
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error de Airtable: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Procesar y formatear los datos
    const facturas = data.records.map((record: any) => ({
      id: record.id,
      fecha: record.fields.Fecha || record.fields.fecha || record.createdTime,
      proveedor: record.fields.Proveedor || record.fields.proveedor || 'Sin especificar',
      monto: record.fields.Monto || record.fields.monto || 0,
      estado: record.fields.Estado || record.fields.estado || 'Pendiente',
      descripcion: record.fields.Descripcion || record.fields.descripcion || '',
      numeroFactura: record.fields['Numero Factura'] || record.fields.numero_factura || '',
      createdTime: record.createdTime,
      ...record.fields // Incluir todos los campos adicionales
    }));

    // Calcular estadísticas
    const stats = {
      total: facturas.length,
      montoTotal: facturas.reduce((sum: number, factura: any) => sum + (parseFloat(factura.monto) || 0), 0),
      procesadas: facturas.filter((f: any) => f.estado?.toLowerCase().includes('procesada')).length,
      pendientes: facturas.filter((f: any) => f.estado?.toLowerCase().includes('pendiente')).length,
      hoy: facturas.filter((f: any) => {
        const fecha = new Date(f.fecha);
        const hoy = new Date();
        return fecha.toDateString() === hoy.toDateString();
      }).length
    };

    return NextResponse.json({
      success: true,
      data: facturas,
      stats,
      count: facturas.length
    });

  } catch (error) {
    console.error('Error al obtener datos de Airtable:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al conectar con Airtable',
        message: error instanceof Error ? error.message : 'Error desconocido',
        // En desarrollo, mostrar más detalles del error
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    );
  }
}

// Endpoint para crear nuevas facturas (opcional)
export async function POST(request: NextRequest) {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: 'Configuración de Airtable incompleta' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: body
      })
    });

    if (!response.ok) {
      throw new Error(`Error de Airtable: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Factura creada exitosamente'
    });

  } catch (error) {
    console.error('Error al crear factura en Airtable:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al crear factura',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
