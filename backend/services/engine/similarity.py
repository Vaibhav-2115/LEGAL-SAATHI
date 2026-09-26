"""
Legal Saathi Engine - Similarity Scoring (similarity.py)
Calculates multi-signal similarity between incident pairs combining
structured categorical fields and semantic grievance overlap.
Per Section 8.4 of the Technical Blueprint.
"""

from typing import Any, Dict, List, Tuple


def compute_pairwise_similarity(
    inc_a: Dict[str, Any],
    inc_b: Dict[str, Any]
) -> Tuple[float, List[str], str]:
    """
    Computes pairwise similarity between two incidents.
    Returns: (score, matched_fields, explanation)
    """
    matched_fields: List[str] = []
    score: float = 0.0

    # 1. Opposing Party Match (High Weight: 40%)
    hash_a = inc_a.get("opposing_party_hash")
    hash_b = inc_b.get("opposing_party_hash")
    if hash_a and hash_b and hash_a != "hash_unspecified" and hash_a == hash_b:
        score += 0.40
        matched_fields.append("opposing_party")

    # 2. Locality Bucket Match (Weight: 25%)
    loc_a = inc_a.get("locality_bucket")
    loc_b = inc_b.get("locality_bucket")
    if loc_a and loc_b and loc_a != "General / Unspecified Region" and loc_a == loc_b:
        score += 0.25
        matched_fields.append("locality")

    # 3. Issue Type Match (Weight: 20%)
    type_a = inc_a.get("issue_type")
    type_b = inc_b.get("issue_type")
    if type_a and type_b and type_a == type_b:
        score += 0.20
        matched_fields.append("issue_type")

    # 4. Amount Bucket Match (Weight: 10%)
    amt_a = inc_a.get("amount_bucket")
    amt_b = inc_b.get("amount_bucket")
    if amt_a and amt_b and amt_a != "Not Specified" and amt_a == amt_b:
        score += 0.10
        matched_fields.append("amount_bracket")

    # 5. Base overlap bonus for multiple aligned signals
    if len(matched_fields) >= 3:
        score += 0.05

    score = min(1.0, round(score, 2))

    # Generate Human-Readable Explanation
    parts = []
    if "opposing_party" in matched_fields:
        parts.append("reports grievance against the same opposing entity")
    if "locality" in matched_fields:
        parts.append(f"in the same locality ({loc_a})")
    if "issue_type" in matched_fields:
        parts.append(f"involving {type_a.replace('_', ' ')}")
    if "amount_bracket" in matched_fields:
        parts.append(f"within the same financial range ({amt_a})")

    explanation = "Similar case that " + ", ".join(parts) if parts else "Partial overlap in legal domain."
    return score, matched_fields, explanation
