# Backend Architecture — Legal Saathi

**Document Version:** 1.0.0  
**Project:** Legal Saathi (AI-Powered Indian Legal Assistance Platform)  
**Backend Framework:** FastAPI 0.110+ on Python 3.11+  
**Database:** Supabase Cloud PostgreSQL 17.6 with Connection Pooling  
**Last Updated:** September 2026  
**Status:** Implemented & Verified in Production  

---

## 1. Backend Directory Layout & Module Structure

```
backend/
├── core/
│   ├── auth.py                  # JWT decoding, session resolution, case ownership enforcement
│   ├── config.py                # Pydantic BaseSettings, absolute .env path resolution
│   ├── logging.py               # Structured production logger with log rotation
│   └── errors.py                # Centralized exception handlers & Part 7 error formats
├── routers/
│   ├── chat.py                  # POST /chat citizen question answering endpoint
│   ├── cases.py                 # GET/POST /cases dossier and docket operations
│   ├── classify.py              # POST /classify domain & urgency classification
│   ├── retrieval.py             # GET /retrieval/search hybrid statutory search
│   ├── sources.py               # GET /sources bare acts and judgments exploration
│   ├── incidents.py             # Incident logging and clustering engine
│   ├── clustering.py            # Ekjut collective action cluster endpoints
│   ├── voice.py                 # Voice audio transcription & Whisper routing
│   ├── health.py                # GET /health system & database readiness checks
│   ├── billing.py               # Micro-tier transactions and DLSA fee waivers
│   ├── lora.py                  # LoRA model inference & adapter status
│   └── actions/
│       ├── __init__.py          # Consolidated actions sub-router
│       ├── notice.py            # Legal notice parameters, preview, AI edits, and persistence
│       ├── rti.py               # Section 6(1) RTI application generator
│       ├── efir.py              # e-FIR guidance and state police portal routing
│       ├── dlsa.py              # Pro-bono legal aid eligibility and referral
│       └── checklist.py         # Evidence proof checklists
├── schemas/
│   ├── chat.py                  # ChatRequest, ChatResponse, Citation, SuggestedAction
│   ├── case.py                  # CaseCreate, CaseResponse, EvidenceItem
│   ├── classify.py              # ClassifyRequest, ClassifyResponse
│   ├── actions.py               # NoticeParameters, NoticePreview, AIEditRequest
│   └── retrieval.py             # SearchRequest, SearchResponse, ChunkItem
├── services/
│   ├── pipeline.py              # Master LegalSaathiPipeline orchestrator
│   ├── classifier.py            # 15-domain rule-based & keyword classifier + emergency triage
│   ├── retrieval_service.py     # Hybrid BM25 + Semantic RRF search + bilingual expansion
│   ├── llm_provider.py          # Google Gemini, LoRA, and local grounded synthesizer
│   ├── citation_service.py      # Claim-to-source citation scoring & confidence badge
│   └── engine/
│       ├── extraction.py        # Natural language entity and fact extraction
│       ├── normalization.py     # Location, monetary amount, and date normalizers
│       └── validation.py        # Factual consistency and cross-check validators
├── safety/
│   ├── input_validation.py      # Length bounds and character sanitization
│   ├── prompt_injection_guard.py# Heuristic and regex jailbreak defense
│   └── rate_limiter.py          # Sliding window client IP / session rate limiter
└── data/
    ├── corpus/
    │   └── indian_legal_acts.json # 9,549 verified statutory chunks
    └── db.py                    # Database abstraction layer (PostgreSQL / Supabase)
```

---

## 2. Supabase PostgreSQL Schema & RLS Security

The backend operates against Supabase PostgreSQL (Postgres 17.6) using pooled connections over TCP/SSL (`aws-0-ap-southeast-2.pooler.supabase.com:5432`):

```sql
-- 1. User Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'LEGAL_AID_ADVOCATE', 'DLSA_OFFICER')),
    docket_id TEXT UNIQUE DEFAULT ('LS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM()*10000)::TEXT, 4, '0')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sessions Table
CREATE TABLE public.sessions (
    session_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    lang TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cases Table
CREATE TABLE public.cases (
    case_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    issue_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    entities JSONB DEFAULT '{}'::jsonb,
    consent_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Evidence Items Table
CREATE TABLE public.evidence (
    evidence_id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES public.cases(case_id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'needed',
    source_filename TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Legal Drafts Table
CREATE TABLE public.legal_drafts (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES public.cases(case_id) ON DELETE CASCADE,
    document_type TEXT NOT NULL DEFAULT 'LEGAL_NOTICE',
    parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    rendered_content TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Draft Versions History
CREATE TABLE public.draft_versions (
    id TEXT PRIMARY KEY,
    draft_id TEXT NOT NULL REFERENCES public.legal_drafts(id) ON DELETE CASCADE,
    version INT NOT NULL,
    content TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('initial', 'manual', 'ai_edit', 'regenerated')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Statutory Legal Sources Table
CREATE TABLE public.legal_sources (
    id TEXT PRIMARY KEY,
    act_title TEXT NOT NULL,
    section_ref TEXT NOT NULL,
    content TEXT NOT NULL,
    jurisdiction TEXT DEFAULT 'India (Central)',
    official_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Billing & DLSA Ledger
CREATE TABLE public.billing_transactions (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    feature TEXT NOT NULL,
    amount_inr INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'WAIVED_PRO_BONO')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policy Specifications
* `profiles`: `SELECT`, `UPDATE` restricted to `auth.uid() = id`.
* `cases`: Read/write granted if `user_id = auth.uid()` OR `session_id = current_setting('request.headers')::json->>'x-session-id'`.
* `evidence` & `legal_drafts`: Access granted based on owning case permission.
* `legal_sources`: Open read access (`true`) to allow universal statutory transparency.

---

## 3. Hybrid RAG Retrieval Engine

The hybrid search engine indexes 9,549 statutory chunks from the Indian Bare Acts corpus and uses Reciprocal Rank Fusion (RRF):

### 3.1. Query Expansion & Lexical Normalization
Tokens are expanded via `BILINGUAL_LEGAL_MAP`:
```python
BILINGUAL_LEGAL_MAP = {
    "उपभोक्ता": "consumer protection deficiency refund warranty replacement",
    "किराया": "rent tenancy landlord eviction lease security deposit",
    "rti": "right information act pio public cpio authority appeal 6 7 19",
    "rera": "real estate regulation development builder possession allottee 18",
    "deposit": "security deposit rent tenant tenancy landlord refund 13",
    "upi": "cyber fraud unauthorized online bank transfer 1930 scam",
}
```

### 3.2. Reciprocal Rank Fusion (RRF)
RRF combines lexical BM25 ranks with semantic affinity ranks without requiring GPU inference:
$$\text{RRF Score}(d) = \sum_{m \in \{\text{BM25}, \text{Semantic}\}} \frac{1}{60 + \text{rank}_m(d)}$$
A 3.0x multiplier boost is applied to chunks whose primary governing act matches the classified domain.

---

## 4. Multi-Tier LLM Grounded Synthesis

```
                     [ Query + Context Assembled ]
                                   │
                                   ▼
                    [ Tier 1: Google Gemini 3.8 Flash ]
                     - Model: `gemini-3.8-flash`
                     - SDK: `google-genai` official
                     - Timeout: 8.0 seconds
                                   │
            ┌──────────────────────┴──────────────────────┐
            ▼ [Success: Return Output]                    ▼ [Timeout / 429 Quota Error]
                                                          │
                                                          ▼
                                             [ Tier 2: Indian Legal LoRA ]
                                              - Model: Llama-3.2-1B PEFT
                                              - Inference: Local / API
                                                          │
                                   ┌──────────────────────┴──────────────────────┐
                                   ▼ [Success]                                   ▼ [Unavailable]
                                                                                 │
                                                                                 ▼
                                                                [ Tier 3: Deterministic Synthesizer ]
                                                                 - Zero external dependency
                                                                 - Domain-specific logic:
                                                                   • Greetings & Intake
                                                                   • Tenancy & MTA Sec 13
                                                                   • Consumer CPA Sec 2(11)
                                                                   • RTI Act Sec 6(1) & 19
                                                                   • Cyber Crime 1930
                                                                   • Builder RERA Sec 18
```

---

## 5. API Catalog & Contracts

### 5.1. POST `/chat`
Submits a user query and returns grounded legal analysis, statutory citations, and recommended next steps.

* **Request:**
  ```json
  {
    "text": "Can my landlord deduct painting charges from my deposit?",
    "session_id": "sess_8f2a91_1740000000",
    "case_id": "LS-2026-0042",
    "lang": "en"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "answer": "**Case-Specific Legal Analysis (Tenancy):**\n1. Applicable Provisions: Model Tenancy Act, 2021 (Section 13)...",
    "citations": [
      {
        "source_id": "pri_model_tenancy_act__2_13",
        "title": "Model Tenancy Act, 2021 - 13: Security Deposit Limits and Refund",
        "section_ref": "13",
        "excerpt": "Section 13 mandates that the security deposit paid by the tenant shall not exceed two months rent...",
        "relevance_score": 0.99,
        "jurisdiction": "India (Central Framework)",
        "official_link": "https://mohua.gov.in/upload/uploadfiles/files/MTA_Final_English.pdf"
      }
    ],
    "confidence": "strong",
    "suggested_action": {
      "type": "checklist",
      "title": "Generate Tenant Protection Evidence Checklist",
      "description": "Check needed proof to resist illegal deposit withholding.",
      "endpoint": "/api/v1/actions/checklist"
    },
    "session_id": "sess_8f2a91_1740000000",
    "case_id": "LS-2026-0042",
    "issue_type": "tenancy",
    "urgency": "medium",
    "disclaimer": "Legal Saathi provides legal information under Indian law, not formal legal advice."
  }
  ```

### 5.2. POST `/actions/notice/preview`
Renders court-ready legal notice preview text from parameters.

* **Request:**
  ```json
  {
    "case_id": "LS-2026-0042",
    "parameters": {
      "senderName": "Ramesh Kumar",
      "senderAddress": "Flat 402, Green Glen, Bangalore",
      "recipientName": "Suresh Sharma",
      "recipientAddress": "12, MG Road, Bangalore",
      "demandedAmount": "65000",
      "curePeriodDays": 15,
      "factsSummary": "Landlord withheld security deposit after clean flat handover.",
      "statutoryBasis": "Model Tenancy Act, 2021 and Section 106 Transfer of Property Act, 1882",
      "demands": ["Refund security deposit of Rs. 65,000", "Pay statutory interest at 18% p.a."]
    }
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "preview_text": "LEGAL NOTICE\n\nTo,\nSuresh Sharma...\n\nUnder instructions from my client, Ramesh Kumar...",
    "document_type": "LEGAL_NOTICE"
  }
  ```

### 5.3. POST `/actions/notice/ai-edit`
Generates natural-language revisions with diff tracking.

* **Request:**
  ```json
  {
    "case_id": "LS-2026-0042",
    "current_content": "...current legal notice text...",
    "instruction": "Add a firm demand for 18% statutory interest from date of vacation."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "revised_content": "...updated text with 18% interest clause...",
    "summary_of_changes": "Incorporated 18% p.a. statutory interest claim citing breach of contractual obligation."
  }
  ```
