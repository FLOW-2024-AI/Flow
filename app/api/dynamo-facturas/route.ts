import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { AuthError, requireTenantContext } from '@/lib/auth';

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Facturas-dev';
const REGION = process.env.AWS_REGION || 'us-east-1';

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true }
});

type DynamoInvoice = {
  clientId?: string;
  invoiceId?: string;
  numeroFactura?: string;
  fechaEmision?: string;
  emisorRUC?: string;
  emisorRazonSocial?: string;
  receptorRUC?: string;
  receptorRazonSocial?: string;
  total?: number;
  moneda?: string;
  validacionSunat?: {
    estado?: string;
    esValido?: boolean;
    motivo?: string;
    estadoSunat?: {
      estadoComprobante?: {
        codigo?: string;
        descripcion?: string;
      };
      estadoRuc?: {
        codigo?: string;
        descripcion?: string;
      };
      condicionDomicilio?: {
        codigo?: string;
        descripcion?: string;
      };
      observaciones?: string[];
    };
  };
  procesamiento?: {
    status?: string;
    motor?: string;
    ruta?: string;
  };
  audit?: {
    creadoEn?: string;
  };
  archivo?: {
    s3Bucket?: string;
    s3Key?: string;
    nombreArchivo?: string;
  };
  data?: {
    numeroFactura?: string;
    fechaEmision?: string;
    emisor?: {
      numeroDocumento?: string;
      razonSocial?: string;
    };
    receptor?: {
      numeroDocumento?: string;
      razonSocial?: string;
    };
    montos?: {
      total?: number;
      subtotal?: number;
      igv?: number;
      moneda?: string;
    };
  };
};

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const buildCursor = (lastKey: Record<string, unknown> | undefined) => {
  if (!lastKey) {
    return null;
  }
  return Buffer.from(JSON.stringify(lastKey)).toString('base64');
};

const parseCursor = (cursor: string | null) => {
  if (!cursor) {
    return undefined;
  }
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
  } catch {
    return undefined;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantContext(request);
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);
    const search = (searchParams.get('search') || '').trim();
    const cursor = parseCursor(searchParams.get('cursor'));

    const commandInput: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'clientId = :tenant',
      ExpressionAttributeValues: {
        ':tenant': tenantId
      },
      Limit: limit
    };

    if (cursor) {
      commandInput.ExclusiveStartKey = cursor;
    }

    if (search) {
      commandInput.FilterExpression = [
        'contains(invoiceId, :q)',
        'contains(numeroFactura, :q)',
        'contains(emisorRazonSocial, :q)'
      ].join(' OR ');
      commandInput.ExpressionAttributeValues[':q'] = search;
    }

    const result = await docClient.send(new QueryCommand(commandInput));
    const rawItems = (result.Items || []) as DynamoInvoice[];

    const items = rawItems
      .map((item) => {
        const data = item.data || {};
        const montos = data.montos || {};
        const estadoSunat = item.validacionSunat?.estadoSunat;
        const estadoRucCodigo = estadoSunat?.estadoRuc?.codigo || null;
        return {
          clientId: item.clientId || '',
          invoiceId: item.invoiceId || 'UNKNOWN-UNKNOWN',
          numeroFactura: item.numeroFactura || data.numeroFactura || 'UNKNOWN',
          fechaEmision: item.fechaEmision || data.fechaEmision || '',
          emisorRUC: item.emisorRUC || data.emisor?.numeroDocumento || '',
          emisorRazonSocial: item.emisorRazonSocial || data.emisor?.razonSocial || '',
          receptorRUC: item.receptorRUC || data.receptor?.numeroDocumento || '',
          receptorRazonSocial: item.receptorRazonSocial || data.receptor?.razonSocial || '',
          total: toNumber(item.total) ?? toNumber(montos.total),
          subtotal: toNumber(montos.subtotal),
          igv: toNumber(montos.igv),
          moneda: item.moneda || montos.moneda || 'PEN',
          sunatEstado: item.validacionSunat?.estado || 'NO_VALIDADO',
          sunatEsValido: item.validacionSunat?.esValido ?? null,
          sunatMotivo: item.validacionSunat?.motivo || '',
          sunatEstadoComprobanteDescripcion: estadoSunat?.estadoComprobante?.descripcion || '',
          sunatEstadoRucDescripcion: estadoSunat?.estadoRuc?.descripcion || '',
          sunatCondicionDomicilioDescripcion: estadoSunat?.condicionDomicilio?.descripcion || '',
          sunatObservaciones: estadoSunat?.observaciones || [],
          sunatRucActivo: estadoRucCodigo === '00',
          procesamientoStatus: item.procesamiento?.status || 'unknown',
          procesamientoMotor: item.procesamiento?.motor || 'unknown',
          procesamientoRuta: item.procesamiento?.ruta || null,
          creadoEn: item.audit?.creadoEn || '',
          s3Bucket: item.archivo?.s3Bucket || '',
          s3Key: item.archivo?.s3Key || '',
          archivoNombre: item.archivo?.nombreArchivo || ''
        };
      })
      .sort((a, b) => {
        const dateA = Date.parse(a.fechaEmision || a.creadoEn || '1970-01-01');
        const dateB = Date.parse(b.fechaEmision || b.creadoEn || '1970-01-01');
        return dateB - dateA;
      });

    return NextResponse.json({
      success: true,
      items,
      nextCursor: buildCursor(result.LastEvaluatedKey)
    });
  } catch (error) {
    console.error('Error fetching Dynamo invoices:', error);
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message, items: [] },
        { status: error.status }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        items: []
      },
      { status: 500 }
    );
  }
}
