import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AuthError, requireTenantContext } from '@/lib/auth';
import { fetchDynamoInvoiceById } from '@/lib/dynamo-facturas';

const REGION = process.env.AWS_REGION || 'us-east-1';

const s3Client = new S3Client({ region: REGION });

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantContext(request);
    const searchParams = request.nextUrl.searchParams;
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: 'Falta invoiceId' },
        { status: 400 }
      );
    }

    const item: any = await fetchDynamoInvoiceById(tenantId, invoiceId);
    const archivo = item?.archivo || {};
    const bucket = archivo.s3Bucket;
    const key = archivo.s3Key;

    if (!bucket || !key) {
      return NextResponse.json(
        { success: false, error: 'Archivo no disponible para esta factura' },
        { status: 404 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: 'inline'
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return NextResponse.json({
      success: true,
      url,
      filename: archivo.nombreArchivo || key.split('/').pop() || invoiceId
    });
  } catch (error) {
    console.error('Error generating preview URL:', error);
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
