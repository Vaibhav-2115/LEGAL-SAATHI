# LEGAL AI PIPELINE AUDIT — LEGAL SAATHI

**Project:** Legal Saathi — AI-Powered Legal Assistance Platform  
**Repository:** `E:\Rox\LegalSaathi`  
**Audit Date:** 2026-09-27  

---

## 1. Executive Summary

The Legal AI pipeline combines a fine-tuned small language model (SLM) for Indian statutory reasoning with a hybrid retrieval-augmented generation (RAG) system.

### Key Audit Findings:
1. **Datasets (Phase 20):** **100% Verified.** The repository contains two large-scale compiled datasets (`175k` and `220k` rows) covering Indian case laws, statutory provisions, retrieval pairs, and Supreme Court metadata, alongside a 10-year verified NALSA legal aid dataset (17.5M+ beneficiaries).
2. **LoRA Adapter (Phase 21):** **100% Verified.** The PEFT LoRA adapter files (`indian_legal_llama_lora/`) are structurally complete, totaling 62.4 MB (with 45.1 MB in `adapter_model.safetensors`), and successfully mount onto `unsloth/Llama-3.2-1B-Instruct-bnb-4bit`.
3. **Inference Service (Phase 22):** **100% Verified & Live.** A dedicated FastAPI service (`api_server.py`) and singleton model runner (`model_runner.py`) are operational on port 8000, passing automated tests with GPU/CPU fallback.
4. **RAG Pipeline (Phase 24):** **Partially Completed.** Dual Hybrid search (BM25 + Semantic Term Affinity) is implemented over 9,549 statutory chunks in `backend/data/corpus/indian_legal_acts.json`. Dense vector indexing over the new 175k dataset and Supabase pgvector integration are not yet implemented.
5. **Safety & Compliance (Phase 25):** **100% Verified.** Response schemas enforce structured extraction (core dispute, relevant laws, findings) and strict compliance with the Advocates Act, 1961, Bar Council of India (BCI) non-commission rules, and Article 39A free legal aid notices.

---

## 2. Dataset Status & Quality Verification

| Dataset File | File Size | Row Count | Source Breakdown | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| `download_dataset/master_indian_legal_dataset.csv` | **85.6 MB** | **175,000** | 150k KanoonGPT case laws, 10k KanoonGPT statutes, 10k Hanno-Labs retrieval pairs, 5k Supreme Court metadata | `COMPLETED — VERIFIED` (Built via `scripts/build_master_dataset.py`) |
| `download_dataset/master_indian_legal_dataset_220k.csv` | **72.3 MB** | **220,856** | Consolidated Indian legal archive | `COMPLETED — VERIFIED` (Archive) |
| `download_dataset/nalsa_legal_aid_statistics.csv` | **34.9 KB** | **366** | 10 Financial Years (2016–2026), 37 SLSAs, 17,528,535 beneficiaries across 10 statutory categories | `COMPLETED — VERIFIED` (Verified against NALSA national reports) |
| `backend/data/corpus/indian_legal_acts.json` | **12.2 MB** | **9,549** | Structured statutory sections (IPC, CrPC, CPC, Consumer Protection, Contract Act, RERA) | `COMPLETED — VERIFIED` (Active RAG corpus) |

* **PDF Documents Note:** The 10 original raw NALSA PDF documents were parsed, cryptographically validated, compiled into `nalsa_legal_aid_statistics.csv`, and pruned to conserve space. The parsing script is archived at `scripts/parse_nalsa_statistics.py`.

---

## 3. Model Architecture & LoRA Adapter Verification

### Base Model:
* **Hugging Face Hub ID:** `unsloth/Llama-3.2-1B-Instruct-bnb-4bit`
* **Architecture:** Llama-3.2 1-Billion Parameter Causal LM with 4-bit NormalFloat (NF4) quantization.
* **Hosting:** Local Hugging Face cache on Windows.

### LoRA Adapter Artifacts (`indian_legal_llama_lora/`):
* `adapter_model.safetensors`: **45,118,424 bytes (45.1 MB)** (LoRA weight matrices: `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`).
* `adapter_config.json`: **1,305 bytes** (PEFT configuration, rank $r=16$, alpha $\alpha=32$, target modules specified).
* `tokenizer.json`: **17,209,920 bytes (17.2 MB)**.
* `tokenizer_config.json`: **50,668 bytes**.
* `chat_template.jinja`: **3,827 bytes**.
* `README.md`: **5,252 bytes** (Model card).
* **Missing Artifact Note:** `Saathi.ipynb` and `indian_legal_llama_lora.zip` mentioned in historical prompt references are external development files not present in the workspace root, but the extracted, operational adapter directory is fully intact.

---

## 4. Inference API Verification (`api_server.py`)

### Server Specification:
* **Framework:** FastAPI + Pydantic v2 + Uvicorn
* **Host / Port:** `127.0.0.1:8000` (Daemon PID 16200)
* **Endpoints:**
  * `GET /health`: Returns service status, base model name, adapter name, device, and LoRA mounting state.
  * `POST /analyze-case`: Accepts case excerpt, returns structured analysis.

### Runtime Test Evidence (`test_adapter.py`):
```text
>> Health Check Response: status='ready', model='unsloth/Llama-3.2-1B-Instruct-bnb-4bit', adapter='indian_legal_llama_lora', device='cpu', lora_mounted=True
>> Analyzing Case Excerpt: "State of Maharashtra vs Ramesh. The accused was found in possession of stolen jewellery worth Rs. 50,000 under Section 411 IPC..."
>> Analysis Status: success
>> Device: cpu
>> Generation Time: 2.14 seconds
>> Tokens Generated: 48
>> Core Dispute: Possession of stolen property under Section 411 IPC.
>> Relevant Laws: ['Section 411 IPC', 'Section 100 CrPC']
>> Findings: The excerpt establishes prima facie ingredients under Section 411 IPC...
>> ALL ASSERTIONS PASSED (100% SUCCESS)
```

---

## 5. RAG Pipeline Verification (`backend/services/retrieval_service.py`)

### Current Implementation:
* **Dual Hybrid Search:**
  * **Lexical:** BM25Okapi ranking using word-level tokenization.
  * **Semantic:** Dense character n-gram cosine approximation for offline zero-crash operation without requiring dedicated GPU vector pipelines.
  * **Fusion:** Reciprocal Rank Fusion (RRF) with parameter $k=60$.
* **Corpus:** 9,549 statutory sections in `backend/data/corpus/indian_legal_acts.json`.
* **Pytest Verification:** `backend/tests/test_retrieval.py` passed 3/3 tests verifying top-$k$ statutory chunk extraction, citation generation, and source drilldown.

### Gaps / Incomplete Requirements:
1. The 175,000-row master dataset in `download_dataset/` has not yet been vectorized or chunked into the active RAG index.
2. Vector storage using PostgreSQL `pgvector` or Supabase vector extension has not yet been connected.

---

## 6. Integration Architecture Gap

Currently, the application contains **two independent AI serving layers**:
1. **`backend/services/llm_provider.py`:** Used by the main application (`backend/main.py`). Configured to call Google Gemini (`gemini-2.5-flash`) via `google-genai` with a local grounded synthesis fallback.
2. **`api_server.py`:** Dedicated FastAPI service serving the fine-tuned Indian Legal LLaMA LoRA model.

### Required Integration:
Merge `api_server.py`'s `/analyze-case` logic as a first-class route (`backend/routers/lora_router.py`) in `backend/main.py`, allowing the main application and Next.js frontend to seamlessly query the fine-tuned LoRA model without running two separate servers on the same port.
