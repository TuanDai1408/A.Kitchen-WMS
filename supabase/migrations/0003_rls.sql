-- ====================================================================
-- SUPABASE MIGRATION 0003: Row Level Security & Permissions
-- Target: Deny all access from public/anon/authenticated roles.
-- Worker connects via service_role or direct postgres user (bypasses RLS).
-- ====================================================================

-- 1. Revoke privileges from anon and authenticated on schema wms
REVOKE ALL ON SCHEMA wms FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA wms FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA wms FROM anon, authenticated;
REVOKE ALL ON ALL ROUTINES IN SCHEMA wms FROM anon, authenticated;

-- 2. Grant full privileges to postgres and service_role
GRANT USAGE, CREATE ON SCHEMA wms TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA wms TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA wms TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA wms TO postgres, service_role;

-- 3. Set default privileges for future objects in schema wms
ALTER DEFAULT PRIVILEGES IN SCHEMA wms REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA wms REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA wms REVOKE ALL ON ROUTINES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA wms GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA wms GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA wms GRANT ALL ON ROUTINES TO postgres, service_role;

-- 4. Enable Row Level Security (RLS) on all tables in schema wms
-- With RLS enabled and NO policies created for anon/authenticated,
-- any accidental direct API call to Supabase REST by anon/authenticated is denied.
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'wms'
    LOOP
        EXECUTE format('ALTER TABLE wms.%I ENABLE ROW LEVEL SECURITY;', tbl);
    END LOOP;
END;
$$;
