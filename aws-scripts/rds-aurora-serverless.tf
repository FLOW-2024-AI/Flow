# ========================================
# RDS Aurora Serverless v2 PostgreSQL - POC MÍNIMA
# Sin Secrets Manager, sin Security Groups personalizados
# ========================================

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ========================================
# Variables
# ========================================

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "poc"
}

variable "cluster_identifier" {
  description = "RDS Cluster identifier"
  type        = string
  default     = "aurora-facturas-poc"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "facturas_db"
}

variable "db_master_username" {
  description = "Master username for database"
  type        = string
  default     = "postgres"
}

variable "db_master_password" {
  description = "Master password for database"
  type        = string
  default     = "ChangeMe123456"  # CAMBIAR en producción
  sensitive   = true
}

# ========================================
# Data Sources
# ========================================

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_security_group" "default" {
  vpc_id = data.aws_vpc.default.id
  name   = "default"
}

# ========================================
# DB Subnet Group
# ========================================

resource "aws_db_subnet_group" "aurora" {
  name_prefix = "aurora-facturas-${var.environment}-"
  description = "Subnet group for Aurora Serverless PostgreSQL - POC"
  subnet_ids  = data.aws_subnets.default.ids

  tags = {
    Name        = "aurora-facturas-${var.environment}"
    Environment = var.environment
  }
}

# ========================================
# RDS Aurora Serverless v2 Cluster - PÚBLICO
# ========================================

resource "aws_rds_cluster" "aurora_postgres" {
  cluster_identifier     = var.cluster_identifier
  engine                 = "aurora-postgresql"
  engine_mode            = "provisioned"  # Serverless v2 usa "provisioned"
  engine_version         = "15.4"         # PostgreSQL 15
  database_name          = var.db_name
  master_username        = var.db_master_username
  master_password        = var.db_master_password
  db_subnet_group_name   = aws_db_subnet_group.aurora.name
  vpc_security_group_ids = [data.aws_security_group.default.id]

  # Serverless v2 scaling - MÍNIMO para POC
  serverlessv2_scaling_configuration {
    min_capacity = 0.5  # Mínimo posible
    max_capacity = 1.0  # Máximo bajo para POC
  }

  # Backup mínimo para POC
  backup_retention_period = 1
  preferred_backup_window = "03:00-04:00"

  # NO encryption para simplicidad en POC (habilitar en prod)
  storage_encrypted = false

  # Skip final snapshot - es solo POC
  skip_final_snapshot = true

  # Aplicar cambios inmediatamente
  apply_immediately = true

  tags = {
    Name        = "aurora-facturas-${var.environment}"
    Environment = var.environment
  }
}

# ========================================
# RDS Aurora Serverless v2 Instance
# ========================================

resource "aws_rds_cluster_instance" "aurora_instance" {
  identifier           = "${var.cluster_identifier}-instance"
  cluster_identifier   = aws_rds_cluster.aurora_postgres.id
  instance_class       = "db.serverless"
  engine               = aws_rds_cluster.aurora_postgres.engine
  engine_version       = aws_rds_cluster.aurora_postgres.engine_version
  publicly_accessible  = true

  tags = {
    Name        = "aurora-facturas-${var.environment}-instance"
    Environment = var.environment
  }
}

# ========================================
# Outputs
# ========================================

output "rds_cluster_endpoint" {
  description = "RDS Aurora cluster endpoint"
  value       = aws_rds_cluster.aurora_postgres.endpoint
}

output "rds_cluster_port" {
  description = "RDS Aurora cluster port"
  value       = aws_rds_cluster.aurora_postgres.port
}

output "database_name" {
  description = "Database name"
  value       = var.db_name
}

output "database_username" {
  description = "Database username"
  value       = var.db_master_username
}

output "database_password" {
  description = "Database password"
  value       = var.db_master_password
  sensitive   = true
}

output "connection_command" {
  description = "Command to connect to the database"
  value       = "psql -h ${aws_rds_cluster.aurora_postgres.endpoint} -U ${var.db_master_username} -d ${var.db_name}"
}

output "connection_string" {
  description = "Full connection string"
  value       = "postgresql://${var.db_master_username}:${var.db_master_password}@${aws_rds_cluster.aurora_postgres.endpoint}:${aws_rds_cluster.aurora_postgres.port}/${var.db_name}"
  sensitive   = true
}
