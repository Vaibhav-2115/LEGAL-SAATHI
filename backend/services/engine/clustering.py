"""
Legal Saathi Engine - Clustering & Explanation (clustering.py)
Clusters consented incidents into collective action groups and provides
transparent explanations for why incidents were grouped together.
Per Section 8.6 & 8.7 of the Technical Blueprint.
"""

from collections import defaultdict
from typing import Any, Dict, List, Tuple
import uuid

from backend.data.db import db
from backend.schemas.clustering import ClusterGroup, ClusterRunResponse
from backend.services.engine.similarity import compute_pairwise_similarity


class LegalSaathiEngine:
    def find_similar_incidents(
        self,
        target_incident: Dict[str, Any],
        threshold: float = 0.60
    ) -> List[Dict[str, Any]]:
        """
        Finds all consented incidents similar to the target incident above a similarity threshold.
        Applies coarse filtering by issue type / locality first before computing pairwise score.
        """
        all_incidents = db.list_consented_incidents(issue_type=target_incident.get("issue_type"))
        matches = []

        for inc in all_incidents:
            if inc["incident_id"] == target_incident.get("incident_id"):
                continue  # Skip comparing against itself
            
            score, matched_fields, explanation = compute_pairwise_similarity(target_incident, inc)
            if score >= threshold:
                matches.append({
                    "incident_id": inc["incident_id"],
                    "similarity_score": score,
                    "explanation": explanation,
                    "matched_fields": matched_fields,
                    "locality_bucket": inc.get("locality_bucket", ""),
                    "issue_type": inc.get("issue_type", ""),
                    "amount_bucket": inc.get("amount_bucket", "")
                })

        # Sort highest similarity first
        matches.sort(key=lambda x: x["similarity_score"], reverse=True)
        return matches

    def run_clustering(
        self,
        scope: str = "all",
        min_similarity: float = 0.70,
        min_cluster_size: int = 2
    ) -> ClusterRunResponse:
        """
        Runs graph connected-components clustering across consented incidents.
        Creates Cluster rows and links incidents.
        """
        incidents = db.list_consented_incidents(issue_type=scope if scope != "all" else None)
        if len(incidents) < min_cluster_size:
            return ClusterRunResponse(
                clusters=[],
                total_clusters=0,
                clustered_incidents_count=0,
                timestamp=""
            )

        # Build adjacency graph
        adj = defaultdict(list)
        explanations = {}

        for i in range(len(incidents)):
            for j in range(i + 1, len(incidents)):
                score, fields, expl = compute_pairwise_similarity(incidents[i], incidents[j])
                if score >= min_similarity:
                    id_a = incidents[i]["incident_id"]
                    id_b = incidents[j]["incident_id"]
                    adj[id_a].append(id_b)
                    adj[id_b].append(id_a)
                    explanations[(id_a, id_b)] = expl

        # Find Connected Components (Clusters)
        visited = set()
        clusters_formed: List[ClusterGroup] = []
        total_clustered = 0

        for inc in incidents:
            inc_id = inc["incident_id"]
            if inc_id not in visited and inc_id in adj:
                # Traverse component
                component = []
                queue = [inc_id]
                visited.add(inc_id)

                while queue:
                    curr = queue.pop(0)
                    component.append(curr)
                    for neighbor in adj[curr]:
                        if neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)

                if len(component) >= min_cluster_size:
                    cluster_id = f"clust_{uuid.uuid4().hex[:10]}"
                    lead_inc = next(item for item in incidents if item["incident_id"] == component[0])
                    
                    explanation_text = (
                        f"{len(component)} citizens in {lead_inc.get('locality_bucket', 'your area')} "
                        f"have reported similar issues with {lead_inc.get('issue_type', 'legal disputes').replace('_', ' ')}."
                    )

                    saved = db.save_cluster(
                        cluster_id=cluster_id,
                        issue_type=lead_inc.get("issue_type", "general"),
                        locality_bucket=lead_inc.get("locality_bucket", "General"),
                        explanation_text=explanation_text,
                        incident_ids=component
                    )

                    clusters_formed.append(
                        ClusterGroup(
                            cluster_id=cluster_id,
                            issue_type=saved["issue_type"],
                            locality_bucket=saved["locality_bucket"],
                            explanation_text=saved["explanation_text"],
                            member_count=saved["member_count"],
                            incident_ids=component,
                            created_at=saved["created_at"],
                            status="active"
                        )
                    )
                    total_clustered += len(component)

        from datetime import datetime, timezone
        return ClusterRunResponse(
            clusters=clusters_formed,
            total_clusters=len(clusters_formed),
            clustered_incidents_count=total_clustered,
            timestamp=datetime.now(timezone.utc).isoformat()
        )


engine = LegalSaathiEngine()
