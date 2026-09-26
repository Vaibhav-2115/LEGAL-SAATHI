"""
Legal Saathi - Pipeline Orchestration (pipeline.py)
Orchestrates the complete evidence-grounded workflow:
Classify Intent -> Check Emergency -> Extract Entities -> Hybrid Retrieval -> Context Assembly ->
LLM Grounded Generation (Primary + Fallback) -> Citation & Confidence Scoring -> Suggested Action.
Per CORE-009 and Section 6.1 of the Technical Blueprint.
"""

from typing import List, Optional
import uuid

from backend.core.logging import logger
from backend.data.db import db
from backend.schemas.chat import ChatResponse, Citation, SuggestedAction
from backend.schemas.case import EvidenceItem
from backend.services.classifier import classifier
from backend.services.retrieval_service import retrieval_service
from backend.services.llm_provider import llm_provider
from backend.services.citation_service import citation_service
from backend.services.engine.extraction import extractor
from backend.services.engine.normalization import normalize_entities


class LegalSaathiPipeline:
    async def process_chat(
        self,
        text: str,
        session_id: str,
        case_id: Optional[str] = None,
        lang: str = "en"
    ) -> ChatResponse:
        """
        Executes the end-to-end Legal Saathi pipeline.
        """
        # Step 1: Intent & Urgency Classification
        classification = classifier.classify(text, lang=lang)
        logger.info(f"Classified query as '{classification.issue_type}' (Urgency: {classification.urgency})")

        # Step 2: Emergency Short-Circuit
        if classification.is_emergency:
            emergency_action = SuggestedAction(
                type="none",
                title="Immediate Police / Helpline Assistance",
                description=f"Call {classification.emergency_helpline or '112'} immediately for on-ground safety intervention."
            )
            return ChatResponse(
                answer=(
                    f"⚠️ **URGENT SAFETY ALERT**: Your query indicates an immediate emergency situation.\n\n"
                    f"**Emergency Action Required:**\n"
                    f"- Please dial **{classification.emergency_helpline or '112'}** right now.\n"
                    f"- If you are facing physical violence or illegal eviction in progress, request local police intervention immediately.\n"
                    f"- For cyber financial fraud, report immediately to **1930** within the Golden Hour to freeze bank accounts.\n"
                    f"- Legal Saathi strongly advises prioritizing personal safety over document preparation."
                ),
                citations=[],
                confidence="insufficient",
                suggested_action=emergency_action,
                session_id=session_id,
                case_id=case_id,
                issue_type=classification.issue_type,
                urgency="emergency"
            )

        # Step 3: Entity Extraction & Normalization
        extracted_entities = extractor.extract(text)
        normalized_entities = normalize_entities(extracted_entities)

        # Step 4: Persist or Update Case Record
        active_case_id = case_id or f"case_{uuid.uuid4().hex[:10]}"
        case_title = f"{classification.issue_type.replace('_', ' ').title()} - {normalized_entities.location or 'Grievance'}"
        
        # Check if existing case already has evidence
        existing_case = db.get_case(active_case_id) if case_id else None
        evidence_list = existing_case.evidence if existing_case else [
            EvidenceItem(type="document", description="Written contract, invoice, or agreement", status="needed"),
            EvidenceItem(type="receipt", description="Proof of payment or transaction receipt", status="needed"),
            EvidenceItem(type="message", description="Written communication / chat / email record", status="needed")
        ]

        saved_case = db.save_case(
            case_id=active_case_id,
            session_id=session_id,
            issue_type=classification.issue_type,
            title=case_title,
            description=text,
            entities=normalized_entities,
            evidence=evidence_list,
            consent_status=existing_case.consent_status if existing_case else "pending"
        )

        # Step 5: Hybrid Legal Retrieval (ChromaDB semantic + BM25 lexical + RRF)
        retrieved_chunks = retrieval_service.search(
            query=text,
            corpus="acts",
            top_k=5,
            issue_type_filter=classification.issue_type
        )

        # Step 6 & 7: LLM Grounded Generation (Gemini primary with local rule synthesis fallback)
        answer_text, provider = await llm_provider.generate_grounded_answer(
            query=text,
            context_chunks=retrieved_chunks,
            lang=lang
        )
        logger.info(f"Generated grounded answer using '{provider}'.")

        # Step 8: Citation Attachment & Confidence Scoring
        citations, confidence_badge = citation_service.attach_citations(
            answer=answer_text,
            retrieved_chunks=retrieved_chunks
        )

        # Step 9: Entitlement & Revenue Resolution
        user_id = db.get_or_create_session(session_id).get("user_id") or f"usr_{session_id}"
        is_pro = db.check_user_has_active_pro(user_id)
        user_tier = "pro" if is_pro else "civic"

        # Step 10: Action Routing with Pricing & Collective Pattern Detection
        suggested_action = self._determine_suggested_action(
            issue_type=classification.issue_type,
            case_id=active_case_id,
            user_id=user_id,
            location=normalized_entities.location,
            is_pro=is_pro
        )

        is_entitled = True if is_pro else (not suggested_action.is_premium)

        return ChatResponse(
            answer=answer_text,
            citations=citations,
            confidence=confidence_badge,
            suggested_action=suggested_action,
            session_id=session_id,
            case_id=active_case_id,
            issue_type=classification.issue_type,
            urgency=classification.urgency,
            user_tier=user_tier,
            is_entitled=is_entitled
        )

    def _determine_suggested_action(
        self,
        issue_type: str,
        case_id: str,
        user_id: Optional[str] = None,
        location: Optional[str] = None,
        is_pro: bool = False
    ) -> SuggestedAction:
        """
        Determines the most logical concrete next step based on the case type,
        incorporating collective action dockets and transparent monetization tiers.
        """
        # 1. Collective Pattern Detection: Check if active incident cluster matches
        if location:
            try:
                clusters = db.list_clusters()
                for cl in clusters:
                    if cl.get("issue_type") == issue_type and cl.get("member_count", 0) >= 2:
                        loc_bucket = cl.get("locality_bucket", "").lower()
                        if loc_bucket in location.lower() or location.lower() in loc_bucket:
                            cluster_id = cl["cluster_id"]
                            return SuggestedAction(
                                type="collective",
                                action_id=f"act_col_{cluster_id}",
                                title="Join Collective Action Docket (Shared Cost Pool)",
                                description=(
                                    f"Detected {cl['member_count']} similar complaints in {cl['locality_bucket']}. "
                                    f"Pledge ₹499 to join the group conciliation docket instead of individual lawyer expenses."
                                ),
                                endpoint="/api/v1/billing/collective/pledge",
                                payload={"cluster_id": cluster_id, "case_id": case_id},
                                is_premium=not is_pro,
                                cost_inr=0 if is_pro else 499,
                                entitlement_feature="collective_docket",
                                checkout_url=None if is_pro else f"/api/v1/billing/checkout?item_type=collective_docket&item_ref_id={cluster_id}"
                            )
            except Exception as e:
                logger.warning(f"Error checking collective cluster matching: {e}")

        # 2. Standard Issue-specific Action Routing
        if issue_type == "consumer":
            has_unlocked = is_pro or (bool(user_id) and db.check_user_has_unlocked_item(user_id, "notice_draft"))
            return SuggestedAction(
                type="notice",
                action_id=f"act_notice_{case_id}",
                title="Draft Formal Legal Notice to Merchant/Service Provider",
                description="Generate a cited statutory 15-day notice claiming deficiency of service under Consumer Protection Act.",
                endpoint="/api/v1/actions/notice",
                payload={"case_id": case_id, "issue_type": "consumer"},
                is_premium=not has_unlocked,
                cost_inr=0 if has_unlocked else 199,
                entitlement_feature="notice_draft",
                checkout_url=None if has_unlocked else f"/api/v1/billing/checkout?item_type=notice_draft&item_ref_id={case_id}"
            )
        elif issue_type == "property_rera":
            has_unlocked = is_pro or (bool(user_id) and db.check_user_has_unlocked_item(user_id, "notice_draft"))
            return SuggestedAction(
                type="notice",
                action_id=f"act_notice_{case_id}",
                title="Draft Statutory RERA Delay Demand Notice",
                description="Demand refund with prescribed interest or immediate completion under RERA Section 18.",
                endpoint="/api/v1/actions/notice",
                payload={"case_id": case_id, "issue_type": "property_rera"},
                is_premium=not has_unlocked,
                cost_inr=0 if has_unlocked else 199,
                entitlement_feature="notice_draft",
                checkout_url=None if has_unlocked else f"/api/v1/billing/checkout?item_type=notice_draft&item_ref_id={case_id}"
            )
        elif issue_type == "tenancy":
            return SuggestedAction(
                type="checklist",
                action_id=f"act_checklist_{case_id}",
                title="Generate Tenant Protection Evidence Checklist",
                description="Check needed proof to resist illegal lockout, power cuts, or security deposit withholding.",
                endpoint="/api/v1/actions/checklist",
                payload={"case_id": case_id, "issue_type": "tenancy"},
                is_premium=False,
                cost_inr=0
            )
        elif issue_type == "rti":
            has_unlocked = is_pro or (bool(user_id) and db.check_user_has_unlocked_item(user_id, "rti_draft"))
            return SuggestedAction(
                type="rti",
                action_id=f"act_rti_{case_id}",
                title="Prepare Formal RTI Section 6(1) Application",
                description="Draft targeted questions to the Public Information Officer (PIO) with fee exemption guidelines.",
                endpoint="/api/v1/actions/rti",
                payload={"case_id": case_id},
                is_premium=not has_unlocked,
                cost_inr=0 if has_unlocked else 199,
                entitlement_feature="rti_draft",
                checkout_url=None if has_unlocked else f"/api/v1/billing/checkout?item_type=rti_draft&item_ref_id={case_id}"
            )
        elif issue_type == "cyber_fraud":
            has_unlocked = is_pro or (bool(user_id) and db.check_user_has_unlocked_item(user_id, "efir_draft"))
            return SuggestedAction(
                type="efir",
                action_id=f"act_efir_{case_id}",
                title="e-FIR & Cyber Incident Guidance",
                description="Steps to freeze fraudulent UPI/bank transfers via helpline 1930 & cybercrime.gov.in.",
                endpoint="/api/v1/actions/efir",
                payload={"case_id": case_id},
                is_premium=not has_unlocked,
                cost_inr=0 if has_unlocked else 199,
                entitlement_feature="efir_draft",
                checkout_url=None if has_unlocked else f"/api/v1/billing/checkout?item_type=efir_draft&item_ref_id={case_id}"
            )
        else:
            return SuggestedAction(
                type="dlsa",
                action_id=f"act_dlsa_{case_id}",
                title="Locate Free Legal Aid (DLSA)",
                description="Check eligibility for free government legal representation under Section 12 of LSAA.",
                endpoint="/api/v1/actions/dlsa",
                payload={"case_id": case_id},
                is_premium=False,
                cost_inr=0
            )


pipeline = LegalSaathiPipeline()
