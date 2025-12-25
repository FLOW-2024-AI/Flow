-- Script SQL para dar permisos BYPASSRLS al usuario flow_app_rw
-- Ejecutar como superuser (postgres)

-- Dar permiso para bypassear RLS
ALTER USER flow_app_rw WITH BYPASSRLS;

-- Verificar
SELECT rolname, rolbypassrls FROM pg_roles WHERE rolname = 'flow_app_rw';
