# Architecture Blueprint — Legal Saathi

**Document Version:** 1.0.0  
**Project:** Legal Saathi (AI-Powered Indian Legal Assistance Platform)  
**Last Updated:** September 2026  
**Status:** Approved & Implemented in Production  

---

## 1. Architectural Vision & Core Principles

Legal Saathi is built on five non-negotiable architectural tenets designed to serve Indian citizens navigating complex dispute resolution:

1. **Zero Statutory Hallucination (Strict Grounding):**  
   Every legal statement, section reference, limitation countdown, and suggested remedy output by the AI engine must be directly traceable to verified Indian Central Acts, State Acts, or Supreme Court / High Court precedents. Generic or fabricated legal advice is strictly prohibited.
2. **Context Isolation (Zero Cross-Case Data Leakage):**  
   Each legal matter maintains complete isolation. Statements, evidence records, and draft versions from Case A can never contaminate inquiries or retrieval scopes for Case B.
3. **Resilient Multilingual First-Class Citizen:**  
   The entire interface and reasoning pipeline operates natively across English, Hindi, and 6 Indic regional languages (Marathi, Tamil, Bengali, Telugu, Gujarati, Kannada). Fact statements and statutory identifiers are preserved without unwanted auto-translation.
4. **Three-Tier Synthesis Fallback (Zero Downtime):**  
   If the cloud generative LLM (Google Gemini) suffers latency, timeouts, or API quota exhaustion, the system automatically falls back to a fine-tuned on-premise LoRA adapter (Llama-3.2-1B) or a deterministic Local Grounded Synthesis Engine.
5. **Privacy & Citizen Data Minimization:**  
   Personally Identifiable Information (Aadhaar, PAN, banking OTPs) is masked at the intake boundary before being processed or indexed.

---

## 2. High-Level System Topology

```
                                  ┌───────────────────────────────┐
                                  │   CITIZEN / ADVOCATE CLIENT   │
                                  └──────────────┬────────────────┘
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
       [ Next.js 16 Web Application ]                             [ Voice / Indic Speech Intake ]
        - App Router, Turbopack                                    - Web Speech API Native
        - React 19 Client Components                               - Phonetic Indic Recognition
        - Tailwind CSS v4 Styling                                  - Whisper AI Audio Engine
        - Centralized i18n (8 Languages)                                       │
                   │                                                           │
                   ├─────────────────────────────┬─────────────────────────────┘
                   ▼                             ▼
        [ Next.js Route Proxy ]        [ Direct Client Fetch ]
        `POST /api/chat`               `GET /cases`, `GET /sources`
                   │                             │
                   └──────────────┬──────────────┘
                                  ▼
                     [ FastAPI Backend Gateway ]
                      - Port 8000 (Python 3.11+)
                      - Request ID & Correlation Tracking
                      - Security Headers & CORS Enforcement
                      - Sliding Window Rate Limiting (60 req/min)
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
[ Safety & Guards ]      [ Intent Classifier ]    [ Hybrid Retrieval Service ]
 - Prompt Injection       - 15 Legal Domains       - BM25 Okapi Lexical Index
 - PII Data Masking       - Greeting Recognition   - Semantic Vector Matcher
 - Content Moderation     - Emergency Triage       - Reciprocal Rank Fusion (k=60)
         │                - Builder Disambiguation - Bilingual Synonym Expansion
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                      [ Context Assembly Engine ]
                       - Active Case Docket Facts
                       - Retrieved Top-5 Statutory Chunks
                       - Evidence Verification Status
                                  │
                                  ▼
                     [ Multi-Tier LLM Provider ]
                      - Tier 1: Google Gemini 3.8 Flash
                      - Tier 2: Indian Legal LoRA Adapter
                      - Tier 3: Local Grounded Synthesis Engine
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[ Supabase PostgreSQL 17 ]                         [ In-Memory Corpus & Vector Data ]
 - Cloud PostgreSQL Connection Pooler               - 9,549 Indian Statutory Chunks
 - Row Level Security (RLS) Isolation               - Rank-BM25 Token Inverted Index
 - 8 Normalized Production Tables                   - Pre-trained LoRA Adapter Weights
 - JWT Verification & Role Access                   - Session Cache & Activity Audits
```

---

## 3. End-to-End Request & Data Flow Pipeline

The end-to-end request flow follows nine coordinated stages:

```
[Citizen Input]
      │
      ▼
1. Input Sanitization & Validation (Length <= 5,000 chars, whitespace checks)
      │
      ▼
2. Prompt Injection Guard (Regex & heuristic jailbreak scanning)
      │
      ▼
3. Session & Active Case Resolution (Extract or assign session_id, verify ownership)
      │
      ▼
4. Intent & Urgency Classification (Evaluate 15 legal domains; emergency detection)
      │
      ├──> [Emergency Short-Circuit] ──> Returns 112 / 181 / 1930 / 15100 Alert
      │
      ▼
5. Bilingual Query Term Expansion (Expand acronyms & Hindi synonyms: RTI, RERA, UPI)
      │
      ▼
6. Dual Hybrid Retrieval (BM25 lexical scoring + Semantic cosine approximation)
      │
      ▼
7. Reciprocal Rank Fusion (RRF: RRF_score = sum(1 / (60 + rank)))
      │
      ▼
8. Multi-Tier Grounded Generation (Gemini -> LoRA -> Local Grounded Synthesizer)
      │
      ▼
9. Response Assembly & Citation Verification (Claim-to-source mapping & confidence scoring)
      │
      ▼
[Structured Response to Client]
```

---

## 4. Frontend Component Architecture

The frontend follows Next.js 16 App Router standards with strict separation of server rendering and client state interactivity:

### 4.1. Core Application Routes
* `/`: High-converting citizen landing page with quick legal assessment entry.
* `/dashboard`: Main citizen hub featuring welcome stats, active matters, high-priority tasks, and the **Ask Legal Saathi** prompt.
* `/complaints`: "My Matters" docket listing with status filters, date badges, and case creation modals.
* `/cases/[caseId]`: The primary 3-Zone Case Workspace housing:
  * `Overview`: Metrics, citizen statement, actionable next steps, statutory linkages.
  * `Evidence & Documents`: Upload forms, categorization, verification checklist.
  * `Timeline`: Sequential chronological history of dispute events and notices.
  * `Missing Information`: Interactive questions prompting for required missing proof.
  * `Why This Law Applies`: 5-step visual fact-to-law traceability pipeline.
  * `Case Verification`: Completeness score and evidence reliability audit.
  * `Legal Sources & Compare`: Side-by-side Bare Act text analysis.
  * `Legal Actions`: Legal notice parameters editor and preview suite.
* `/draft/legal-notice`: Specialized full-page legal notice drafting and preview room.
* `/draft/rti`: Specialized Section 6(1) RTI application generator.
* `/chat`: Deep interactive Indic legal advisory consultation room.
* `/dlsa`: Pro-bono Legal Aid directory and National Helpline 15100 referral portal.

### 4.2. The 3-Zone Workspace Layout
* **Zone 1 (Left Rail — Case Dossier Context):** Displays case metadata, recorded facts count, verified evidence progress bar, and navigation to the full case docket.
* **Zone 2 (Center Canvas — Interactive Workspace):** Hosts the primary active tab content, conversation stream, or document parameter editor.
* **Zone 3 (Right Rail — Legal Grounding & Timelines):** Grounded statutory provisions, statutory countdown timers (e.g., 15-day notice cure periods, 30-day RTI deadlines), and NALSA legal aid cards.

---

## 5. Multilingual Localization Architecture

Localization is centralized in [`src/lib/i18n/translations.ts`](file:///e:/Rox/LegalSaathi/src/lib/i18n/translations.ts) and orchestrated by the `useLegalSaathi()` context hook:

```
[User Language Selection]
           │
           ▼
[LegalSaathiContext.setLanguage(lang)]
           │
           ├───────────────────────────────┐
           ▼                               ▼
[Local Storage & User Prefs]      [t = getTranslations(lang)]
 - Restored on refresh             - Reactive translation dictionary
 - Restored on login               - Zero-reload UI updates
           │                               │
           ▼                               ▼
[Backend ISO Code Sync]           [React Component Re-render]
 - `en`, `hi`, `mr`, `ta`          - Headers, Sidebars, Buttons
 - `bn`, `te`, `gu`, `kn`          - Badges, Placeholders, Form Labels
```

### Safety Guarantees
* **No Auto-Translation of Facts:** The user's factual descriptions, names of opposing parties, addresses, and claimed amounts are immutable and never mutated when switching UI language.
* **Statutory Preservation:** Official Act names and section identifiers (e.g., *Section 106, Transfer of Property Act, 1882*) maintain their authoritative citations.

---

## 6. Case Isolation & Security Boundary

```
[Inbound Request]
       │
       ▼
Extract `X-Session-ID` Header & Bearer JWT
       │
       ▼
Resolve Session & User Identity in Supabase
       │
       ├──> If `case_id` provided:
       │       │
       │       ▼
       │    Query `cases` table
       │       │
       │       ▼
       │    Enforce `case.session_id == active_session_id` OR `case.user_id == authenticated_user_id`
       │       │
       │       ├──> Mismatch: Raise HTTP 403 Forbidden
       │       └──> Match: Scoped retrieval to case documents only
       │
       └──> If standalone query: Scoped to central Bare Acts corpus only
```

This guarantees complete multi-tenant safety and prevents cross-case leakage across all citizen dockets.
