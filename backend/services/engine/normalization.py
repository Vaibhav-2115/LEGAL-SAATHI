"""
Legal Saathi Engine - Normalization & Privacy Bucketing (normalization.py)
Normalizes amounts into privacy-preserving buckets, localities into district zones,
and hashes opposing party identifiers using SHA-256.
Per Section 8.3 and SEC-008.
"""

import hashlib
import re
from typing import Optional
from backend.schemas.case import CaseEntities

SALT = "legal_saathi_privacy_salt_v1"


def bucket_amount(amount: Optional[float]) -> str:
    """
    Buckets exact rupee values into coarse ranges for privacy-safe comparison.
    Exact value is only ever displayed to the case's own author.
    """
    if amount is None or amount <= 0:
        return "Not Specified"
    if amount <= 5000:
        return "₹0–₹5,000"
    elif amount <= 25000:
        return "₹5,000–₹25,000"
    elif amount <= 100000:
        return "₹25,000–₹1,00,000"
    elif amount <= 500000:
        return "₹1,00,000–₹5,00,000"
    elif amount <= 2000000:
        return "₹5,00,000–₹20,00,000"
    else:
        return "₹20,00,000+"


def bucket_locality(location: Optional[str]) -> str:
    """
    Normalizes specific locations/colonies into coarse district or metropolitan regions.
    """
    if not location:
        return "General / Unspecified Region"
    
    clean = location.lower().strip()
    
    # Delhi NCR Buckets
    if re.search(r"noida|greater noida", clean):
        return "Noida / Greater Noida (UP)"
    elif re.search(r"gurgaon|gurugram", clean):
        return "Gurugram (Haryana)"
    elif re.search(r"delhi|new delhi", clean):
        return "Delhi NCT"
    elif re.search(r"faridabad", clean):
        return "Faridabad (Haryana)"
    elif re.search(r"ghaziabad", clean):
        return "Ghaziabad (UP)"
    
    # Other Major Metro Buckets
    elif re.search(r"bengaluru|bangalore|whitefield|koramangala|indiranagar", clean):
        return "Bengaluru Urban (Karnataka)"
    elif re.search(r"mumbai|thane|navi mumbai|bandra|andheri", clean):
        return "Mumbai Metropolitan Region (Maharashtra)"
    elif re.search(r"pune|hinjewadi|wakad|kothrud", clean):
        return "Pune District (Maharashtra)"
    elif re.search(r"hyderabad|secunderabad|cyberabad|gachibowli", clean):
        return "Hyderabad Urban (Telangana)"
    elif re.search(r"chennai", clean):
        return "Chennai Urban (Tamil Nadu)"
    elif re.search(r"kolkata", clean):
        return "Kolkata (West Bengal)"
    
    # Generic Capitalization
    return f"{location.title()} District"


def hash_opposing_party(party_name: Optional[str]) -> str:
    """
    Computes a deterministic SHA-256 salted hash of normalized opposing party name.
    Ensures that identical builder/company names match across cases without
    exposing names in unconsented cross-user queries.
    """
    if not party_name:
        return "hash_unspecified"
    
    # Normalize: lowercase, remove punctuation, strip common legal suffixes
    clean = party_name.lower().strip()
    clean = re.sub(r"\b(pvt|ltd|limited|private|llp|inc|corp|enterprises|builders|developers)\b", "", clean)
    clean = re.sub(r"[^\w\s]", "", clean)
    clean = " ".join(clean.split())
    
    salted = f"{clean}:{SALT}".encode("utf-8")
    return hashlib.sha256(salted).hexdigest()[:16]


def normalize_entities(entities: CaseEntities) -> CaseEntities:
    """
    Applies privacy bucketing and hashing to extracted entities.
    """
    entities.amount_bucket = bucket_amount(entities.amount)
    entities.locality_bucket = bucket_locality(entities.location)
    entities.opposing_party_hash = hash_opposing_party(entities.opposing_party)
    return entities
