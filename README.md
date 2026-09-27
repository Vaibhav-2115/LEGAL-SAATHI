# Legal Saathi — AI-Powered Indian Legal Assistance Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.6-336791.svg)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrated-3ECF8E.svg)](https://supabase.com/)
[![LLaMA 3.2](https://img.shields.io/badge/LLaMA-3.2--1B--LoRA-orange.svg)](https://huggingface.co/)

> An evidence-grounded, multilingual, voice-capable legal assistance platform designed for Indian citizens. Features automated statutory issue classification across 15 legal domains, strict case-specific AI context isolation, hybrid RAG retrieval from verified Indian statutes, and collective action clustering (Ekjut Engine).
>
> 📖 **Comprehensive Project Documentation Index:** See [`docs/README.md`](docs/README.md) for the complete index covering the [Architecture Blueprint](docs/ARCHITECTURE_BLUEPRINT.md), [Master Specifications](docs/MASTER_PROJECT_SPECIFICATIONS.md), [Backend Architecture](docs/BACKEND_ARCHITECTURE.md), [Phase Completion Matrix](docs/PHASE_COMPLETION_MATRIX.md), [Master Status Report](docs/MASTER_PROJECT_STATUS_REPORT.md), and [Security Guidelines](docs/SECURITY.md).

---

## 🏛️ System Architecture

```text
Citizen Query (Text / Voice / 8 Indian Languages)
  │
  ▼
API & Safety Boundary Layer
  ├── Rate Limiting (Sliding Window SEC-005)
  ├── PII Masking & Data Minimization (SEC-004)
  ├── Prompt Injection Guard (SEC-006)
  └── Strict Complaint Quality Assessment (VALID / INCOMPLETE / INVALID)
  │
  ▼
Authoritative Active Case Resolution (Supabase PostgreSQL 17.6)
  ├── Session & Role-Based Ownership Check (RLS & SEC-001)
  └── Case Context Fusion (Case ID, Facts, Documents, Prior Turn History)
  │
  ▼
Intent & Multi-Domain Legal Classification (15 Indian Domains)
  ├── Property & RERA (Builder Delay / Possession)
  ├── Tenancy Disputes (Model Tenancy Act / Rent Control)
  ├── Financial & Banking (NI Act Section 138 / RBI Ombudsman)
  ├── Employment & Labour (Code on Wages / Withheld Salary)
  ├── Cyber Fraud (IT Act 2000 / Cyber Helpline 1930)
  └── Emergency Short-Circuiting (112 Police / 181 Women / 1098 Child)
  │
  ▼
Hybrid Case-Specific Retrieval (BM25 Lexical + Semantic + Reciprocal Rank Fusion)
  ├── Scoped to Active Case Documents (Zero Cross-Case Leakage)
  └── Grounded in 9,549 Verified Statutory Chunks (India Code / Central Acts)
  │
  ▼
Dual Generation Engine
  ├── Primary: Google Gemini API / Fine-Tuned LLaMA-3.2-1B PEFT LoRA
  └── Fallback: Local Grounded Statutory Synthesis (Zero External Dependency)
  │
  ▼
Output Relevance Gate & Citation Verification
  ├── Purges Hallucinations (e.g. Suppresses Tenancy Bias on Real Estate Cases)
  └── Confidence Scoring (Strong / Partial / Insufficient)
  │
  ▼
Action Layer & Ekjut Engine
  ├── Statutory Legal Notice Drafting (15 / 30-day notice)
  ├── Section 6(1) RTI Application Generator
  ├── DLSA Free Legal Aid Referral (LSAA 1987 Section 12)
  ├── e-FIR & Cyber Crime Portal (1930) Guidance
  └── Anonymized Locality Clustering & Collective Grievance Action
```

---

## 📁 Repository Structure

```text
LegalSaathi/
│
├── README.md                      # Primary project overview & developer guide
├── package.json                   # Next.js frontend package manifest
├── requirements.txt               # FastAPI backend dependencies
├── tsconfig.json                  # TypeScript configuration
├── next.config.ts                 # Next.js configuration
├── docker-compose.yml             # Container orchestration (Frontend + Backend)
│
├── src/                           # Next.js 14 Frontend Application
│   ├── app/                       # App Router (25 verified pages & API routes)
│   ├── components/                # UI components (Header, ContextualAssistant, CaseLeftNav)
│   ├── context/                   # Global state (LegalSaathiContext, AuthContext)
│   └── lib/                       # Helpers, Supabase client, i18n translations dictionary
│
├── backend/                       # FastAPI Backend Engine
│   ├── core/                      # Configuration, Auth, JWT, Rate Limiting, Logging
│   ├── data/                      # Database connection, Supabase integration, Corpus
│   ├── routers/                   # Modular API endpoints (/chat, /cases, /classify, /actions)
│   ├── safety/                    # Input validation, output relevance gate, prompt injection
│   ├── schemas/                   # Pydantic request/response data contracts
│   ├── services/                  # Business logic, classifier, pipeline, LLM provider
│   └── tests/                     # 75+ automated pytest tests
│
├── dataset/                       # Statutory legal codes, sections, and cross-references (CSV/PDF)
├── download_dataset/              # Master legal dataset archives (220k records)
├── data/                          # Normalized legal corpora, retrieval chunks, SFT training sets
├── indian_legal_llama_lora/       # LLaMA-3.2-1B fine-tuned legal LoRA adapter weights
├── supabase/                      # PostgreSQL migrations & Row-Level Security policies
│
├── docs/                          # Comprehensive Architectural & Technical Documentation
│   ├── legal-saathi-blueprint.md  # Detailed technical blueprint
│   ├── LEGAL_SAATHI_COMPLETE.md   # Master deliverable specifications
│   ├── LEGAL_SAATHI_BACKEND_ARCHITECTURE.md # Backend architecture & database design
│   ├── PROJECT_DEVELOPMENT_ROADMAP.md # Phase execution plan
│   ├── SECURITY.md                # Application security standards
│   ├── authentication/            # Authentication flow & user migration runbooks
│   └── migrations/                # Database migration runbooks & schema mappings
│
├── PROJECT_AUDIT/                 # Project Audit & Completion Records
│   ├── MASTER_PROJECT_AUDIT.md    # Top-level audit verification
│   ├── PHASE_COMPLETION_MATRIX.md # Complete Phases 1–31 verification matrix
│   ├── REMAINING_TASKS_AND_DEPENDENCIES.md # Future roadmap & integrations
│   └── LEGAL_AI_PIPELINE_AUDIT.md # AI pipeline validation
│
├── reports/                       # Verification Reports & Test Evidence
│   ├── MASTER_PROJECT_STATUS_REPORT.md # Current consolidated project master status
│   ├── MASTER_CASE_AI_AUDIT_REPORT.md  # Case isolation & multilingual test report
│   ├── PHASES_27_31_MASTER_AUDIT_REPORT.md # Infrastructure & security audit
│   ├── PHASES_23_26_MASTER_AUDIT_REPORT.md # LoRA model & RAG completion audit
│   ├── SUPABASE_FULL_INTEGRATION_TEST_REPORT.md # Supabase migration validation
│   └── PROJECT_CLEANUP_REPORT.md      # Repository hygiene & manifest report
│
└── scripts/                       # Migration, benchmarking, dataset, and training utilities
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0+ (v20+ recommended)
- **Python**: 3.10+ (tested with Python 3.11–3.14)
- **Database**: Supabase PostgreSQL 17.6 (or local PostgreSQL)

### 2. Environment Setup
Copy the sample environment file and configure your credentials:
```powershell
cp .env.example .env
```

### 3. Backend Setup
```powershell
# Create & activate Python virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run FastAPI backend server (Port 8000)
python scripts/run_backend.py
```
- Interactive API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 4. Frontend Setup
```powershell
# Install frontend dependencies
npm install

# Run Next.js development server (Port 3000)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Testing

### Run Backend Automated Tests
```powershell
# Run the dedicated case-isolation & multi-domain test suite
.\.venv\Scripts\python.exe -m pytest backend/tests/test_case_isolation.py -v

# Run core classify & grounded chat tests
.\.venv\Scripts\python.exe -m pytest backend/tests/test_classify.py backend/tests/test_chat.py -v
```

### Run Frontend Typecheck & Build
```powershell
# TypeScript verification (0 errors)
npx tsc --noEmit

# Production build (25/25 routes static-generated)
npm run build
```

---

## 🛡️ Security, Privacy & Legal Disclaimers

1. **Not Formal Legal Advice**: Legal Saathi provides evidence-grounded legal research and procedural assistance under Indian law. It is designed to assist citizens and paralegals in understanding their rights and preparing documentation, not to replace formal court representation by an enrolled advocate.
2. **Citizen Privacy**: Raw personal identifying information (PII) is masked at the intake boundary. Incident records in the Ekjut similarity clustering engine are strictly anonymized using SHA-256 hashed identifiers and locality bucketing.
3. **Data Security**: All case-specific operations enforce Row-Level Security (RLS) in Supabase PostgreSQL, ensuring users can only read and write their own cases and documents.

---

## 📄 Documentation Index
- [Architecture Blueprint](docs/legal-saathi-blueprint.md)
- [Master Project Specifications](docs/LEGAL_SAATHI_COMPLETE.md)
- [Backend Architecture](docs/LEGAL_SAATHI_BACKEND_ARCHITECTURE.md)
- [Phase Completion Matrix](PROJECT_AUDIT/PHASE_COMPLETION_MATRIX.md)
- [Master Project Status Report](reports/MASTER_PROJECT_STATUS_REPORT.md)
- [Security Guidelines](docs/SECURITY.md)
