#!/usr/bin/env python3
"""
Setup Database Schema for Aurora PostgreSQL
Ejecuta el script db-schema.sql en la base de datos
"""

import psycopg2
import sys

# Credenciales (desde terraform output)
DB_HOST = "aurora-facturas-poc.cluster-conucscyi4yb.us-east-1.rds.amazonaws.com"
DB_PORT = 5432
DB_NAME = "facturas_db"
DB_USER = "postgres"
DB_PASSWORD = "ChangeMe123456"

def main():
    try:
        print(f"📡 Conectando a PostgreSQL en {DB_HOST}...")

        # Conectar a PostgreSQL
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=30
        )

        print("✅ Conexión exitosa!")

        # Leer el archivo SQL
        print("📄 Leyendo db-schema.sql...")
        with open('db-schema.sql', 'r') as f:
            sql_script = f.read()

        # Ejecutar el script
        print("🔧 Ejecutando schema...")
        cursor = conn.cursor()
        cursor.execute(sql_script)
        conn.commit()

        print("✅ Schema creado exitosamente!")

        # Verificar tablas creadas
        print("\n📊 Tablas creadas:")
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """)

        tables = cursor.fetchall()
        for table in tables:
            print(f"  • {table[0]}")

        # Verificar vistas
        print("\n👁️  Vistas creadas:")
        cursor.execute("""
            SELECT table_name
            FROM information_schema.views
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)

        views = cursor.fetchall()
        for view in views:
            print(f"  • {view[0]}")

        cursor.close()
        conn.close()

        print("\n🎉 Base de datos lista para usar!")
        print(f"\n🔗 Connection string:")
        print(f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

    except psycopg2.OperationalError as e:
        print(f"❌ Error de conexión: {e}")
        print("\n💡 Posibles causas:")
        print("  1. La base de datos aún está iniciando (espera 1-2 minutos)")
        print("  2. El security group no permite conexiones desde tu IP")
        print("  3. Las credenciales son incorrectas")
        sys.exit(1)

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
