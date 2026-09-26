"""
Legal Saathi - LoRA Adapter & Inference Engine Validation Script
Validates weight loading, memory consumption, template adherence, and output structuring.
"""

from pathlib import Path
import psutil
import sys
import time

# Configure UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from model_runner import IndianLegalModelRunner

ADAPTER_DIR = Path(__file__).resolve().parent / "indian_legal_llama_lora"


def get_ram_mb() -> float:
    """Returns current process RAM usage in MB."""
    process = psutil.Process()
    return process.memory_info().rss / (1024 * 1024)


def validate_adapter_files():
    print("[1/4] Auditing Adapter File Integrity...")
    required_files = [
        "adapter_config.json",
        "adapter_model.safetensors",
        "tokenizer.json",
        "tokenizer_config.json",
    ]
    for rf in required_files:
        p = ADAPTER_DIR / rf
        assert p.exists(), f"Missing required file: {rf}"
        print(f"  * {rf:<26}: {p.stat().st_size / 1024:>10.1f} KB [OK]")
    print("  -> All LoRA adapter artifacts verified.\n")


def validate_inference():
    print("[2/4] Measuring Memory & Mounting LoRA Model...")
    ram_before = get_ram_mb()

    start_time = time.time()
    runner = IndianLegalModelRunner.get_instance()
    ram_after = get_ram_mb()

    print(f"  * RAM Before Load : {ram_before:.1f} MB")
    print(f"  * RAM After Load  : {ram_after:.1f} MB")
    print(f"  * Model RAM Delta : {ram_after - ram_before:.1f} MB")
    print(f"  * Device Used     : {runner.device.upper()}")
    print(f"  * Load Time       : {time.time() - start_time:.2f}s")
    assert runner.is_ready, "Model runner failed to initialize."
    print("  -> Adapter mounted without memory errors.\n")

    print("[3/4] Running Structured Case Inference Test...")
    test_case = (
        "Punjab National Bank vs M/s Modern Mills. Cheque dishonour under Section 138 of the "
        "Negotiable Instruments Act, 1881. Statutory notice served within 30 days. No payment made."
    )
    res = runner.analyze_case(test_case, max_new_tokens=60, temperature=0.2)

    print("\n--- Output Verification ---")
    print(f"Core Dispute : {res['core_dispute']}")
    print(f"Detected Laws: {res['relevant_laws']}")
    print(f"Findings     : {res['findings']}")
    print(f"Tokens Gen   : {res['tokens_generated']} in {res['generation_time_seconds']}s")

    assert res["core_dispute"], "core_dispute must not be empty"
    assert isinstance(res["relevant_laws"], list), "relevant_laws must be a list"
    assert len(res["relevant_laws"]) > 0, "relevant_laws should detect Section 138 / NI Act"
    assert res["findings"], "findings must not be empty"
    print("\n[4/4] Output Schema & Assertions: ALL PASSED!")


if __name__ == "__main__":
    print("=================================================================")
    print(">> Legal Saathi: LoRA Adapter Validation Suite")
    print("=================================================================\n")
    validate_adapter_files()
    validate_inference()
    print("\n>> VALIDATION COMPLETE: LoRA Model & Inference Engine 100% Operational!")
