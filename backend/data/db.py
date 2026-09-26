"""
Legal Saathi - Database & Repository Layer
Thread-safe persistence layer supporting Sessions, Cases, Evidence,
Incidents, Clusters, Drafts, and AuditEvents per Section 13 of the blueprint.
"""

from datetime import datetime, timezone
import json
import sqlite3
import threading
from typing import Any, Dict, List, Optional
import uuid

from backend.core.config import settings
from backend.core.logging import logger
from backend.schemas.case import CaseEntities, CaseResponse, EvidenceItem


class DatabaseManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(DatabaseManager, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self, db_path: Optional[str] = None):
        if self._initialized:
            return
        self.db_path = db_path or settings.DATABASE_PATH
        self._local = threading.local()
        self._init_db()
        self._initialized = True

    def get_connection(self) -> sqlite3.Connection:
        if not hasattr(self._local, "conn"):
            conn = sqlite3.connect(self.db_path, check_same_thread=False)
            conn.row_factory = sqlite3.Row
            self._local.conn = conn
        return self._local.conn

    def _init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()

        # Sessions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT,
                language_pref TEXT DEFAULT 'en',
                created_at TEXT
            )
        """)

        # Cases table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cases (
                case_id TEXT PRIMARY KEY,
                session_id TEXT,
                issue_type TEXT,
                title TEXT,
                description TEXT,
                entities_json TEXT,
                evidence_json TEXT,
                consent_status TEXT DEFAULT 'pending',
                created_at TEXT,
                updated_at TEXT,
                FOREIGN KEY (session_id) REFERENCES sessions(session_id)
            )
        """)

        # Incidents table (Legal Saathi Engine)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS incidents (
                incident_id TEXT PRIMARY KEY,
                case_id TEXT UNIQUE,
                cluster_id TEXT,
                issue_type TEXT,
                locality_bucket TEXT,
                amount_bucket TEXT,
                opposing_party_hash TEXT,
                consent_stage1 INTEGER DEFAULT 0,
                consent_stage2 INTEGER DEFAULT 0,
                created_at TEXT,
                FOREIGN KEY (case_id) REFERENCES cases(case_id)
            )
        """)

        # Clusters table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS clusters (
                cluster_id TEXT PRIMARY KEY,
                issue_type TEXT,
                locality_bucket TEXT,
                explanation_text TEXT,
                member_count INTEGER DEFAULT 0,
                incident_ids_json TEXT,
                created_at TEXT,
                status TEXT DEFAULT 'active'
            )
        """)

        # Drafts table (Notices, RTI, etc.)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS drafts (
                draft_id TEXT PRIMARY KEY,
                case_id TEXT,
                action_type TEXT,
                title TEXT,
                content TEXT,
                metadata_json TEXT,
                created_at TEXT
            )
        """)

        # AuditEvent table (append-only)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_events (
                event_id TEXT PRIMARY KEY,
                actor TEXT,
                action TEXT,
                target_id TEXT,
                details_json TEXT,
                timestamp TEXT
            )
        """)

        # --- Revenue & Billing Tables (LEGAL_SAATHI_REVENUE_BACKEND_SPEC.md) ---
        # 1. Subscription Plans Master
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subscription_plans (
                plan_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                tier TEXT NOT NULL,
                amount_inr INTEGER NOT NULL,
                billing_period TEXT NOT NULL,
                features_json TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL
            )
        """)

        # 2. User Subscriptions Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_subscriptions (
                subscription_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                plan_id TEXT NOT NULL,
                status TEXT NOT NULL,
                current_period_start TEXT NOT NULL,
                current_period_end TEXT NOT NULL,
                gateway_subscription_id TEXT,
                cancel_at_period_end INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
            )
        """)

        # 3. Payment Orders & Transactions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payment_orders (
                order_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                gateway_order_id TEXT UNIQUE,
                item_type TEXT NOT NULL,
                item_ref_id TEXT,
                amount_inr INTEGER NOT NULL,
                currency TEXT DEFAULT 'INR',
                status TEXT NOT NULL,
                signature TEXT,
                metadata_json TEXT,
                created_at TEXT NOT NULL,
                paid_at TEXT
            )
        """)

        # 4. Invoices Table (GST SAC Code 998311 Compliant)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS invoices (
                invoice_id TEXT PRIMARY KEY,
                order_id TEXT UNIQUE,
                user_id TEXT NOT NULL,
                customer_name TEXT,
                customer_state TEXT DEFAULT 'Delhi',
                sac_code TEXT DEFAULT '998311',
                base_amount_inr INTEGER NOT NULL,
                cgst_inr INTEGER DEFAULT 0,
                sgst_inr INTEGER DEFAULT 0,
                igst_inr INTEGER DEFAULT 0,
                total_amount_inr INTEGER NOT NULL,
                invoice_pdf_url TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (order_id) REFERENCES payment_orders(order_id)
            )
        """)

        # 5. Collective Action Pool Contributions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS collective_pool_contributions (
                contribution_id TEXT PRIMARY KEY,
                cluster_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                order_id TEXT UNIQUE,
                amount_inr INTEGER NOT NULL,
                status TEXT DEFAULT 'pledged',
                created_at TEXT NOT NULL,
                FOREIGN KEY (order_id) REFERENCES payment_orders(order_id)
            )
        """)

        # Seed initial subscription plans if empty
        cursor.execute("SELECT COUNT(*) FROM subscription_plans")
        if cursor.fetchone()[0] == 0:
            now_iso = datetime.now(timezone.utc).isoformat()
            default_plans = [
                (
                    "plan_civic",
                    "Bharat Civic Access",
                    "civic",
                    0,
                    "one_time",
                    json.dumps([
                        "Unlimited Multilingual Legal AI Chat",
                        "Evidence Checklist Generation",
                        "NALSA & DLSA Free Legal Aid Directory",
                        "Emergency 112 / 1930 / 181 Guidance",
                        "Consumer & Tenancy Rights Literacy"
                    ]),
                    1,
                    now_iso
                ),
                (
                    "plan_pro_monthly",
                    "Saathi Pro Monthly",
                    "pro",
                    14900,  # 149.00 in paise
                    "monthly",
                    json.dumps([
                        "Unlimited Court-Ready Legal Notices",
                        "Section 6(1) RTI Applications with PIO Addresses",
                        "Formal e-FIR & Cyber Crime Filing Packets",
                        "Watermark-Free PDF Dossier Downloads",
                        "Automated 15-Day Postal Dispatch Tracking",
                        "Priority AI Multi-Act Legal Retrieval"
                    ]),
                    1,
                    now_iso
                ),
                (
                    "plan_pro_annual",
                    "Saathi Pro Annual",
                    "pro",
                    129900,  # 1299.00 in paise (Save 27%)
                    "annual",
                    json.dumps([
                        "All Saathi Pro Monthly Features",
                        "Collective Action Docket Filing Rights",
                        "Multi-Year Document Vault (Encrypted)",
                        "27% Annual Savings (₹108/month effective)"
                    ]),
                    1,
                    now_iso
                ),
                (
                    "plan_advocate_monthly",
                    "Advocate Practice Hub Monthly",
                    "advocate",
                    149900,  # 1499.00 in paise
                    "monthly",
                    json.dumps([
                        "AI Chronology & Brief Extraction for Case Files",
                        "Bulk Case File OCR & Landmark Precedent Search",
                        "Multi-Client Case Management & Timeline Generator",
                        "Verified BCI-Compliant Public Profile (Non-Promotional)",
                        "Court Hearing Calendar & Daily Cause List Sync"
                    ]),
                    1,
                    now_iso
                ),
                (
                    "plan_advocate_annual",
                    "Advocate Practice Hub Annual",
                    "advocate",
                    1499000,  # 14,990.00 in paise (2 Months Free)
                    "annual",
                    json.dumps([
                        "All Advocate Practice Hub Features",
                        "Unlimited Junior Associate Sub-Accounts (up to 3)",
                        "Custom Law Firm Letterhead Automation",
                        "Priority Phone & Case File Ingestion Support"
                    ]),
                    1,
                    now_iso
                )
            ]
            cursor.executemany("""
                INSERT INTO subscription_plans (
                    plan_id, name, tier, amount_inr, billing_period,
                    features_json, is_active, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, default_plans)

        conn.commit()

    # --- Session Operations ---
    def get_or_create_session(self, session_id: str, lang: str = "en") -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (session_id,))
        row = cursor.fetchone()
        if row:
            return dict(row)
        
        now = datetime.now(timezone.utc).isoformat()
        user_id = f"usr_{uuid.uuid4().hex[:10]}"
        cursor.execute(
            "INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES (?, ?, ?, ?)",
            (session_id, user_id, lang, now)
        )
        conn.commit()
        return {"session_id": session_id, "user_id": user_id, "language_pref": lang, "created_at": now}

    # --- Case Operations ---
    def save_case(
        self,
        case_id: str,
        session_id: str,
        issue_type: str,
        title: str,
        description: str,
        entities: CaseEntities,
        evidence: Optional[List[EvidenceItem]] = None,
        consent_status: str = "pending"
    ) -> CaseResponse:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        evidence_list = evidence or []

        # Database-level ownership verification before insert/update
        cursor.execute("SELECT session_id FROM cases WHERE case_id = ?", (case_id,))
        existing_row = cursor.fetchone()
        if existing_row and existing_row["session_id"] and existing_row["session_id"] != session_id:
            logger.warning(f"Prevented unauthorized overwrite of case {case_id} by session {session_id}")
            raise PermissionError(f"Access denied: Case '{case_id}' belongs to another session.")

        cursor.execute("""
            INSERT OR REPLACE INTO cases (
                case_id, session_id, issue_type, title, description,
                entities_json, evidence_json, consent_status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 
                COALESCE((SELECT created_at FROM cases WHERE case_id = ?), ?), 
                ?
            )
        """, (
            case_id, session_id, issue_type, title, description,
            json.dumps(entities.model_dump()),
            json.dumps([e.model_dump() for e in evidence_list]),
            consent_status, case_id, now, now
        ))
        conn.commit()

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
            updated_at=now
        )

    def delete_case(self, case_id: str, session_id: str) -> bool:
        """Deletes a case only if owned by the requesting session."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT session_id FROM cases WHERE case_id = ?", (case_id,))
        row = cursor.fetchone()
        if not row:
            return False
        if row["session_id"] != session_id:
            raise PermissionError(f"Access denied: Cannot delete case '{case_id}' owned by another session.")
        
        cursor.execute("DELETE FROM cases WHERE case_id = ? AND session_id = ?", (case_id, session_id))
        conn.commit()
        self.log_audit_event("session:" + session_id, "delete_case", case_id, {})
        return True

    def get_case(self, case_id: str) -> Optional[CaseResponse]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,))
        row = cursor.fetchone()
        if not row:
            return None
        
        entities_data = json.loads(row["entities_json"]) if row["entities_json"] else {}
        evidence_data = json.loads(row["evidence_json"]) if row["evidence_json"] else []

        return CaseResponse(
            case_id=row["case_id"],
            session_id=row["session_id"],
            issue_type=row["issue_type"],
            title=row["title"],
            description=row["description"],
            entities=CaseEntities(**entities_data),
            evidence=[EvidenceItem(**e) for e in evidence_data],
            consent_status=row["consent_status"],
            created_at=row["created_at"],
            updated_at=row["updated_at"]
        )

    def list_cases(self, session_id: Optional[str] = None, limit: int = 50) -> List[CaseResponse]:
        conn = self.get_connection()
        cursor = conn.cursor()
        if session_id:
            cursor.execute("SELECT * FROM cases WHERE session_id = ? ORDER BY updated_at DESC LIMIT ?", (session_id, limit))
        else:
            cursor.execute("SELECT * FROM cases ORDER BY updated_at DESC LIMIT ?", (limit,))
        
        results = []
        for row in cursor.fetchall():
            entities_data = json.loads(row["entities_json"]) if row["entities_json"] else {}
            evidence_data = json.loads(row["evidence_json"]) if row["evidence_json"] else []
            results.append(CaseResponse(
                case_id=row["case_id"],
                session_id=row["session_id"],
                issue_type=row["issue_type"],
                title=row["title"],
                description=row["description"],
                entities=CaseEntities(**entities_data),
                evidence=[EvidenceItem(**e) for e in evidence_data],
                consent_status=row["consent_status"],
                created_at=row["created_at"],
                updated_at=row["updated_at"]
            ))
        return results

    # --- Incident & Clustering Operations ---
    def save_incident(
        self,
        incident_id: str,
        case_id: str,
        issue_type: str,
        locality_bucket: str,
        amount_bucket: str,
        opposing_party_hash: str,
        consent_stage1: bool = True
    ) -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT OR REPLACE INTO incidents (
                incident_id, case_id, cluster_id, issue_type, locality_bucket,
                amount_bucket, opposing_party_hash, consent_stage1, created_at
            ) VALUES (?, ?, (SELECT cluster_id FROM incidents WHERE case_id = ?), ?, ?, ?, ?, ?, ?)
        """, (
            incident_id, case_id, case_id, issue_type, locality_bucket,
            amount_bucket, opposing_party_hash, 1 if consent_stage1 else 0, now
        ))
        conn.commit()
        return {
            "incident_id": incident_id,
            "case_id": case_id,
            "issue_type": issue_type,
            "locality_bucket": locality_bucket,
            "amount_bucket": amount_bucket,
            "opposing_party_hash": opposing_party_hash,
            "consent_stage1": consent_stage1,
            "created_at": now
        }

    def get_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM incidents WHERE incident_id = ?", (incident_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def get_incident_by_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM incidents WHERE case_id = ?", (case_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def list_consented_incidents(self, issue_type: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        if issue_type and issue_type != "all":
            cursor.execute("SELECT * FROM incidents WHERE consent_stage1 = 1 AND issue_type = ?", (issue_type,))
        else:
            cursor.execute("SELECT * FROM incidents WHERE consent_stage1 = 1")
        return [dict(row) for row in cursor.fetchall()]

    def save_cluster(
        self,
        cluster_id: str,
        issue_type: str,
        locality_bucket: str,
        explanation_text: str,
        incident_ids: List[str]
    ) -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT OR REPLACE INTO clusters (
                cluster_id, issue_type, locality_bucket, explanation_text,
                member_count, incident_ids_json, created_at, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
        """, (
            cluster_id, issue_type, locality_bucket, explanation_text,
            len(incident_ids), json.dumps(incident_ids), now
        ))
        
        # Link incidents to this cluster
        for inc_id in incident_ids:
            cursor.execute("UPDATE incidents SET cluster_id = ? WHERE incident_id = ?", (cluster_id, inc_id))

        conn.commit()
        return {
            "cluster_id": cluster_id,
            "issue_type": issue_type,
            "locality_bucket": locality_bucket,
            "explanation_text": explanation_text,
            "member_count": len(incident_ids),
            "incident_ids": incident_ids,
            "created_at": now
        }

    def list_clusters(self) -> List[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM clusters ORDER BY created_at DESC")
        res = []
        for row in cursor.fetchall():
            d = dict(row)
            d["incident_ids"] = json.loads(d["incident_ids_json"]) if d["incident_ids_json"] else []
            res.append(d)
        return res

    # --- Drafts Operations ---
    def save_draft(self, draft_id: str, case_id: Optional[str], action_type: str, title: str, content: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT INTO drafts (draft_id, case_id, action_type, title, content, metadata_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (draft_id, case_id, action_type, title, content, json.dumps(metadata or {}), now))
        conn.commit()
        return {
            "draft_id": draft_id,
            "case_id": case_id,
            "action_type": action_type,
            "title": title,
            "content": content,
            "created_at": now
        }

    # --- Audit Trail Operations (SEC-009) ---
    def log_audit_event(self, actor: str, action: str, target_id: str, details: Optional[Dict[str, Any]] = None):
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            event_id = f"aud_{uuid.uuid4().hex[:12]}"
            cursor.execute("""
                INSERT INTO audit_events (event_id, actor, action, target_id, details_json, timestamp)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (event_id, actor, action, target_id, json.dumps(details or {}), datetime.now(timezone.utc).isoformat()))
            conn.commit()
        except Exception as e:
            logger.error(f"Failed to record audit event: {e}")

    # --- Analytics Operations ---
    def get_analytics_summary(self) -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM sessions")
        total_sessions = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM cases")
        total_cases = cursor.fetchone()[0]

        cursor.execute("SELECT issue_type, COUNT(*) FROM cases GROUP BY issue_type")
        counts_by_issue_type = dict(cursor.fetchall())

        cursor.execute("SELECT COUNT(*) FROM clusters")
        cluster_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM incidents WHERE cluster_id IS NOT NULL")
        total_clustered = cursor.fetchone()[0]

        cursor.execute("SELECT locality_bucket, COUNT(*) FROM incidents GROUP BY locality_bucket ORDER BY COUNT(*) DESC LIMIT 5")
        common_localities = [{"locality": row[0], "count": row[1]} for row in cursor.fetchall() if row[0]]

        return {
            "total_sessions": total_sessions,
            "total_cases": total_cases,
            "counts_by_issue_type": counts_by_issue_type,
            "confidence_distribution": {"strong": max(1, total_cases // 2), "partial": max(0, total_cases // 3), "insufficient": 0},
            "cluster_count": cluster_count,
            "total_clustered_incidents": total_clustered,
            "common_localities": common_localities
        }

    # --- Billing & Subscription Operations (REV-SPEC-001) ---
    def get_subscription_plans(self, active_only: bool = True) -> List[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM subscription_plans" + (" WHERE is_active = 1" if active_only else "")
        cursor.execute(query)
        plans = []
        for row in cursor.fetchall():
            d = dict(row)
            d["features"] = json.loads(d["features_json"]) if d["features_json"] else []
            plans.append(d)
        return plans

    def get_plan(self, plan_id: str) -> Optional[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM subscription_plans WHERE plan_id = ?", (plan_id,))
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        d["features"] = json.loads(d["features_json"]) if d["features_json"] else []
        return d

    def get_user_subscription(self, user_id: str) -> Optional[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.*, p.name as plan_name, p.tier as plan_tier, p.features_json
            FROM user_subscriptions s
            JOIN subscription_plans p ON s.plan_id = p.plan_id
            WHERE s.user_id = ? AND s.status = 'active'
            ORDER BY s.current_period_end DESC LIMIT 1
        """, (user_id,))
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        d["features"] = json.loads(d["features_json"]) if d["features_json"] else []
        return d

    def create_or_update_subscription(
        self,
        subscription_id: str,
        user_id: str,
        plan_id: str,
        status: str,
        current_period_start: str,
        current_period_end: str,
        gateway_subscription_id: Optional[str] = None
    ) -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT OR REPLACE INTO user_subscriptions (
                subscription_id, user_id, plan_id, status,
                current_period_start, current_period_end, gateway_subscription_id,
                cancel_at_period_end, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 
                COALESCE((SELECT created_at FROM user_subscriptions WHERE subscription_id = ?), ?), 
                ?
            )
        """, (
            subscription_id, user_id, plan_id, status,
            current_period_start, current_period_end, gateway_subscription_id,
            subscription_id, now, now
        ))
        conn.commit()
        self.log_audit_event(f"user:{user_id}", "subscription_updated", subscription_id, {"plan_id": plan_id, "status": status})
        return {
            "subscription_id": subscription_id,
            "user_id": user_id,
            "plan_id": plan_id,
            "status": status,
            "current_period_start": current_period_start,
            "current_period_end": current_period_end
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
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT INTO payment_orders (
                order_id, user_id, gateway_order_id, item_type, item_ref_id,
                amount_inr, currency, status, metadata_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'created', ?, ?)
        """, (
            order_id, user_id, gateway_order_id, item_type, item_ref_id,
            amount_inr, currency, json.dumps(metadata or {}), now
        ))
        conn.commit()
        return {
            "order_id": order_id,
            "user_id": user_id,
            "gateway_order_id": gateway_order_id,
            "item_type": item_type,
            "item_ref_id": item_ref_id,
            "amount_inr": amount_inr,
            "currency": currency,
            "status": "created",
            "created_at": now
        }

    def get_payment_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM payment_orders WHERE order_id = ?", (order_id,))
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        d["metadata"] = json.loads(d["metadata_json"]) if d["metadata_json"] else {}
        return d

    def get_payment_order_by_gateway_id(self, gateway_order_id: str) -> Optional[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM payment_orders WHERE gateway_order_id = ?", (gateway_order_id,))
        row = cursor.fetchone()
        if not row:
            return None
        d = dict(row)
        d["metadata"] = json.loads(d["metadata_json"]) if d["metadata_json"] else {}
        return d

    def update_payment_order_status(
        self,
        order_id: str,
        status: str,
        signature: Optional[str] = None,
        paid_at: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = paid_at or (datetime.now(timezone.utc).isoformat() if status == "paid" else None)
        cursor.execute("""
            UPDATE payment_orders
            SET status = ?, signature = COALESCE(?, signature), paid_at = COALESCE(?, paid_at)
            WHERE order_id = ?
        """, (status, signature, now, order_id))
        conn.commit()
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
        invoice_pdf_url: Optional[str] = None
    ) -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT OR REPLACE INTO invoices (
                invoice_id, order_id, user_id, customer_name, customer_state,
                sac_code, base_amount_inr, cgst_inr, sgst_inr, igst_inr,
                total_amount_inr, invoice_pdf_url, created_at
            ) VALUES (?, ?, ?, ?, ?, '998311', ?, ?, ?, ?, ?, ?, ?)
        """, (
            invoice_id, order_id, user_id, customer_name, customer_state,
            base_amount_inr, cgst_inr, sgst_inr, igst_inr,
            total_amount_inr, invoice_pdf_url, now
        ))
        conn.commit()
        return {
            "invoice_id": invoice_id,
            "order_id": order_id,
            "user_id": user_id,
            "sac_code": "998311",
            "base_amount_inr": base_amount_inr,
            "cgst_inr": cgst_inr,
            "sgst_inr": sgst_inr,
            "igst_inr": igst_inr,
            "total_amount_inr": total_amount_inr,
            "created_at": now
        }

    def list_user_invoices(self, user_id: str) -> List[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        return [dict(row) for row in cursor.fetchall()]

    def add_collective_contribution(
        self,
        contribution_id: str,
        cluster_id: str,
        user_id: str,
        order_id: str,
        amount_inr: int,
        status: str = "pledged"
    ) -> Dict[str, Any]:
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT INTO collective_pool_contributions (
                contribution_id, cluster_id, user_id, order_id, amount_inr, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (contribution_id, cluster_id, user_id, order_id, amount_inr, status, now))
        conn.commit()
        return {
            "contribution_id": contribution_id,
            "cluster_id": cluster_id,
            "user_id": user_id,
            "order_id": order_id,
            "amount_inr": amount_inr,
            "status": status,
            "created_at": now
        }

    def get_cluster_contributions(self, cluster_id: str) -> List[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM collective_pool_contributions WHERE cluster_id = ? ORDER BY created_at ASC", (cluster_id,))
        return [dict(row) for row in cursor.fetchall()]

    # --- Entitlement Checkers ---
    def check_user_has_active_pro(self, user_id: str) -> bool:
        """Checks if user has an active Pro, Advocate, or Enterprise subscription."""
        if not user_id:
            return False
        sub = self.get_user_subscription(user_id)
        if not sub:
            return False
        if sub.get("status") != "active":
            return False
        end_time_str = sub.get("current_period_end")
        if not end_time_str:
            return False
        try:
            end_dt = datetime.fromisoformat(end_time_str.replace("Z", "+00:00"))
            return end_dt > datetime.now(timezone.utc)
        except Exception:
            return False

    def check_user_has_unlocked_item(self, user_id: str, item_ref_id_or_feature: str) -> bool:
        """Checks if user made a paid one-time microtransaction for a specific case/document."""
        if not user_id or not item_ref_id_or_feature:
            return False
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COUNT(*) FROM payment_orders
            WHERE user_id = ? AND status = 'paid'
            AND (item_ref_id = ? OR item_type = ?)
        """, (user_id, item_ref_id_or_feature, item_ref_id_or_feature))
        count = cursor.fetchone()[0]
        return count > 0


db = DatabaseManager()
