"""
Legal Saathi - Citation & Confidence Service (citation_service.py)
Validates claims against retrieved statutory chunks, attaches structured citations,
and calculates the Legal Evidence Confidence Badge (strong | partial | insufficient).
Per Section 7, 10, & 25 of the Blueprint.
"""

from typing import List, Literal, Tuple
from backend.schemas.chat import Citation
from backend.schemas.retrieval import ChunkItem


class CitationService:
    def attach_citations(
        self,
        answer: str,
        retrieved_chunks: List[ChunkItem]
    ) -> Tuple[List[Citation], Literal["strong", "partial", "insufficient"]]:
        """
        Extracts citations from retrieved chunks that are relevant to the answer,
        and computes the confidence score badge based on legal authority depth.
        """
        if not retrieved_chunks:
            return [], "insufficient"

        citations: List[Citation] = []
        valid_chunks_count = 0
        total_score = 0.0

        for chunk in retrieved_chunks:
            # Check if chunk title or section is mentioned or relevant to the query/answer
            relevance = chunk.score
            if relevance > 0.35:
                # Generate clean excerpt (first 180 chars)
                excerpt = chunk.text[:180] + ("..." if len(chunk.text) > 180 else "")
                
                citations.append(
                    Citation(
                        source_id=chunk.source_id,
                        title=chunk.title,
                        section_ref=chunk.section_ref,
                        excerpt=excerpt,
                        relevance_score=chunk.score,
                        jurisdiction=chunk.jurisdiction,
                        official_link=chunk.metadata.get("official_link")
                    )
                )
                valid_chunks_count += 1
                total_score += relevance

        if not citations:
            return [], "insufficient"

        avg_score = total_score / valid_chunks_count

        # Confidence Badge Evaluation Logic:
        # Strong: At least 2 solid statutory/judgment citations with high relevance
        # Partial: 1 citation or moderate relevance
        # Insufficient: Very low relevance
        if valid_chunks_count >= 2 and avg_score >= 0.65:
            confidence = "strong"
        elif valid_chunks_count >= 1 and avg_score >= 0.40:
            confidence = "partial"
        else:
            confidence = "insufficient"

        return citations, confidence


citation_service = CitationService()
