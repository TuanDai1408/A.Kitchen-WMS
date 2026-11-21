import re

with open('supabase/migrations/0001_schema.sql', encoding='utf-8') as f:
    sql = f.read()

# Replace schema
staging_sql = sql.replace('CREATE SCHEMA IF NOT EXISTS wms;', 'CREATE SCHEMA IF NOT EXISTS wms_staging;')
staging_sql = staging_sql.replace('wms.', 'wms_staging.')

with open('supabase/migrations/0001_staging_schema.sql', 'w', encoding='utf-8') as f:
    f.write(staging_sql)

print("Generated supabase/migrations/0001_staging_schema.sql")
