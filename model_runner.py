"""
Legal Saathi - Indian Legal LLaMA LoRA Model Runner
Loads fine-tuned LLaMA-3.2-1B with local Indian Legal LoRA adapter, providing
GPU/CPU fallback and structured legal analysis extraction.
"""

import os
from pathlib import Path
import re
import sys
import time
from typing import Dict, List, Any, Optional

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

# Configure UTF-8 for Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Suppress Hugging Face symlink warnings on Windows
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_ADAPTER_DIR = BASE_DIR / "indian_legal_llama_lora"
DEFAULT_BASE_MODEL = "unsloth/Llama-3.2-1B-Instruct-bnb-4bit"

LEGAL_PROMPT_TEMPLATE = """Below is an Indian legal case excerpt. Analyze the issue and provide legal findings.

### Case Excerpt:
{case_text}

### Legal Analysis & Findings:
"""

# Regex patterns for detecting common Indian legal sections & acts
STATUTE_PATTERNS = [
    r"(?:Section|Sec\.?|u/s|U/S)\s+\d+[A-Za-z]*(?:\s*\([0-9a-zA-Z]+\))*",
    r"(?:IPC|Indian Penal Code|BNS|Bharatiya Nyaya Sanhita)",
    r"(?:CrPC|Code of Criminal Procedure|BNSS|Bharatiya Nagarik Suraksha Sanhita)",
    r"(?:Evidence Act|BSA|Bharatiya Sakshya Adhiniyam)",
    r"(?:Negotiable Instruments Act|NI Act)",
    r"(?:Legal Services Authorities Act|NALSA)",
    r"(?:Constitution of India|Article\s+\d+[A-Za-z]*)",
    r"(?:Consumer Protection Act)",
    r"(?:RERA|Real Estate \(Regulation and Development\) Act)",
    r"(?:Model Tenancy Act|Rent Control Act)",
    r"(?:Information Technology Act|IT Act)",
    r"(?:Specific Relief Act|Transfer of Property Act)",
]


class IndianLegalModelRunner:
    """Manages base LLaMA model loading, LoRA adapter mounting, and legal inference."""

    _instance: Optional["IndianLegalModelRunner"] = None

    def __init__(
        self,
        adapter_path: Optional[str] = None,
        base_model_name: Optional[str] = None,
        auto_load: bool = True,
    ):
        self.adapter_path = Path(adapter_path) if adapter_path else DEFAULT_ADAPTER_DIR
        self.base_model_name = base_model_name or DEFAULT_BASE_MODEL
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.tokenizer = None
        self.is_ready = False

        if auto_load:
            self.load()

    @classmethod
    def get_instance(cls) -> "IndianLegalModelRunner":
        """Singleton accessor for efficient API lifecycle."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load(self):
        """Loads base model with GPU/CPU fallback and mounts local LoRA adapter."""
        if self.is_ready:
            return

        print("=" * 65)
        print(">> Legal Saathi: Initializing Indian Legal Model Runner")
        print(f">> Device Selected : {self.device.upper()}")
        print(f">> Base Model Path : {self.base_model_name}")
        print(f">> LoRA Adapter Dir: {self.adapter_path}")
        print("=" * 65)

        start_t = time.time()

        # 1. Load Tokenizer directly from adapter directory
        print(">> [1/3] Loading Tokenizer...")
        self.tokenizer = AutoTokenizer.from_pretrained(
            str(self.adapter_path),
            use_fast=True,
            clean_up_tokenization_spaces=False,
        )
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        # 2. Load Base Model with device fallback
        print(f">> [2/3] Loading Base Model on {self.device.upper()}...")
        try:
            if self.device == "cuda":
                # GPU inference
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.base_model_name,
                    device_map="auto",
                    torch_dtype=torch.float16,
                )
            else:
                # CPU fallback
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.base_model_name,
                    device_map="cpu",
                    low_cpu_mem_usage=True,
                )
        except Exception as e:
            print(f"[WARN] Failed loading with initial config: {e}. Falling back to standard CPU mapping...")
            self.device = "cpu"
            self.model = AutoModelForCausalLM.from_pretrained(
                self.base_model_name,
                device_map="cpu",
            )

        # 3. Mount PEFT LoRA Adapter
        print(f">> [3/3] Mounting Local LoRA Adapter from {self.adapter_path.name}...")
        self.model = PeftModel.from_pretrained(
            self.model,
            str(self.adapter_path),
            is_trainable=False,
        )
        self.model.eval()
        self.is_ready = True

        elapsed = time.time() - start_t
        print(f">> LoRA Model Mounted & Ready in {elapsed:.2f}s!\n")

    def _extract_relevant_laws(self, text: str) -> List[str]:
        """Scans input text and model findings for cited Indian laws and sections."""
        laws = set()
        for pat in STATUTE_PATTERNS:
            matches = re.findall(pat, text, re.IGNORECASE)
            for m in matches:
                clean_m = m.strip()
                if clean_m:
                    laws.add(clean_m)
        return sorted(list(laws))

    def _parse_analysis_output(self, case_text: str, generated_text: str) -> Dict[str, Any]:
        """Splits output into structured sections: core dispute, relevant laws, findings."""
        # Detect relevant statutes across input excerpt and generated output
        combined_text = f"{case_text}\n{generated_text}"
        relevant_laws = self._extract_relevant_laws(combined_text)

        # Extract core dispute summary (first sentence/paragraph of input or output)
        lines = [line.strip() for line in case_text.splitlines() if line.strip()]
        core_dispute = lines[0] if lines else "Unspecified legal dispute"
        if len(core_dispute) > 300:
            core_dispute = core_dispute[:300].rsplit(" ", 1)[0] + "..."

        # Clean findings text
        clean_findings = generated_text.strip()
        if not clean_findings:
            clean_findings = "The model processed the case facts under applicable Indian statutory principles."

        return {
            "core_dispute": core_dispute,
            "relevant_laws": relevant_laws if relevant_laws else ["Indian Statutory Law (General)"],
            "findings": clean_findings,
            "raw_output": generated_text,
        }

    def analyze_case(
        self,
        case_text: str,
        max_new_tokens: int = 128,
        temperature: float = 0.2,
        top_p: float = 0.9,
    ) -> Dict[str, Any]:
        """Runs case text through the template and fine-tuned LoRA model."""
        if not self.is_ready:
            self.load()

        formatted_prompt = LEGAL_PROMPT_TEMPLATE.format(case_text=case_text.strip())
        inputs = self.tokenizer(formatted_prompt, return_tensors="pt").to(self.model.device)

        start_gen = time.time()
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=temperature if temperature > 0 else 0.01,
                top_p=top_p,
                do_sample=(temperature > 0.05),
                repetition_penalty=1.15,
                pad_token_id=self.tokenizer.pad_token_id,
            )

        gen_time = time.time() - start_gen

        # Extract newly generated tokens only
        prompt_len = inputs["input_ids"].shape[1]
        new_tokens = outputs[0][prompt_len:]
        generated_text = self.tokenizer.decode(new_tokens, skip_special_tokens=True).strip()

        # Parse into structured components
        structured = self._parse_analysis_output(case_text, generated_text)
        structured["device_used"] = str(self.model.device)
        structured["generation_time_seconds"] = round(gen_time, 2)
        structured["tokens_generated"] = len(new_tokens)

        return structured


if __name__ == "__main__":
    runner = IndianLegalModelRunner.get_instance()
    sample_case = (
        "State of Maharashtra vs Suresh. The police seized counterfeit currency notes from the possession of "
        "the accused. Charged under Section 489C of the Indian Penal Code (IPC). Accused claims lack of knowledge."
    )
    print("\n[Running Sample Inference Test...]")
    result = runner.analyze_case(sample_case, max_new_tokens=60)
    print("\n--- STRUCTURED RESULT ---")
    import json
    print(json.dumps(result, indent=2))
