"""
Legal Saathi - Master Migration Runner
Applies all Supabase PostgreSQL migrations in order, then runs the data migration.
Run from E:\Rox\LegalSaathi:
  .venv\Scripts\python.exe scripts\run_migrations.py
"""
import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

# Load .env
env_file = os.path.join(os.path.dirname(__file__), '..', '.env')
env_file = os.path.normpath(env_file)
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line and not line.startswith('`'):
                k, v = line.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip())

url = os.environ.get('DATABASE_URL', '')
if not url or 'YOUR-PASSWORD' in url:
    print("ERROR: DATABASE_URL not set")
    sys.exit(1)

migrations_dir = os.path.join(os.path.dirname(__file__), '..', 'supabase', 'migrations')
migrations_dir = os.path.normpath(migrations_dir)

migration_files = sorted([
    f for f in os.listdir(migrations_dir)
    if f.endswith('.sql')
])

print("=" * 60)
print("LEGAL SAATHI — POSTGRESQL SCHEMA MIGRATIONS")
print("=" * 60)
print(f"Found {len(migration_files)} migration files")

conn = psycopg2.connect(url, cursor_factory=RealDictCursor, connect_timeout=15)
conn.autocommit = False
cur = conn.cursor()

# Create migration tracking table if not exists
cur.execute("""
    CREATE TABLE IF NOT EXISTS _migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT NOW(),
        success BOOLEAN DEFAULT TRUE
    )
""")
conn.commit()

for mf in migration_files:
    # Check if already applied
    cur.execute("SELECT filename FROM _migrations WHERE filename = %s AND success = TRUE", (mf,))
    if cur.fetchone():
        print(f"  SKIP  {mf} (already applied)")
        continue

    filepath = os.path.join(migrations_dir, mf)
    with open(filepath, encoding='utf-8') as f:
        sql = f.read()

    print(f"  APPLY {mf} ...", end='', flush=True)
    try:
        cur.execute(sql)
        cur.execute(
            "INSERT INTO _migrations (filename, success) VALUES (%s, TRUE) ON CONFLICT (filename) DO UPDATE SET success = TRUE, applied_at = NOW()",
            (mf,)
        )
        conn.commit()
        print(" OK")
    except Exception as e:
        conn.rollback()
        err_msg = str(e).replace('\n', ' ')[:200]
        print(f" FAIL: {err_msg}")
        # If it's a "already exists" error, mark as applied and continue
        if 'already exists' in err_msg.lower():
            cur.execute(
                "INSERT INTO _migrations (filename, success) VALUES (%s, TRUE) ON CONFLICT (filename) DO UPDATE SET success = TRUE, applied_at = NOW()",
                (mf,)
            )
            conn.commit()
            print(f"         (object already existed — treating as applied)")
        else:
            print(f"  FATAL: Migration {mf} failed. Stopping.")
            conn.close()
            sys.exit(1)

# Verify final state
print("\n--- POST-MIGRATION VERIFICATION ---")
cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name NOT LIKE '\\_%'
    ORDER BY table_name
""")
tables = [r['table_name'] for r in cur.fetchall()]
print(f"Public tables ({len(tables)}): {', '.join(tables)}")

cur.execute("SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
rls_rows = cur.fetchall()
rls_on = [r['tablename'] for r in rls_rows if r['rowsecurity'] and not r['tablename'].startswith('_')]
print(f"RLS enabled on: {', '.join(rls_on) or 'none'}")

cur.execute("SELECT id, public FROM storage.buckets ORDER BY id")
buckets = cur.fetchall()
print(f"Storage buckets: {', '.join(b['id'] for b in buckets) or 'none'}")

conn.close()
print("\n=== ALL MIGRATIONS COMPLETE ===")
sys.exit(0)
