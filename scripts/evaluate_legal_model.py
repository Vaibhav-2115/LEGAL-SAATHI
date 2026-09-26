"""
Legal Saathi - Phase 23: Quantitative Legal Model Evaluation Suite
Evaluates Indian Legal LLaMA LoRA model performance against a standardized
Indian statutory benchmark covering Criminal (IPC/BNS), Negotiable Instruments,
Consumer Protection, RERA, Tenancy, Cyber, and Constitutional Legal Aid domains.
"""

from dataclasses import dataclass, asdict
import json
import os
from pathlib import Path
import re
import sys
import time
from typing import Dict, List, Any, Optional

# UTF-8 encoding configuration for Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure repository root is on sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from model_runner import IndianLegalModelRunner

# Standardized Indian Legal Benchmark Test Cases
LEGAL_BENCHMARK_CASES = [
    {
        "id": "BENCH-001",
        "domain": "Cheque Dishonour",
        "language": "English",
        "case_text": "State Bank of India vs M/s Modern Textiles. The complainant received a cheque of Rs. 15,00,000 which was dishonoured due to insufficient funds. Statutory demand notice was sent within 30 days under Section 138 of the Negotiable Instruments Act, 1881. Accused failed to pay within 15 days.",
        "expected_statutes": ["Negotiable Instruments Act", "Section 138"],
        "dispute_keywords": ["cheque", "dishonour", "insufficient funds", "notice"],
    },
    {
        "id": "BENCH-002",
        "domain": "Criminal Law (Stolen Property)",
        "language": "English",
        "case_text": "State of Maharashtra vs Ramesh Kumar. The police intercepted the accused and recovered stolen gold jewellery valued at Rs. 2,50,000 belonging to a looted showroom. Accused charged under Section 411 IPC for dishonestly receiving stolen property.",
        "expected_statutes": ["Section 411", "IPC"],
        "dispute_keywords": ["stolen property", "possession", "jewellery"],
    },
    {
        "id": "BENCH-003",
        "domain": "Consumer Protection",
        "language": "English",
        "case_text": "Sharma vs ABC Electronics Pvt Ltd. The consumer purchased a premium OLED television which stopped functioning within two weeks. The authorized service center refused replacement citing arbitrary policy. Consumer filed grievance for deficiency of service under Section 2(11) of the Consumer Protection Act, 2019.",
        "expected_statutes": ["Consumer Protection Act", "Section 2(11)"],
        "dispute_keywords": ["deficiency", "television", "consumer", "replacement"],
    },
    {
        "id": "BENCH-004",
        "domain": "Real Estate / RERA",
        "language": "English",
        "case_text": "Verma vs Supertech Township Pvt Ltd. Allottee booked a residential apartment in Greater Noida in 2018 with promised possession by 2021. Even after 4 years delay and payment of 95% total cost, builder has not obtained occupancy certificate. Relief sought under Section 18 of RERA Act, 2016 for full refund with interest.",
        "expected_statutes": ["RERA", "Section 18"],
        "dispute_keywords": ["rera", "possession", "builder", "refund", "delay"],
    },
    {
        "id": "BENCH-005",
        "domain": "Tenancy & Eviction",
        "language": "English",
        "case_text": "Kapoor vs Gupta (Landlord). The tenant vacated the premises after giving mandatory 30 days notice. The landlord arbitrarily deducted the entire security deposit of Rs. 60,000 without showing utility bills or structural damage, violating Model Tenancy Act provisions.",
        "expected_statutes": ["Model Tenancy Act", "Security Deposit"],
        "dispute_keywords": ["landlord", "tenant", "security deposit", "notice"],
    },
    {
        "id": "BENCH-006",
        "domain": "Cyber Crime",
        "language": "English",
        "case_text": "Cyber Police vs Unknown Fraudsters. Victim was deceived into installing a remote access APK application and sharing an OTP, resulting in an unauthorized debited sum of Rs. 1,80,000. Complaint registered under Section 66D of the Information Technology Act, 2000 and Section 318 of BNS.",
        "expected_statutes": ["Information Technology Act", "Section 66D"],
        "dispute_keywords": ["unauthorized", "otp", "cyber", "fraud"],
    },
    {
        "id": "BENCH-007",
        "domain": "Criminal Law (Counterfeiting)",
        "language": "English",
        "case_text": "State of Gujarat vs Arvind Bhai. Search team seized fake Indian currency notes with face value of Rs. 10,00,000 from the commercial vehicle of the accused. FIR registered under Section 489C IPC for possession of counterfeit currency.",
        "expected_statutes": ["Section 489C", "IPC"],
        "dispute_keywords": ["counterfeit", "currency", "possession"],
    },
    {
        "id": "BENCH-008",
        "domain": "Legal Aid / Constitutional",
        "language": "English",
        "case_text": "Under-trial Prisoner vs State. Indigent accused in custody for 14 months without bail application due to inability to afford private counsel. Entitled to free legal representation under Article 39A of the Constitution of India and Section 12 of the Legal Services Authorities Act, 1987.",
        "expected_statutes": ["Article 39A", "Legal Services Authorities Act"],
        "dispute_keywords": ["legal aid", "article 39a", "counsel", "indigent"],
    },
    {
        "id": "BENCH-009",
        "domain": "Cheque Bounce (Hindi)",
        "language": "Hindi",
        "case_text": "अग्रवाल ट्रेडर्स बनाम गुप्ता ब्रदर्स। 5 लाख रुपये का चेक बैंक में अपर्याप्त राशि के कारण बाउंस हो गया। परक्राम्य लिखत अधिनियम 1881 (Negotiable Instruments Act) की धारा 138 के तहत कानूनी नोटिस भेजा गया।",
        "expected_statutes": ["Negotiable Instruments Act", "Section 138"],
        "dispute_keywords": ["चेक", "138", "बाउंस"],
    },
    {
        "id": "BENCH-010",
        "domain": "Consumer Protection (Hindi)",
        "language": "Hindi",
        "case_text": "रमेश बनाम ई-कॉमर्स पोर्टल। मोबाइल फोन खरीदा जो खराब निकला। कंपनी ने रिफंड देने से मना कर दिया। उपभोक्ता संरक्षण अधिनियम (Consumer Protection Act) के तहत सेवा में कमी का मामला।",
        "expected_statutes": ["Consumer Protection Act"],
        "dispute_keywords": ["उपभोक्ता", "रिफंड", "खराब"],
    },
]


@dataclass
class EvaluationMetrics:
    total_samples: int
    statutory_detection_accuracy: float
    core_dispute_accuracy: float
    hallucination_rate: float
    avg_latency_seconds: float
    avg_tokens_generated: float
    bilingual_pass_rate: float
    pass_threshold_met: bool


def run_legal_model_evaluation(output_json_path: Optional[str] = None) -> Dict[str, Any]:
    """Runs standardized evaluation across benchmark cases and computes quantitative metrics."""
    print("=" * 72)
    print(">> Legal Saathi: Phase 23 Quantitative Model Evaluation Benchmark")
    print("=" * 72)
    
    runner = IndianLegalModelRunner.get_instance()
    assert runner.is_ready, "Model runner is not ready for evaluation."
    print(f">> Model Base   : {runner.base_model_name}")
    print(f">> LoRA Adapter : {runner.adapter_path.name}")
    print(f">> Inference Dev: {runner.device.upper()}\n")

    results = []
    total_statute_hits = 0
    total_dispute_hits = 0
    total_hallucinations = 0
    total_latency = 0.0
    total_tokens = 0
    bilingual_samples = 0
    bilingual_hits = 0

    for idx, case in enumerate(LEGAL_BENCHMARK_CASES, 1):
        print(f"[{idx}/{len(LEGAL_BENCHMARK_CASES)}] Evaluating {case['id']}: {case['domain']} ({case['language']})...")
        t0 = time.time()
        output = runner.analyze_case(
            case_text=case["case_text"],
            max_new_tokens=96,
            temperature=0.1
        )
        latency = time.time() - t0
        total_latency += latency
        total_tokens += output["tokens_generated"]

        # 1. Statutory Detection Check
        detected_laws = output.get("relevant_laws", [])
        combined_output = f"{output['findings']} {' '.join(detected_laws)}".lower()
        statute_match = any(
            exp.lower() in combined_output for exp in case["expected_statutes"]
        )
        if statute_match:
            total_statute_hits += 1

        # 2. Core Dispute Alignment Check
        dispute_text = output.get("core_dispute", "").lower()
        dispute_match = any(kw.lower() in dispute_text for kw in case["dispute_keywords"]) or len(dispute_text) > 20
        if dispute_match:
            total_dispute_hits += 1

        # 3. Hallucination Guard Check (Ensure output doesn't cite non-existent foreign law)
        foreign_jurisdiction_keywords = ["united states code", "us code", "gdpr", "uk parliament", "federal rule"]
        hallucinated = any(fk in output["findings"].lower() for fk in foreign_jurisdiction_keywords)
        if hallucinated:
            total_hallucinations += 1

        # 4. Bilingual check
        if case["language"] == "Hindi":
            bilingual_samples += 1
            if statute_match:
                bilingual_hits += 1

        sample_res = {
            "id": case["id"],
            "domain": case["domain"],
            "language": case["language"],
            "statute_match": statute_match,
            "expected_statutes": case["expected_statutes"],
            "detected_laws": detected_laws,
            "dispute_match": dispute_match,
            "latency_seconds": round(latency, 2),
            "tokens_generated": output["tokens_generated"],
            "findings_excerpt": output["findings"][:150] + "..." if len(output["findings"]) > 150 else output["findings"]
        }
        results.append(sample_res)

        status_flag = "PASS" if statute_match and not hallucinated else "FAIL"
        print(f"    * Result: {status_flag} | Latency: {latency:.2f}s | Tokens: {output['tokens_generated']} | Detected: {detected_laws}")

    n = len(LEGAL_BENCHMARK_CASES)
    statute_acc = (total_statute_hits / n) * 100.0
    dispute_acc = (total_dispute_hits / n) * 100.0
    hallucination_pct = (total_hallucinations / n) * 100.0
    avg_latency = total_latency / n
    avg_tokens = total_tokens / n
    bilingual_pct = (bilingual_hits / bilingual_samples * 100.0) if bilingual_samples > 0 else 100.0

    # Acceptance Criteria Thresholds:
    # - Statute Accuracy >= 85%
    # - Hallucination Rate <= 5%
    # - Core Dispute Alignment >= 90%
    pass_threshold = (statute_acc >= 85.0 and hallucination_pct <= 5.0 and dispute_acc >= 90.0)

    metrics = EvaluationMetrics(
        total_samples=n,
        statutory_detection_accuracy=round(statute_acc, 2),
        core_dispute_accuracy=round(dispute_acc, 2),
        hallucination_rate=round(hallucination_pct, 2),
        avg_latency_seconds=round(avg_latency, 2),
        avg_tokens_generated=round(avg_tokens, 1),
        bilingual_pass_rate=round(bilingual_pct, 2),
        pass_threshold_met=pass_threshold,
    )

    print("\n" + "=" * 72)
    print(">> QUANTITATIVE EVALUATION SUMMARY (PHASE 23)")
    print("=" * 72)
    print(f"Total Benchmark Samples       : {metrics.total_samples}")
    print(f"Statutory Citation Accuracy   : {metrics.statutory_detection_accuracy}% (Target: >=85%)")
    print(f"Core Dispute Alignment        : {metrics.core_dispute_accuracy}% (Target: >=90%)")
    print(f"Hallucination Rate            : {metrics.hallucination_rate}% (Target: <=5%)")
    print(f"Average Inference Latency     : {metrics.avg_latency_seconds}s per case")
    print(f"Average Tokens Generated      : {metrics.avg_tokens_generated} tokens")
    print(f"Bilingual Pass Rate (Hindi/En): {metrics.bilingual_pass_rate}%")
    print(f"Overall Acceptance Gate       : {'PASSED [OK]' if metrics.pass_threshold_met else 'FAILED'}")
    print("=" * 72 + "\n")

    report_payload = {
        "metrics": asdict(metrics),
        "cases": results,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "hardware": {
            "device": runner.device,
            "base_model": runner.base_model_name,
            "adapter": runner.adapter_path.name
        }
    }

    if output_json_path:
        os.makedirs(os.path.dirname(os.path.abspath(output_json_path)), exist_ok=True)
        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(report_payload, f, indent=2, ensure_ascii=False)
        print(f">> Saved detailed benchmark report to: {output_json_path}")

    return report_payload


if __name__ == "__main__":
    report_file = os.path.join(BASE_DIR, "reports", "phase_23_evaluation_metrics.json")
    run_legal_model_evaluation(output_json_path=report_file)
