"""Legal Saathi Engine Package."""
from .extraction import extractor, EntityExtractor
from .normalization import normalize_entities, bucket_amount, bucket_locality, hash_opposing_party
from .similarity import compute_pairwise_similarity
from .clustering import engine, LegalSaathiEngine
from .consent import consent_service, ConsentService

__all__ = [
    "extractor", "EntityExtractor",
    "normalize_entities", "bucket_amount", "bucket_locality", "hash_opposing_party",
    "compute_pairwise_similarity",
    "engine", "LegalSaathiEngine",
    "consent_service", "ConsentService"
]
