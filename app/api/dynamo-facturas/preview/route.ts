import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AuthError, requireTenantContext } from '@/lib/auth';

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Facturas-dev';
const REGION = process.env.AWS_REGION || 'us-east-1';

const dynamoClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true }
});
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

    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { clientId: tenantId, invoiceId }
      })
    );

    const item: any = result.Item;
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
