"""
Legal Saathi - Action Module: DLSA Legal Aid Guidance (dlsa.py)
Endpoint GET /actions/dlsa: Connects citizens to their District Legal Services Authority
for free government-appointed legal representation.
"""

from fastapi import APIRouter, Query
from backend.schemas.actions import DLSAGuidanceResponse

router = APIRouter(tags=["Action Modules"])


@router.get("/actions/dlsa", response_model=DLSAGuidanceResponse)
def get_dlsa_guidance(district: str = Query(default="Delhi Central"), state: str = Query(default="Delhi")):
    """
    Returns District Legal Services Authority (DLSA) details and statutory
    free legal aid eligibility criteria under Section 12 of LSAA, 1987.
    """
    clean_dist = district.title()
    clean_state = state.title()

    return DLSAGuidanceResponse(
        district=clean_dist,
        state=clean_state,
        dlsa_office_name=f"District Legal Services Authority ({clean_dist})",
        address=f"DLSA Office, District & Sessions Court Complex, {clean_dist}, {clean_state}",
        helpline_number="011-23385321 (or contact District Court Facilitation Desk)",
        national_legal_aid_tollfree="15100",
        eligibility_criteria=[
            "1. Women and Children (Automatic eligibility regardless of income under Sec 12(c)).",
            "2. Members of Scheduled Castes (SC) or Scheduled Tribes (ST).",
            "3. Persons with disabilities or mental health conditions.",
            "4. Industrial workmen or victims of mass disasters / human trafficking.",
            "5. Persons in judicial custody / undertrials.",
            "6. Any citizen whose annual income is less than ₹3,00,000 per annum (threshold varies by state)."
        ],
        services_offered=[
            "Free court-appointed Advocate for representation in District/High Court.",
            "Payment of court fees, drafting charges, process fees, and typing expenses.",
            "Pre-litigation mediation and settlement through Lok Adalat.",
            "Legal counsel and document drafting assistance."
        ],
        application_process=[
            "1. Visit the DLSA Front Office located inside your District Court premises.",
            "2. Fill simple Form-1 (or orally dictate to the Legal Aid Defense Counsel).",
            "3. Attach identity proof (Aadhaar/Voter ID) and income certificate/BPL card (if applicable).",
            "4. A legal aid panel advocate is assigned within 48 to 72 hours."
        ]
    )
