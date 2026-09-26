"""
Phase 15 — Live PostgreSQL connection test.
Run from E:\Rox\LegalSaathi with:
  .venv\Scripts\python.exe scripts\test_ph15_connection.py
"""
import os, sys

# Load .env from project root
env_file = os.path.join(os.path.dirname(__file__), '..', '.env')
env_file = os.path.normpath(env_file)
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line and not line.startswith('`'):
                k, v = line.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip())

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("FAIL: psycopg2 not installed. Run: pip install psycopg2-binary")
    sys.exit(1)

url = os.environ.get('DATABASE_URL', '')
if not url or 'YOUR-PASSWORD' in url or 'YOUR-PROJECT' in url:
    print("FAIL: DATABASE_URL not set or contains placeholder")
    sys.exit(1)

print("=== PHASE 15 — LIVE CONNECTION TEST ===")
results = []

try:
    conn = psycopg2.connect(url, cursor_factory=RealDictCursor, connect_timeout=15)
    results.append(("T1 Basic connection", "PASS"))
except Exception as e:
    results.append(("T1 Basic connection", f"FAIL: {e}"))
    for r in results: print(f"  {r[1][:4]} | {r[0]}: {r[1]}")
    sys.exit(1)

cur = conn.cursor()

# T2: SELECT 1
try:
    cur.execute("SELECT 1 AS probe")
    assert cur.fetchone()['probe'] == 1
    results.append(("T2 SELECT 1", "PASS"))
except Exception as e:
    results.append(("T2 SELECT 1", f"FAIL: {e}"))

# T3: Server identity
try:
    cur.execute("SELECT version(), current_database(), current_user")
    row = cur.fetchone()
    db = row['current_database']
    user = row['current_user']
    print(f"  DB   : {db}")
    print(f"  User : {user}")
    print(f"  PG   : {row['version'][:70]}")
    results.append(("T3 Server identity", f"PASS — db={db}"))
except Exception as e:
    results.append(("T3 Server identity", f"FAIL: {e}"))

# T4: List public tables
try:
    cur.execute("""
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name
    """)
    tables = [r['table_name'] for r in cur.fetchall()]
    print(f"  Public tables ({len(tables)}): {', '.join(tables)}")
    results.append(("T4 Public schema", f"PASS — {len(tables)} tables"))
except Exception as e:
    results.append(("T4 Public schema", f"FAIL: {e}"))

# T5: Write + rollback
try:
    cur.execute("CREATE TEMP TABLE _ph15_probe (x int)")
    cur.execute("INSERT INTO _ph15_probe VALUES (42)")
    cur.execute("SELECT x FROM _ph15_probe")
    assert cur.fetchone()['x'] == 42
    conn.rollback()
    results.append(("T5 Write+rollback", "PASS"))
except Exception as e:
    conn.rollback()
    results.append(("T5 Write+rollback", f"FAIL: {e}"))

# T6: auth.users
try:
    cur.execute("SELECT COUNT(*) AS n FROM auth.users")
    n = cur.fetchone()['n']
    print(f"  auth.users: {n} rows")
    results.append(("T6 auth.users schema", f"PASS — {n} users"))
except Exception as e:
    results.append(("T6 auth.users schema", f"FAIL: {e}"))

# T7: storage.buckets
try:
    cur.execute("SELECT id, public FROM storage.buckets")
    buckets = cur.fetchall()
    blist = ', '.join(f"{b['id']}(public={b['public']})" for b in buckets)
    print(f"  storage.buckets: {blist or 'none'}")
    results.append(("T7 storage.buckets", f"PASS — {len(buckets)} buckets"))
except Exception as e:
    results.append(("T7 storage.buckets", f"FAIL: {e}"))

# T8: RLS check
try:
    cur.execute("""
        SELECT tablename, rowsecurity
        FROM pg_tables WHERE schemaname = 'public'
        ORDER BY tablename
    """)
    rls_rows = cur.fetchall()
    rls_on = [r['tablename'] for r in rls_rows if r['rowsecurity']]
    rls_off = [r['tablename'] for r in rls_rows if not r['rowsecurity']]
    print(f"  RLS ON : {', '.join(rls_on) or 'none'}")
    print(f"  RLS OFF: {', '.join(rls_off) or 'none'}")
    results.append(("T8 RLS status check", f"PASS — {len(rls_on)} tables with RLS"))
except Exception as e:
    results.append(("T8 RLS status check", f"FAIL: {e}"))

conn.close()

print("\n--- RESULTS ---")
passed = failed = 0
for name, status in results:
    icon = "PASS" if status.startswith("PASS") else "FAIL"
    print(f"  [{icon}] {name}: {status}")
    if status.startswith("PASS"): passed += 1
    else: failed += 1

print(f"\n  {passed} passed, {failed} failed")
sys.exit(0 if failed == 0 else 1)
