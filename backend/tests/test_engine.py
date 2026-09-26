"""Tests for Legal Saathi Engine (/incidents, /incidents/{id}/similar, /clustering/run)."""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_engine_incident_similarity_and_clustering():
    # 1. Create two cases with identical builder in Greater Noida
    case_1_payload = {
        "issue_type": "property_rera",
        "title": "Supertech delay tower B",
        "description": "Builder Supertech has not delivered flat possession since 2 years in Greater Noida.",
        "entities": {
            "opposing_party": "Supertech Builders",
            "location": "Greater Noida",
            "amount": 4500000
        }
    }
    resp1 = client.post("/cases", json=case_1_payload)
    case_1_id = resp1.json()["case_id"]

    case_2_payload = {
        "issue_type": "property_rera",
        "title": "Supertech delay tower C",
        "description": "Supertech failed to hand over apartment possession in Greater Noida sector 1.",
        "entities": {
            "opposing_party": "Supertech Builders",
            "location": "Greater Noida",
            "amount": 5000000
        }
    }
    resp2 = client.post("/cases", json=case_2_payload)
    case_2_id = resp2.json()["case_id"]

    # 2. Submit both cases as consented Incidents
    inc1 = client.post("/incidents", json={"case_id": case_1_id, "consent_flag": True})
    assert inc1.status_code == 200
    inc_1_id = inc1.json()["incident_id"]

    inc2 = client.post("/incidents", json={"case_id": case_2_id, "consent_flag": True})
    assert inc2.status_code == 200
    inc_2_id = inc2.json()["incident_id"]

    # 3. Check similarity endpoint
    sim_resp = client.get(f"/incidents/{inc_1_id}/similar")
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert len(sim_data["similar"]) >= 1
    target_match = next((m for m in sim_data["similar"] if m["incident_id"] == inc_2_id), None)
    assert target_match is not None
    assert target_match["similarity_score"] >= 0.70
    assert "opposing_party" in target_match["matched_fields"]
    assert "locality" in target_match["matched_fields"]

    # 4. Trigger Clustering
    clust_resp = client.post("/clustering/run", json={"min_similarity": 0.65, "min_cluster_size": 2})
    assert clust_resp.status_code == 200
    clust_data = clust_resp.json()
    assert clust_data["total_clusters"] >= 1
    assert clust_data["clustered_incidents_count"] >= 2
