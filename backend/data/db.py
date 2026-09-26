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
        cursor.execute(
            "INSERT INTO sessions (session_id, user_id, language_pref, created_at) VALUES (?, ?, ?, ?)",
            (session_id, f"usr_{uuid.uuid4().hex[:10]}", lang, now)
        )
        conn.commit()
        return {"session_id": session_id, "language_pref": lang, "created_at": now}

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

        self.log_audit_event("system", "save_case", case_id, {"issue_type": issue_type})
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


db = DatabaseManager()
