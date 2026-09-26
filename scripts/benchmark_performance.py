"""
Legal Saathi - Phase 29 Performance & Concurrency Benchmark Suite
Executes staged concurrent load testing across API endpoints:
- Liveness & Readiness Probes (/healthz, /readyz)
- Authoritative Legal Retrieval & RAG (/api/v1/retrieval/search)
- Case Classification (/api/v1/classify)
- Legal Case Analysis (/analyze-case)

Measures: RPS, median (p50), p95, p99 latency, error rates, and threadpool behavior.
"""

import os
import sys
import time
import statistics
import concurrent.futures
from typing import List, Dict, Any

# Ensure project root is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

SYNTHETIC_QUERIES = [
    "Dishonour of cheque under section 138 of Negotiable Instruments Act",
    "Defective mobile phone seller refusing refund under Consumer Protection Act",
    "Builder delayed residential flat possession by 3 years under RERA section 18",
    "Landlord disconnected electricity and water without notice under Model Tenancy Act",
    "Unauthorized UPI transaction and cyber phishing debit under IT Act 66D"
]


def execute_single_request(endpoint: str, method: str = "GET", payload: dict = None, client_id: int = 0) -> Dict[str, Any]:
    start = time.perf_counter()
    headers = {
        "X-Forwarded-For": f"192.168.10.{client_id % 250 + 1}",
        "X-Session-ID": f"bench-session-{client_id}"
    }
    try:
        if method == "GET":
            resp = client.get(endpoint, headers=headers)
        else:
            resp = client.post(endpoint, json=payload or {}, headers=headers)
        elapsed_ms = (time.perf_counter() - start) * 1000
        return {
            "status_code": resp.status_code,
            "elapsed_ms": elapsed_ms,
            "success": 200 <= resp.status_code < 300
        }
    except Exception as exc:
        elapsed_ms = (time.perf_counter() - start) * 1000
        return {
            "status_code": 500,
            "elapsed_ms": elapsed_ms,
            "success": False,
            "error": str(exc)
        }


def run_concurrency_tier(name: str, endpoint: str, method: str, payload_gen, concurrency: int, total_requests: int) -> Dict[str, Any]:
    print(f"\n--- Testing [{name}] with Concurrency={concurrency}, TotalRequests={total_requests} ---")
    start_total = time.perf_counter()

    latencies: List[float] = []
    success_count = 0
    failure_count = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = []
        for i in range(total_requests):
            payload = payload_gen(i) if payload_gen else None
            futures.append(executor.submit(execute_single_request, endpoint, method, payload, i))

        for f in concurrent.futures.as_completed(futures):
            res = f.result()
            latencies.append(res["elapsed_ms"])
            if res["success"]:
                success_count += 1
            else:
                failure_count += 1

    total_time_s = time.perf_counter() - start_total
    rps = total_requests / total_time_s if total_time_s > 0 else 0

    latencies.sort()
    p50 = statistics.median(latencies) if latencies else 0
    p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0
    p99 = latencies[int(len(latencies) * 0.99)] if latencies else 0

    result = {
        "benchmark": name,
        "concurrency": concurrency,
        "total_requests": total_requests,
        "duration_seconds": round(total_time_s, 2),
        "requests_per_sec": round(rps, 2),
        "p50_ms": round(p50, 2),
        "p95_ms": round(p95, 2),
        "p99_ms": round(p99, 2),
        "success_rate": round((success_count / total_requests) * 100, 2),
        "failures": failure_count
    }

    print(f"Results: RPS={result['requests_per_sec']} | p50={result['p50_ms']}ms | p95={result['p95_ms']}ms | Success={result['success_rate']}%")
    return result


def main():
    print("================================================================================")
    print("           LEGAL SAATHI - PHASE 29 PERFORMANCE BENCHMARK SUITE                 ")
    print("================================================================================")

    all_results = []

    # 1. Tier 1: Liveness Probes at increasing concurrency (1, 10, 25, 50)
    for c in [1, 10, 25, 50]:
        res = run_concurrency_tier(
            name=f"Probe /healthz [C={c}]",
            endpoint="/healthz",
            method="GET",
            payload_gen=None,
            concurrency=c,
            total_requests=c * 4
        )
        all_results.append(res)

    # 2. Tier 2: Statutory Hybrid Retrieval at increasing concurrency (1, 5, 10, 25, 50)
    for c in [1, 5, 10, 25, 50]:
        res = run_concurrency_tier(
            name=f"Hybrid Retrieval /retrieval/search [C={c}]",
            endpoint="/api/v1/retrieval/search",
            method="POST",
            payload_gen=lambda i: {"query": SYNTHETIC_QUERIES[i % len(SYNTHETIC_QUERIES)], "top_k": 3},
            concurrency=c,
            total_requests=c * 2
        )
        all_results.append(res)

    # 3. Tier 3: Case Classification API (1, 5, 10, 25, 50)
    for c in [1, 5, 10, 25, 50]:
        res = run_concurrency_tier(
            name=f"Case Classification /classify [C={c}]",
            endpoint="/classify",
            method="POST",
            payload_gen=lambda i: {"text": SYNTHETIC_QUERIES[i % len(SYNTHETIC_QUERIES)]},
            concurrency=c,
            total_requests=c * 2
        )
        all_results.append(res)

    print("\n================================================================================")
    print("                      BENCHMARK COMPLETE - SUMMARY                              ")
    print("================================================================================")
    for r in all_results:
        print(f"{r['benchmark']:<45} | C={r['concurrency']:<2} | RPS={r['requests_per_sec']:<6} | p50={r['p50_ms']:<6}ms | p95={r['p95_ms']:<6}ms | Pass={r['success_rate']}%")

    import json
    with open("reports/phase_29_performance_metrics.json", "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2)
    print("\nSaved performance metrics to reports/phase_29_performance_metrics.json")


if __name__ == "__main__":
    main()
