# ========================================
# SQS Queues para manejo de errores y reintentos
# Se usa el mismo provider y variables de rds-aurora-serverless.tf
# ========================================

#
# Dead Letter Queue (DLQ)
# Para facturas que fallaron después de todos los reintentos
# ========================================

resource "aws_sqs_queue" "invoice_dlq" {
  name                      = "invoice-processing-dlq-${var.environment}"
  message_retention_seconds = 1209600  # 14 días

  tags = {
    Name        = "invoice-processing-dlq-${var.environment}"
    Environment = var.environment
    Purpose     = "Dead Letter Queue for failed invoices"
  }
}

# ========================================
# Main Queue con retry automático
# ========================================

resource "aws_sqs_queue" "invoice_retry" {
  name                       = "invoice-processing-retry-${var.environment}"
  delay_seconds              = 0
  max_message_size           = 262144  # 256 KB
  message_retention_seconds  = 345600  # 4 días
  receive_wait_time_seconds  = 10      # Long polling
  visibility_timeout_seconds = 300     # 5 minutos (tiempo de procesamiento Lambda)

  # Configuración de reintento
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.invoice_dlq.arn
    maxReceiveCount     = 3  # Reintentar 3 veces antes de ir a DLQ
  })

  tags = {
    Name        = "invoice-processing-retry-${var.environment}"
    Environment = var.environment
    Purpose     = "Retry queue for invoice processing"
  }
}

# ========================================
# Política para permitir S3 enviar mensajes a SQS
# ========================================

resource "aws_sqs_queue_policy" "invoice_retry_policy" {
  queue_url = aws_sqs_queue.invoice_retry.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowS3SendMessage"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "SQS:SendMessage"
        Resource = aws_sqs_queue.invoice_retry.arn
      },
      {
        Sid    = "AllowLambdaReceiveMessage"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = [
          "SQS:ReceiveMessage",
          "SQS:DeleteMessage",
          "SQS:GetQueueAttributes",
          "SQS:ChangeMessageVisibility"
        ]
        Resource = aws_sqs_queue.invoice_retry.arn
      }
    ]
  })
}

# ========================================
# CloudWatch Alarm - Monitorear DLQ
# ========================================

resource "aws_cloudwatch_metric_alarm" "dlq_messages" {
  alarm_name          = "invoice-dlq-has-messages-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300  # 5 minutos
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Alert when invoices fail to process after all retries"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.invoice_dlq.name
  }

  tags = {
    Environment = var.environment
  }
}

# ========================================
# Outputs
# ========================================

output "retry_queue_url" {
  description = "URL de la cola de reintentos"
  value       = aws_sqs_queue.invoice_retry.url
}

output "retry_queue_arn" {
  description = "ARN de la cola de reintentos"
  value       = aws_sqs_queue.invoice_retry.arn
}

output "dlq_url" {
  description = "URL de la Dead Letter Queue"
  value       = aws_sqs_queue.invoice_dlq.url
}

output "dlq_arn" {
  description = "ARN de la Dead Letter Queue"
  value       = aws_sqs_queue.invoice_dlq.arn
}

output "next_steps" {
  description = "Próximos pasos de configuración"
  value = <<-EOT
    ✅ Colas SQS creadas exitosamente!

    📋 Próximos pasos:

    1. Configurar S3 Event Notification:
       - Bucket: facturas-dev
       - Event: s3:ObjectCreated:*
       - Destination: SQS → ${aws_sqs_queue.invoice_retry.arn}

    2. Configurar Lambda trigger desde SQS:
       - Lambda: InvoiceProcessor-bedrock-dev
       - Event source: SQS
       - Queue: ${aws_sqs_queue.invoice_retry.arn}
       - Batch size: 1 (procesar de uno en uno para evitar throttling)

    3. Agregar exponential backoff en Lambda para manejar ThrottlingException

    4. Monitorear DLQ en CloudWatch para facturas que fallen definitivamente
  EOT
}
