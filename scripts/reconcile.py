"""Quick reconciliation — compares SQLite source vs PostgreSQL destination row counts."""
import os, sys, sqlite3, psycopg2
from psycopg2.extras import RealDictCursor

with open(os.path.join(os.path.dirname(__file__), '..', '.env')) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line and not line.startswith('`'):
            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip())

pg = psycopg2.connect(os.environ['DATABASE_URL'], cursor_factory=RealDictCursor, connect_timeout=10)
sq = sqlite3.connect(os.path.join(os.path.dirname(__file__), '..', 'legal_saathi.db'))
pc = pg.cursor()

tables = ['subscription_plans','clusters','sessions','cases','incidents','drafts',
          'audit_events','user_subscriptions','payment_orders','invoices',
          'collective_pool_contributions']

print("TABLE                                    SQLite    PG   Status")
print("-" * 65)
total_s = total_p = 0
all_ok = True
for t in tables:
    s = sq.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
    pc.execute(f"SELECT COUNT(*) AS n FROM {t}")
    p = pc.fetchone()['n']
    ok = p >= s
    if not ok: all_ok = False
    print(f"  {t:<40} {s:>4}  {p:>5}   {'OK' if ok else 'LOW'}")
    total_s += s
    total_p += p

print()
print(f"  TOTAL                                    {total_s:>4}  {total_p:>5}")
print(f"  RESULT: {'MIGRATION COMPLETE' if all_ok else 'MIGRATION IN PROGRESS OR INCOMPLETE'}")
sq_sessions = sq.execute("SELECT COUNT(*) FROM sessions").fetchone()[0]
print(f"  Orphan stubs (sessions): 6 expected in PG on top of {sq_sessions} source rows = {sq_sessions+6} expected")

pg.close(); sq.close()
sys.exit(0 if all_ok else 1)
