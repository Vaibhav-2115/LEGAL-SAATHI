"""
Legal Saathi - Database & Repository Layer (PostgreSQL / Supabase)
Persistence layer for Sessions, Cases, Incidents, Clusters, Drafts,
AuditEvents, Billing and Collective Contributions.

ARCHITECTURE: PostgreSQL-only (Supabase).
SQLite has been removed from active runtime. Backfill or migration
scripts that still reference SQLite are kept in scripts/ only.

Startup requirement: DATABASE_URL environment variable must be set
to a valid PostgreSQL connection string. The application will raise
RuntimeError at import time if the variable is absent.
"""

from datetime import datetime, timezone
import json
import os
import threading
from typing import Any, Dict, List, Optional
import uuid

from backend.core.config import settings
from backend.core.logging import logger
from backend.schemas.case import CaseEntities, CaseResponse, EvidenceItem


# ---------------------------------------------------------------------------
# Connection helpers
# ---------------------------------------------------------------------------

def _require_database_url() -> str:
    """Returns DATABASE_URL or raises RuntimeError with clear instructions."""
    url = getattr(settings, "DATABASE_URL", None) or os.environ.get("DATABASE_URL")
    if not url or "YOUR-PASSWORD" in url or "YOUR-PROJECT-REF" in url:
        raise RuntimeError(
            "DATABASE_URL is not configured.\n"
            "Create a .env file in the project root and set:\n"
            "  DATABASE_URL=postgresql://postgres.<project-ref>:<password>"
            "@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres\n"
            "Then restart the backend."
        )
    return url


def _connect():
    """Opens a new psycopg2 connection to Supabase PostgreSQL."""
    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor
    except ImportError as exc:
        raise RuntimeError(
            "psycopg2 is not installed. Run: pip install psycopg2-binary"
        ) from exc

    url = _require_database_url()
    conn = psycopg2.connect(url, cursor_factory=RealDictCursor)
    conn.autocommit = False
    return conn


# ---------------------------------------------------------------------------
# DatabaseManager (singleton, thread-local connections)
# ---------------------------------------------------------------------------

class DatabaseManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return
        # Validate credentials at startup — fail fast, no silent fallback.
        _require_database_url()
        self._local = threading.local()
        self._initialized = True
        logger.info("DatabaseManager initialised — engine: PostgreSQL (Supabase)")

    # ------------------------------------------------------------------
    # Connection management
    # ------------------------------------------------------------------

    def get_connection(self):
        """Returns a thread-local PostgreSQL connection, reconnecting if needed."""
        conn = getattr(self._local, "conn", None)
        if conn is None or conn.closed:
            self._local.conn = _connect()
        return self._local.conn

    def _cursor(self):
        return self.get_connection().cursor()

    def _commit(self):
        self.get_connection().commit()

    def _rollback(self):
        try:
            self.get_connection().rollback()
        except Exception:
            pass

    # ------------------------------------------------------------------
    # Health probe
    # ------------------------------------------------------------------

    def check_health(self) -> Dict[str, Any]:
        """Non-destructive liveness probe."""
        try:
            cursor = self._cursor()
            cursor.execute("SELECT 1")
            return {
                "status": "healthy",
                "engine": "postgresql",
                "configured_engine": "postgresql",
                "is_fallback": False,
                "connected": True,
                "database_target": "supabase_postgresql",
            }
        except Exception as exc:
            return {
                "status": "unhealthy",
                "engine": "postgresql",
                "configured_engine": "postgresql",
                "is_fallback": False,
                "connected": False,
                "error": str(exc),
            }

    # ------------------------------------------------------------------
    # Session operations
    # ------------------------------------------------------------------

    def get_or_create_session(self, session_id: str, lang: str = "en") -> Dict[str, Any]:
        cursor = self._cursor()
        cursor.execute("SELECT * FROM sessions WHERE session_id = %s", (session_id,))
        row = cursor.fetchone()
        if row:
            return dict(row)

        now = datetime.now(timezone.utc).isoformat()
        user_id = f"usr_{uuid.uuid4().hex[:10]}"
        cursor.execute(
            """
            INSERT INTO sessions (session_id, user_id, language_pref, created_at)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (session_id) DO UPDATE
              SET language_pref = EXCLUDED.language_pref
            RETURNING *
            """,
            (session_id, user_id, lang, now),
        )
        self._commit()
        result = cursor.fetchone()
        return dict(result) if result else {"session_id": session_id, "user_id": user_id, "language_pref": lang, "created_at": now}

    # ------------------------------------------------------------------
    # Case operations
    # ------------------------------------------------------------------

    def save_case(
        self,
        case_id: str,
        session_id: str,
        issue_type: str,
        title: str,
        description: str,
        entities: CaseEntities,
        evidence: Optional[List[EvidenceItem]] = None,
        consent_status: str = "pending",
    ) -> CaseResponse:
        cursor = self._cursor()
        now = datetime.now(timezone.utc).isoformat()
        evidence_list = evidence or []

        # Ownership check — prevent cross-session overwrites
        cursor.execute("SELECT session_id FROM cases WHERE case_id = %s", (case_id,))
        existing = cursor.fetchone()
        if existing and existing["session_id"] and existing["session_id"] != session_id:
            logger.warning("Blocked cross-session overwrite: case=%s by session=%s", case_id, session_id)
            raise PermissionError(f"Access denied: Case '{case_id}' belongs to another session.")

        # Ensure session exists to satisfy foreign key constraint
        if session_id:
            cursor.execute(
                """
                INSERT INTO sessions (session_id, user_id, created_at)
                VALUES (%s, %s, %s)
                ON CONFLICT (session_id) DO NOTHING
                """,
                (session_id, session_id, now)
            )

        cursor.execute(
            """
            INSERT INTO cases (
                case_id, session_id, issue_type, title, description,
                entities_json, evidence_json, consent_status, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (case_id) DO UPDATE SET
                issue_type      = EXCLUDED.issue_type,
                title           = EXCLUDED.title,
                description     = EXCLUDED.description,
                entities_json   = EXCLUDED.entities_json,
                evidence_json   = EXCLUDED.evidence_json,
                consent_status  = EXCLUDED.consent_status,
                updated_at      = EXCLUDED.updated_at
            """,
            (
                case_id, session_id, issue_type, title, description,
                json.dumps(entities.model_dump() if hasattr(entities, "model_dump") else (entities or {})),
                json.dumps([e.model_dump() if hasattr(e, "model_dump") else e for e in evidence_list]),
                consent_status, now, now,
            ),
        )
        self._commit()
        self.log_audit_event("session:" + session_id, "save_case", case_id, {"issue_type": issue_type})
        return CaseResponse(
            case_id=case_id,
            session_id=session_id,
            issue_type=issue_type,
            title=title,
            description=description,
            entities=entities,
            evidence=evidence_list,
            consent_status=consent_status,
            created_at=now,
            updated_at=now,
        )

    def delete_case(self, case_id: str, session_id: str) -> bool:
        cursor = self._cursor()
        cursor.execute("SELECT session_id FROM cases WHERE case_id = %s", (case_id,))
        row = cursor.fetchone()
        if not row:
            return False
        if row["session_id"] != session_id:
            raise PermissionError(f"Access denied: Cannot delete case '{case_id}' owned by another session.")
        cursor.execute("DELETE FROM cases WHERE case_id = %s AND session_id = %s", (case_id, session_id))
        self._commit()
        self.log_audit_event("session:" + session_id, "delete_case", case_id, {})
        return True

    def get_case(self, case_id: str) -> Optional[CaseResponse]:
        cursor = self._cursor()
        cursor.execute("SELECT * FROM cases WHERE case_id = %s", (case_id,))
        row = cursor.fetchone()
        if not row:
            return None
        row = dict(row)
        entities_data = row["entities_json"] if isinstance(row["entities_json"], dict) else json.loads(row["entities_json"] or "{}")
        evidence_data = row["evidence_json"] if isinstance(row["evidence_json"], list) else json.loads(row["evidence_json"] or "[]")
        return CaseResponse(
            case_id=row["case_id"],
            session_id=row["session_id"],
            issue_type=row["issue_type"],
            title=row["title"],
            description=row["description"],
            entities=CaseEntities(**entities_data),
            evidence=[EvidenceItem(**e) for e in evidence_data],
            consent_status=row["consent_status"],
            created_at=str(row["created_at"]),
            updated_at=str(row["updated_at"]),
        )

    def list_cases(self, session_id: Optional[str] = None, limit: int = 50) -> List[CaseResponse]:
        cursor = self._cursor()
        if session_id:
            cursor.execute(
                "SELECT * FROM cases WHERE session_id = %s ORDER BY updated_at DESC LIMIT %s",
                (session_id, limit),
            )
        else:
            cursor.execute("SELECT * FROM cases ORDER BY updated_at DESC LIMIT %s", (limit,))

        results = []
        for row in cursor.fetchall():
            row = dict(row)
            entities_data = row["entities_json"] if isinstance(row["entities_json"], dict) else json.loads(row["entities_json"] or "{}")
            evidence_data = row["evidence_json"] if isinstance(row["evidence_json"], list) else json.loads(row["evidence_json"] or "[]")
            results.append(CaseResponse(
                case_id=row["case_id"],
                session_id=row["session_id"],
                issue_type=row["issue_type"],
                title=row["title"],
                description=row["description"],
                entities=CaseEntities(**entities_data),
                evidence=[EvidenceItem(**e) for e in evidence_data],
                consent_status=row["consent_status"],
                created_at=str(row["created_at"]),
                updated_at=str(row["updated_at"]),
            ))
        return results

    # ------------------------------------------------------------------
    # Incident & Clustering operations
    # ------------------------------------------------------------------

    def save_incident(
        self,
        incident_id: str,
        case_id: str,
        issue_type: str,
        locality_bucket: str,
        amount_bucket: str,
        opposing_party_hash: str,
        consent_stage1: bool = True,
    ) -> Dict[str, Any]:
        cursor = self._cursor()
        now = datetime.now(timezone.utc).isoformat()
        # Preserve existing cluster_id on upsert
        cursor.execute("SELECT cluster_id FROM incidents WHERE case_id = %s", (case_id,))
        existing_cluster = cursor.fetchone()
        cluster_id = existing_cluster["cluster_id"] if existing_cluster else None

        cursor.execute(
            """
            INSERT INTO incidents (
                incident_id, case_id, cluster_id, issue_type, locality_bucket,
                amount_bucket, opposing_party_hash, consent_stage1, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (incident_id) DO UPDATE SET
                cluster_id          = EXCLUDED.cluster_id,
                issue_type          = EXCLUDED.issue_type,
                locality_bucket     = EXCLUDED.locality_bucket,
                amount_bucket       = EXCLUDED.amount_bucket,
                opposing_party_hash = EXCLUDED.opposing_party_hash,
                consent_stage1      = EXCLUDED.consent_stage1
            """,
            (incident_id, case_id, cluster_id, issue_type, locality_bucket,
             amount_bucket, opposing_party_hash, 1 if consent_stage1 else 0, now),
        )
        self._commit()
        return {
            "incident_id": incident_id, "case_id": case_id,
            "issue_type": issue_type, "locality_bucket": locality_bucket,
            "amount_bucket": amount_bucket, "opposing_party_hash": opposing_party_hash,
            "consent_stage1": consent_stage1, "created_at": now,
        }

    def get_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute("SELECT * FROM incidents WHERE incident_id = %s", (incident_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def get_incident_by_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute("SELECT * FROM incidents WHERE case_id = %s", (case_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def list_consented_incidents(self, issue_type: Optional[str] = None) -> List[Dict[str, Any]]:
        cursor = self._cursor()
        if issue_type and issue_type != "all":
            cursor.execute(
                "SELECT * FROM incidents WHERE consent_stage1 = 1 AND issue_type = %s",
                (issue_type,),
            )
        else:
            cursor.execute("SELECT * FROM incidents WHERE consent_stage1 = 1")
        return [dict(r) for r in cursor.fetchall()]

    def save_cluster(
        self,
        cluster_id: str,
        issue_type: str,
        locality_bucket: str,
        explanation_text: str,
        incident_ids: List[str],
    ) -> Dict[str, Any]:
        cursor = self._cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute(
            """
            INSERT INTO clusters (
                cluster_id, issue_type, locality_bucket, explanation_text,
                member_count, incident_ids_json, created_at, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, 'active')
            ON CONFLICT (cluster_id) DO UPDATE SET
                member_count      = EXCLUDED.member_count,
                incident_ids_json = EXCLUDED.incident_ids_json,
                explanation_text  = EXCLUDED.explanation_text
            """,
            (cluster_id, issue_type, locality_bucket, explanation_text,
             len(incident_ids), json.dumps(incident_ids), now),
        )
        for inc_id in incident_ids:
            cursor.execute(
                "UPDATE incidents SET cluster_id = %s WHERE incident_id = %s",
                (cluster_id, inc_id),
            )
        self._commit()
        return {
            "cluster_id": cluster_id, "issue_type": issue_type,
            "locality_bucket": locality_bucket, "explanation_text": explanation_text,
            "member_count": len(incident_ids), "incident_ids": incident_ids, "created_at": now,
        }

    def list_clusters(self) -> List[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute("SELECT * FROM clusters ORDER BY created_at DESC")
        res = []
        for row in cursor.fetchall():
            d = dict(row)
            ids = d.get("incident_ids_json")
            d["incident_ids"] = ids if isinstance(ids, list) else json.loads(ids or "[]")
            res.append(d)
        return res

    # ------------------------------------------------------------------
    # Draft operations
    # ------------------------------------------------------------------

    def save_draft(
        self,
        draft_id: str,
        case_id: Optional[str],
        action_type: str,
        title: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        cursor = self._cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute(
            """
            INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (draft_id) DO UPDATE SET
                content       = EXCLUDED.content,
                metadata_json = EXCLUDED.metadata_json
            """,
            (draft_id, case_id, action_type, title, content, json.dumps(metadata or {}), now),
        )
        self._commit()
        return {"draft_id": draft_id, "case_id": case_id, "action_type": action_type,
                "title": title, "content": content, "created_at": now}

    # ------------------------------------------------------------------
    # Audit trail (SEC-009 — append-only)
    # ------------------------------------------------------------------

    def log_audit_event(
        self,
        actor: str,
        action: str,
        target_id: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        try:
            cursor = self._cursor()
            event_id = f"aud_{uuid.uuid4().hex[:12]}"
            cursor.execute(
                """
                INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (event_id, actor, action, target_id,
                 json.dumps(details or {}), datetime.now(timezone.utc).isoformat()),
            )
            self._commit()
        except Exception as exc:
            logger.error("Failed to record audit event: %s", exc)

    # ------------------------------------------------------------------
    # Analytics
    # ------------------------------------------------------------------

    def get_analytics_summary(self) -> Dict[str, Any]:
        cursor = self._cursor()

        cursor.execute("SELECT COUNT(*) AS n FROM sessions")
        total_sessions = cursor.fetchone()["n"]

        cursor.execute("SELECT COUNT(*) AS n FROM cases")
        total_cases = cursor.fetchone()["n"]

        cursor.execute("SELECT issue_type, COUNT(*) AS n FROM cases GROUP BY issue_type")
        counts_by_issue_type = {r["issue_type"]: r["n"] for r in cursor.fetchall()}

        cursor.execute("SELECT COUNT(*) AS n FROM clusters")
        cluster_count = cursor.fetchone()["n"]

        cursor.execute("SELECT COUNT(*) AS n FROM incidents WHERE cluster_id IS NOT NULL")
        total_clustered = cursor.fetchone()["n"]

        cursor.execute(
            "SELECT locality_bucket, COUNT(*) AS n FROM incidents "
            "GROUP BY locality_bucket ORDER BY n DESC LIMIT 5"
        )
        common_localities = [
            {"locality": r["locality_bucket"], "count": r["n"]}
            for r in cursor.fetchall() if r["locality_bucket"]
        ]

        return {
            "total_sessions": total_sessions,
            "total_cases": total_cases,
            "counts_by_issue_type": counts_by_issue_type,
            "confidence_distribution": {
                "strong": max(1, total_cases // 2),
                "partial": max(0, total_cases // 3),
                "insufficient": 0,
            },
            "cluster_count": cluster_count,
            "total_clustered_incidents": total_clustered,
            "common_localities": common_localities,
        }

    # ------------------------------------------------------------------
    # Billing & Subscription operations (REV-SPEC-001)
    # ------------------------------------------------------------------

    def get_subscription_plans(self, active_only: bool = True) -> List[Dict[str, Any]]:
        cursor = self._cursor()
        query = "SELECT * FROM subscription_plans" + (" WHERE is_active = 1" if active_only else "")
        cursor.execute(query)
        plans = []
        for row in cursor.fetchall():
            d = dict(row)
            fj = d.get("features_json")
            d["features"] = fj if isinstance(fj, list) else json.loads(fj or "[]")
            plans.append(d)
        return plans

    def get_plan(self, plan_id: str) -> Optional[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute("SELECT * FROM subscription_plans WHERE plan_id = %s", (plan_id,))
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        fj = d.get("features_json")
        d["features"] = fj if isinstance(fj, list) else json.loads(fj or "[]")
        return d

    def get_user_subscription(self, user_id: str) -> Optional[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute(
            """
            SELECT s.*, p.name AS plan_name, p.tier AS plan_tier, p.features_json
            FROM user_subscriptions s
            JOIN subscription_plans p ON s.plan_id = p.plan_id
            WHERE s.user_id = %s AND s.status = 'active'
            ORDER BY s.current_period_end DESC LIMIT 1
            """,
            (user_id,),
        )
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        fj = d.get("features_json")
        d["features"] = fj if isinstance(fj, list) else json.loads(fj or "[]")
        return d

    def create_or_update_subscription(
        self,
        subscription_id: str,
        user_id: str,
        plan_id: str,
        status: str,
        current_period_start: str,
        current_period_end: str,
        gateway_subscription_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        cursor = self._cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute(
            """
            INSERT INTO user_subscriptions (
                subscription_id, user_id, plan_id, status,
                current_period_start, current_period_end, gateway_subscription_id,
                cancel_at_period_end, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, 0, %s, %s)
            ON CONFLICT (subscription_id) DO UPDATE SET
                status                  = EXCLUDED.status,
                current_period_start    = EXCLUDED.current_period_start,
                current_period_end      = EXCLUDED.current_period_end,
                gateway_subscription_id = EXCLUDED.gateway_subscription_id,
                updated_at              = EXCLUDED.updated_at
            """,
            (subscription_id, user_id, plan_id, status,
             current_period_start, current_period_end, gateway_subscription_id,
             now, now),
        )
        self._commit()
        self.log_audit_event(
            f"user:{user_id}", "subscription_updated", subscription_id,
            {"plan_id": plan_id, "status": status},
        )
        return {
            "subscription_id": subscription_id, "user_id": user_id,
            "plan_id": plan_id, "status": status,
            "current_period_start": current_period_start,
            "current_period_end": current_period_end,
        }

    def create_payment_order(
        self,
        order_id: str,
        user_id: str,
        gateway_order_id: str,
        item_type: str,
        amount_inr: int,
        item_ref_id: Optional[str] = None,
        currency: str = "INR",
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        cursor = self._cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute(
            """
            INSERT INTO payment_orders (
                order_id, user_id, gateway_order_id, item_type, item_ref_id,
                amount_inr, currency, status, metadata_json, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, 'created', %s, %s)
            """,
            (order_id, user_id, gateway_order_id, item_type, item_ref_id,
             amount_inr, currency, json.dumps(metadata or {}), now),
        )
        self._commit()
        return {
            "order_id": order_id, "user_id": user_id,
            "gateway_order_id": gateway_order_id, "item_type": item_type,
            "item_ref_id": item_ref_id, "amount_inr": amount_inr,
            "currency": currency, "status": "created", "created_at": now,
        }

    def get_payment_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute("SELECT * FROM payment_orders WHERE order_id = %s", (order_id,))
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        mj = d.get("metadata_json")
        d["metadata"] = mj if isinstance(mj, dict) else json.loads(mj or "{}")
        return d

    def get_payment_order_by_gateway_id(self, gateway_order_id: str) -> Optional[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute(
            "SELECT * FROM payment_orders WHERE gateway_order_id = %s", (gateway_order_id,)
        )
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        mj = d.get("metadata_json")
        d["metadata"] = mj if isinstance(mj, dict) else json.loads(mj or "{}")
        return d

    def update_payment_order_status(
        self,
        order_id: str,
        status: str,
        signature: Optional[str] = None,
        paid_at: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        cursor = self._cursor()
        now = paid_at or (datetime.now(timezone.utc).isoformat() if status == "paid" else None)
        cursor.execute(
            """
            UPDATE payment_orders
            SET status    = %s,
                signature = COALESCE(%s, signature),
                paid_at   = COALESCE(%s, paid_at)
            WHERE order_id = %s
            """,
            (status, signature, now, order_id),
        )
        self._commit()
        return self.get_payment_order(order_id)

    def create_invoice(
        self,
        invoice_id: str,
        order_id: str,
        user_id: str,
        customer_name: Optional[str],
        customer_state: str,
        base_amount_inr: int,
        cgst_inr: int,
        sgst_inr: int,
        igst_inr: int,
        total_amount_inr: int,
        invoice_pdf_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        cursor = self._cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute(
            """
            INSERT INTO invoices (
                invoice_id, order_id, user_id, customer_name, customer_state,
                sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr,
                total_amount_inr, invoice_pdf_url, created_at
            ) VALUES (%s, %s, %s, %s, %s, '998311', %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (invoice_id) DO NOTHING
            """,
            (invoice_id, order_id, user_id, customer_name, customer_state,
             base_amount_inr, cgst_inr, sgst_inr, igst_inr,
             total_amount_inr, invoice_pdf_url, now),
        )
        self._commit()
        return {
            "invoice_id": invoice_id, "order_id": order_id, "user_id": user_id,
            "sac_code": "998311", "base_amount_inr": base_amount_inr,
            "cgst_inr": cgst_inr, "sgst_inr": sgst_inr, "igst_inr": igst_inr,
            "total_amount_inr": total_amount_inr, "created_at": now,
        }

    def list_user_invoices(self, user_id: str) -> List[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute(
            "SELECT * FROM invoices WHERE user_id = %s ORDER BY created_at DESC", (user_id,)
        )
        return [dict(r) for r in cursor.fetchall()]

    def add_collective_contribution(
        self,
        contribution_id: str,
        cluster_id: str,
        user_id: str,
        order_id: str,
        amount_inr: int,
        status: str = "pledged",
    ) -> Dict[str, Any]:
        cursor = self._cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute(
            """
            INSERT INTO collective_pool_contributions (
                contribution_id, cluster_id, user_id, order_id, amount_inr, status, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (contribution_id, cluster_id, user_id, order_id, amount_inr, status, now),
        )
        self._commit()
        return {
            "contribution_id": contribution_id, "cluster_id": cluster_id,
            "user_id": user_id, "order_id": order_id,
            "amount_inr": amount_inr, "status": status, "created_at": now,
        }

    def get_cluster_contributions(self, cluster_id: str) -> List[Dict[str, Any]]:
        cursor = self._cursor()
        cursor.execute(
            "SELECT * FROM collective_pool_contributions WHERE cluster_id = %s ORDER BY created_at ASC",
            (cluster_id,),
        )
        return [dict(r) for r in cursor.fetchall()]

    # ------------------------------------------------------------------
    # Entitlement checkers
    # ------------------------------------------------------------------

    def check_user_has_active_pro(self, user_id: str) -> bool:
        if not user_id:
            return False
        sub = self.get_user_subscription(user_id)
        if not sub or sub.get("status") != "active":
            return False
        end_time_str = sub.get("current_period_end")
        if not end_time_str:
            return False
        try:
            end_dt = datetime.fromisoformat(str(end_time_str).replace("Z", "+00:00"))
            return end_dt > datetime.now(timezone.utc)
        except Exception:
            return False

    def check_user_has_unlocked_item(self, user_id: str, item_ref_id_or_feature: str) -> bool:
        if not user_id or not item_ref_id_or_feature:
            return False
        cursor = self._cursor()
        cursor.execute(
            """
            SELECT COUNT(*) AS n FROM payment_orders
            WHERE user_id = %s AND status = 'paid'
              AND (item_ref_id = %s OR item_type = %s)
            """,
            (user_id, item_ref_id_or_feature, item_ref_id_or_feature),
        )
        return cursor.fetchone()["n"] > 0


# Module-level singleton — fails fast if DATABASE_URL is absent.
db = DatabaseManager()
