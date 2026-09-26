"""
Legal Saathi Engine - Consent Management (consent.py)
Handles informed opt-in and consent auditing for collective pattern detection.
Per Section 8.9 and SEC-009.
"""

from typing import Dict, Any, Optional
from backend.data.db import db
from backend.core.logging import logger


class ConsentService:
    def update_stage1_consent(self, case_id: str, consent: bool, actor: str = "user") -> Dict[str, Any]:
        """
        Updates Stage 1 consent: 'Allow anonymized case facts to be used for pattern detection'.
        """
        status_str = "granted" if consent else "revoked"
        
        # 1. Update Case
        case = db.get_case(case_id)
        if case:
            db.save_case(
                case_id=case.case_id,
                session_id=case.session_id,
                issue_type=case.issue_type,
                title=case.title,
                description=case.description,
                entities=case.entities,
                evidence=case.evidence,
                consent_status=status_str
            )

        # 2. Update Incident if exists
        incident = db.get_incident_by_case(case_id)
        if incident:
            db.save_incident(
                incident_id=incident["incident_id"],
                case_id=case_id,
                issue_type=incident["issue_type"],
                locality_bucket=incident["locality_bucket"],
                amount_bucket=incident["amount_bucket"],
                opposing_party_hash=incident["opposing_party_hash"],
                consent_stage1=consent
            )

        # 3. Audit trail (SEC-009)
        db.log_audit_event(
            actor=actor,
            action="consent_stage1_updated",
            target_id=case_id,
            details={"consent": consent, "status": status_str}
        )
        logger.info(f"Recorded Stage 1 consent {status_str} for case {case_id}")
        return {"case_id": case_id, "consent_stage1": consent, "status": status_str}

    def update_stage2_consent(self, incident_id: str, consent: bool, actor: str = "user") -> Dict[str, Any]:
        """
        Updates Stage 2 consent: 'Connect with others in cluster for collective legal action'.
        """
        status_str = "collective_granted" if consent else "collective_revoked"
        db.log_audit_event(
            actor=actor,
            action="consent_stage2_updated",
            target_id=incident_id,
            details={"consent": consent, "status": status_str}
        )
        return {"incident_id": incident_id, "consent_stage2": consent, "status": status_str}


consent_service = ConsentService()
