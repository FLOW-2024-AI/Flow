-- Create application role for multi-tenant access (no BYPASSRLS)
-- Run as a superuser (postgres).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'flow_app_rw') THEN
    CREATE ROLE flow_app_rw LOGIN PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
  END IF;
END $$;

ALTER ROLE flow_app_rw SET row_security = on;

GRANT CONNECT ON DATABASE facturas_db TO flow_app_rw;
GRANT USAGE ON SCHEMA public TO flow_app_rw;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO flow_app_rw;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO flow_app_rw;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO flow_app_rw;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO flow_app_rw;
