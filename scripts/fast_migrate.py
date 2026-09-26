"""
Fast Batch Migration using psycopg2.extras.execute_values.
Sends all rows of each table in a single network round-trip.
"""
import os, sys, json, sqlite3, hashlib, shutil
from datetime import datetime, timezone
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values

# Load .env
env_file = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '.env'))
with open(env_file) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line and not line.startswith('`'):
            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip())

PG_URL = os.environ['DATABASE_URL']
SQLITE_PATH = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'legal_saathi.db'))
NOW = datetime.now(timezone.utc).isoformat()

# Verify and backup SQLite
size = os.path.getsize(SQLITE_PATH)
with open(SQLITE_PATH, 'rb') as f:
    md5 = hashlib.md5(f.read()).hexdigest()
print(f"SOURCE: {SQLITE_PATH} size={size:,} md5={md5}", flush=True)

backup = SQLITE_PATH + f'.backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
if not os.path.exists(backup):
    shutil.copy2(SQLITE_PATH, backup)
    print(f"BACKUP: {backup}", flush=True)

sq = sqlite3.connect(SQLITE_PATH)
sq.row_factory = sqlite3.Row
pg = psycopg2.connect(PG_URL, cursor_factory=RealDictCursor, connect_timeout=15)
pc = pg.cursor()

def j(v, default='{}'):
    if v is None: return default
    if isinstance(v, (dict, list)): return json.dumps(v)
    try: json.loads(v); return v
    except: return json.dumps(v)

results = {}

def migrate_table(name, query_template, row_mapper, source_query):
    rows = sq.execute(source_query).fetchall()
    mapped = [row_mapper(r) for r in rows]
    results[name] = {'source': len(rows), 'migrated': 0, 'errors': 0}
    if mapped:
        try:
            execute_values(pc, query_template, mapped)
            pg.commit()
            results[name]['migrated'] = len(mapped)
            print(f"  OK {name}: {len(mapped)}/{len(rows)} migrated", flush=True)
            return True
        except Exception as e:
            pg.rollback()
            results[name]['errors'] = 1
            print(f"  ERR {name}: {e}", flush=True)
            return False
    else:
        print(f"  SKIP {name}: 0 rows", flush=True)
        return True

print("=== FAST MIGRATION START ===", flush=True)

# 1. subscription_plans
migrate_table('subscription_plans',
    """INSERT INTO subscription_plans (plan_id,name,tier,amount_inr,billing_period,features_json,is_active,created_at)
       VALUES %s
       ON CONFLICT (plan_id) DO UPDATE SET name=EXCLUDED.name, tier=EXCLUDED.tier,
       amount_inr=EXCLUDED.amount_inr, billing_period=EXCLUDED.billing_period,
       features_json=EXCLUDED.features_json, is_active=EXCLUDED.is_active""",
    lambda r: (r['plan_id'],r['name'],r['tier'],r['amount_inr'],r['billing_period'],
               j(r['features_json'],'[]'),int(r['is_active'] or 0),r['created_at'] or NOW),
    "SELECT * FROM subscription_plans")

# 2. clusters
migrate_table('clusters',
    """INSERT INTO clusters (cluster_id,issue_type,locality_bucket,explanation_text,member_count,incident_ids_json,created_at,status)
       VALUES %s
       ON CONFLICT (cluster_id) DO UPDATE SET member_count=EXCLUDED.member_count,
       incident_ids_json=EXCLUDED.incident_ids_json, status=EXCLUDED.status""",
    lambda r: (r['cluster_id'],r['issue_type'],r['locality_bucket'],r['explanation_text'],
               r['member_count'],j(r['incident_ids_json'],'[]'),r['created_at'] or NOW,r['status'] or 'active'),
    "SELECT * FROM clusters")

# 3. sessions (real + 6 orphan stubs)
real_rows = sq.execute("SELECT * FROM sessions").fetchall()
orphan_ids = [r['session_id'] for r in sq.execute("""
    SELECT DISTINCT c.session_id FROM cases c
    LEFT JOIN sessions s ON c.session_id=s.session_id
    WHERE s.session_id IS NULL AND c.session_id IS NOT NULL
""").fetchall()]
print(f"  Orphaned session IDs ({len(orphan_ids)}): {orphan_ids}", flush=True)
real_mapped = [(r['session_id'],r['user_id'],r['language_pref'] or 'en',r['created_at'] or NOW) for r in real_rows]
stub_mapped = [(sid, 'legacy_migrated_user', 'en', NOW) for sid in orphan_ids]

try:
    execute_values(pc, """INSERT INTO sessions (session_id,user_id,language_pref,created_at)
        VALUES %s ON CONFLICT (session_id) DO UPDATE SET
        user_id=EXCLUDED.user_id, language_pref=EXCLUDED.language_pref""", real_mapped)
    if stub_mapped:
        execute_values(pc, """INSERT INTO sessions (session_id,user_id,language_pref,created_at)
            VALUES %s ON CONFLICT (session_id) DO NOTHING""", stub_mapped)
    pg.commit()
    results['sessions'] = {'source': len(real_rows), 'migrated': len(real_mapped), 'errors': 0, 'stubs': len(stub_mapped)}
    print(f"  OK sessions: {len(real_mapped)} source + {len(stub_mapped)} stubs migrated", flush=True)
except Exception as e:
    pg.rollback()
    results['sessions'] = {'source': len(real_rows), 'migrated': 0, 'errors': 1, 'stubs': 0}
    print(f"  ERR sessions: {e}", flush=True)

# 4. cases
migrate_table('cases',
    """INSERT INTO cases (case_id,session_id,issue_type,title,description,entities_json,evidence_json,consent_status,created_at,updated_at)
       VALUES %s
       ON CONFLICT (case_id) DO UPDATE SET issue_type=EXCLUDED.issue_type,title=EXCLUDED.title,
       description=EXCLUDED.description,entities_json=EXCLUDED.entities_json,
       evidence_json=EXCLUDED.evidence_json,consent_status=EXCLUDED.consent_status,updated_at=EXCLUDED.updated_at""",
    lambda r: (r['case_id'],r['session_id'],r['issue_type'],r['title'],r['description'],
               j(r['entities_json'],'{}'),j(r['evidence_json'],'[]'),
               r['consent_status'] or 'pending',r['created_at'] or NOW,r['updated_at'] or NOW),
    "SELECT * FROM cases")

# 5. incidents
migrate_table('incidents',
    """INSERT INTO incidents (incident_id,case_id,cluster_id,issue_type,locality_bucket,amount_bucket,opposing_party_hash,consent_stage1,consent_stage2,created_at)
       VALUES %s
       ON CONFLICT (incident_id) DO UPDATE SET cluster_id=EXCLUDED.cluster_id,
       consent_stage1=EXCLUDED.consent_stage1, consent_stage2=EXCLUDED.consent_stage2""",
    lambda r: (r['incident_id'],r['case_id'],r['cluster_id'],r['issue_type'],
               r['locality_bucket'],r['amount_bucket'],r['opposing_party_hash'],
               int(r['consent_stage1'] or 0),int(r['consent_stage2'] or 0),r['created_at'] or NOW),
    "SELECT * FROM incidents")

# 6. drafts
migrate_table('drafts',
    """INSERT INTO drafts (draft_id,case_id,action_type,title,content,metadata_json,created_at)
       VALUES %s
       ON CONFLICT (draft_id) DO UPDATE SET content=EXCLUDED.content, metadata_json=EXCLUDED.metadata_json""",
    lambda r: (r['draft_id'],r['case_id'],r['action_type'],r['title'],r['content'],
               j(r['metadata_json'],'{}'),r['created_at'] or NOW),
    "SELECT * FROM drafts")

# 7. audit_events
migrate_table('audit_events',
    """INSERT INTO audit_events (event_id,actor,action,target_id,details_json,timestamp)
       VALUES %s ON CONFLICT (event_id) DO NOTHING""",
    lambda r: (r['event_id'],r['actor'],r['action'],r['target_id'],
               j(r['details_json'],'{}'),r['timestamp'] or NOW),
    "SELECT * FROM audit_events")

# 8. user_subscriptions
migrate_table('user_subscriptions',
    """INSERT INTO user_subscriptions (subscription_id,user_id,plan_id,status,current_period_start,current_period_end,gateway_subscription_id,cancel_at_period_end,created_at,updated_at)
       VALUES %s
       ON CONFLICT (subscription_id) DO UPDATE SET status=EXCLUDED.status,
       current_period_end=EXCLUDED.current_period_end, updated_at=EXCLUDED.updated_at""",
    lambda r: (r['subscription_id'],r['user_id'],r['plan_id'],r['status'],
               r['current_period_start'],r['current_period_end'],r['gateway_subscription_id'],
               int(r['cancel_at_period_end'] or 0),r['created_at'] or NOW,r['updated_at'] or NOW),
    "SELECT * FROM user_subscriptions")

# 9. payment_orders
migrate_table('payment_orders',
    """INSERT INTO payment_orders (order_id,user_id,gateway_order_id,item_type,item_ref_id,amount_inr,currency,status,signature,metadata_json,created_at,paid_at)
       VALUES %s
       ON CONFLICT (order_id) DO UPDATE SET status=EXCLUDED.status,
       signature=EXCLUDED.signature, paid_at=EXCLUDED.paid_at""",
    lambda r: (r['order_id'],r['user_id'],r['gateway_order_id'],r['item_type'],
               r['item_ref_id'],r['amount_inr'],r['currency'] or 'INR',r['status'],
               r['signature'],j(r['metadata_json'],'{}'),r['created_at'] or NOW,r['paid_at']),
    "SELECT * FROM payment_orders")

# 10. invoices
migrate_table('invoices',
    """INSERT INTO invoices (invoice_id,order_id,user_id,customer_name,customer_state,sac_code,base_amount_inr,cgst_inr,sgst_inr,igst_inr,total_amount_inr,invoice_pdf_url,created_at)
       VALUES %s ON CONFLICT (invoice_id) DO NOTHING""",
    lambda r: (r['invoice_id'],r['order_id'],r['user_id'],r['customer_name'],
               r['customer_state'] or 'Delhi',r['sac_code'] or '998311',
               r['base_amount_inr'],r['cgst_inr'] or 0,r['sgst_inr'] or 0,r['igst_inr'] or 0,
               r['total_amount_inr'],r['invoice_pdf_url'],r['created_at'] or NOW),
    "SELECT * FROM invoices")

# 11. collective_pool_contributions
migrate_table('collective_pool_contributions',
    """INSERT INTO collective_pool_contributions (contribution_id,cluster_id,user_id,order_id,amount_inr,status,created_at)
       VALUES %s ON CONFLICT (contribution_id) DO NOTHING""",
    lambda r: (r['contribution_id'],r['cluster_id'],r['user_id'],r['order_id'],
               r['amount_inr'],r['status'] or 'pledged',r['created_at'] or NOW),
    "SELECT * FROM collective_pool_contributions")

print("\n=== RECONCILIATION ===", flush=True)
total_src = total_mig = total_err = 0
for table, s in results.items():
    src, mig, err = s['source'], s['migrated'], s['errors']
    stb = s.get('stubs', 0)
    status = "OK " if err == 0 else "ERR"
    print(f"  {status} {table:<35} src={src:>4} mig={mig:>4}{' (+'+str(stb)+' stubs)' if stb else ''} err={err}", flush=True)
    total_src += src; total_mig += mig; total_err += err

print(f"\nTOTAL SOURCE={total_src} MIGRATED={total_mig} ERRORS={total_err}", flush=True)
sq.close()
pg.close()
sys.exit(0 if total_err == 0 else 1)
