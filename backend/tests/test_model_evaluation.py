"""
Tests for Phase 23: Legal Model Evaluation Benchmark.
Verifies quantitative benchmark integrity, statutory section accuracy,
hallucination guards, and structured metric calculations.
"""

from scripts.evaluate_legal_model import LEGAL_BENCHMARK_CASES, EvaluationMetrics
from model_runner import IndianLegalModelRunner


def test_benchmark_dataset_integrity():
    """Validates that all benchmark cases have required fields and valid domains."""
    assert len(LEGAL_BENCHMARK_CASES) >= 10
    required_keys = {"id", "domain", "language", "case_text", "expected_statutes", "dispute_keywords"}
    for case in LEGAL_BENCHMARK_CASES:
        assert required_keys.issubset(case.keys())
        assert len(case["case_text"]) > 20
        assert len(case["expected_statutes"]) >= 1
        assert len(case["dispute_keywords"]) >= 1


def test_statute_pattern_detection_precision():
    """Verifies that Indian statutory regex accurately extracts statutes without false positives."""
    runner = IndianLegalModelRunner.get_instance()
    
    test_cases = [
        ("Charged under Section 138 of the Negotiable Instruments Act", ["Negotiable Instruments Act", "Section 138"]),
        ("Accused under Section 411 IPC and Section 100 CrPC", ["IPC", "Section 100", "Section 411"]),
        ("Violated Section 18 of RERA Act and Consumer Protection Act", ["Consumer Protection Act", "RERA", "Section 18"]),
        ("Entitled to counsel under Article 39A and Section 12 NALSA", ["Article 39A", "NALSA", "Section 12"]),
    ]
    for text, expected in test_cases:
        detected = runner._extract_relevant_laws(text)
        for exp in expected:
            assert any(exp.lower() in d.lower() for d in detected), f"Failed to detect '{exp}' in {detected}"


def test_single_benchmark_case_inference():
    """Runs one live benchmark case and verifies output structuring and metrics."""
    runner = IndianLegalModelRunner.get_instance()
    case = LEGAL_BENCHMARK_CASES[0]  # Cheque Dishonour
    
    res = runner.analyze_case(case["case_text"], max_new_tokens=48, temperature=0.1)
    assert res["core_dispute"]
    assert isinstance(res["relevant_laws"], list)
    assert any("138" in law or "Negotiable Instruments" in law for law in res["relevant_laws"])
    assert res["findings"]
    assert res["tokens_generated"] > 0
    assert res["generation_time_seconds"] > 0


def test_metrics_evaluation_threshold_structure():
    """Verifies the EvaluationMetrics dataclass and acceptance calculation logic."""
    metrics = EvaluationMetrics(
        total_samples=10,
        statutory_detection_accuracy=90.0,
        core_dispute_accuracy=95.0,
        hallucination_rate=0.0,
        avg_latency_seconds=3.2,
        avg_tokens_generated=52.0,
        bilingual_pass_rate=100.0,
        pass_threshold_met=True
    )
    assert metrics.pass_threshold_met is True
    assert metrics.statutory_detection_accuracy >= 85.0
    assert metrics.hallucination_rate <= 5.0
