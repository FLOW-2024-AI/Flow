import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireTenantContext } from '@/lib/auth';
import { withTenantClient } from '@/lib/db';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantContext(request);
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortField = searchParams.get('sortField') || 'fecha_emision';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    const offset = (page - 1) * limit;

    // Construir filtros
    const filters: string[] = [];
    const filterValues: any[] = [];
    let paramIndex = 1;

    // Búsqueda general
    if (search) {
      filters.push(`(
        numero_factura ILIKE $${paramIndex} OR
        ruc_emisor ILIKE $${paramIndex} OR
        razon_social ILIKE $${paramIndex} OR
        proveedor ILIKE $${paramIndex} OR
        descripcion ILIKE $${paramIndex}
      )`);
      filterValues.push(`%${search}%`);
      paramIndex++;
    }

    // Filtros específicos por campo
    for (const [key, value] of Array.from(searchParams.entries())) {
      if (key.startsWith('filter_') && value) {
        const field = key.replace('filter_', '');
        filters.push(`${field} ILIKE $${paramIndex}`);
        filterValues.push(`%${value}%`);
        paramIndex++;
      }
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    // Query para obtener facturas con paginación
    const query = `
      SELECT
        id,
        numero_factura,
        ruc_emisor,
        razon_social,
        direccion_emisor,
        fecha_emision,
        proveedor,
        codigo_producto,
        descripcion,
        cantidad,
        precio_unitario,
        valor_venta,
        igv,
        importe_total,
        archivo_url,
        created_at
      FROM facturas
      ${whereClause}
      ORDER BY ${sortField} ${sortDirection.toUpperCase()}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const result = await withTenantClient(tenantId, async (client) =>
      client.query(query, [...filterValues, limit, offset])
    );

    // Query para contar total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM facturas
      ${whereClause}
    `;

    const countResult = await withTenantClient(tenantId, async (client) =>
      client.query(countQuery, filterValues)
    );
    const total = parseInt(countResult.rows[0]?.total || '0');

    // Calcular estadísticas
    const statsQuery = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN fecha_emision::date = CURRENT_DATE THEN 1 END) as hoy,
        COUNT(CASE WHEN fecha_emision >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as semana,
        COUNT(CASE WHEN fecha_emision >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as mes,
        COALESCE(SUM(importe_total), 0) as monto_total
      FROM facturas
      ${whereClause}
    `;

    const statsResult = await withTenantClient(tenantId, async (client) =>
      client.query(statsQuery, filterValues)
    );
    const stats = {
      total: parseInt(statsResult.rows[0]?.total || '0'),
      hoy: parseInt(statsResult.rows[0]?.hoy || '0'),
      semana: parseInt(statsResult.rows[0]?.semana || '0'),
      mes: parseInt(statsResult.rows[0]?.mes || '0'),
      montoTotal: parseFloat(statsResult.rows[0]?.monto_total || '0')
    };

    return NextResponse.json({
      success: true,
      facturas: result.rows,
      stats: stats
    });

  } catch (error) {
    console.error('Error fetching facturas:', error);
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message,
        facturas: [],
        stats: { total: 0, hoy: 0, semana: 0, mes: 0, montoTotal: 0 }
      }, { status: error.status });
    }
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      facturas: [],
      stats: { total: 0, hoy: 0, semana: 0, mes: 0, montoTotal: 0 }
    }, { status: 500 });
  }
}

// Endpoint para crear nuevas facturas
export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantContext(request);
    const body = await request.json();

    const query = `
      INSERT INTO facturas (
        tenant_id,
        client_id,
        numero_factura,
        ruc_emisor,
        razon_social,
        direccion_emisor,
        fecha_emision,
        proveedor,
        codigo_producto,
        descripcion,
        cantidad,
        precio_unitario,
        valor_venta,
        igv,
        importe_total,
        archivo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      tenantId,
      tenantId,
      body.numero_factura,
      body.ruc_emisor,
      body.razon_social,
      body.direccion_emisor,
      body.fecha_emision,
      body.proveedor,
      body.codigo_producto,
      body.descripcion,
      body.cantidad,
      body.precio_unitario,
      body.valor_venta,
      body.igv,
      body.importe_total,
      body.archivo_url
    ];

    const result = await withTenantClient(tenantId, async (client) => client.query(query, values));

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Factura creada exitosamente'
    });

  } catch (error) {
    console.error('Error creating factura:', error);
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.status });
    }
    return NextResponse.json({
      success: false,
      error: 'Error al crear factura',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
