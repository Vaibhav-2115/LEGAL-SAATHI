# PROJECT_DEVELOPMENT_ROADMAP.md
### Legal Saathi — Master Development Playbook for a 4-Developer, AI-Assisted ("Vibe Coding") Team

> **Method note — read this before anything else.** This roadmap was built without access to the actual repository (no code was provided in this session). Every "current state" claim below is therefore marked **[UNKNOWN]** unless your team explicitly stated it in planning docs, in which case it is marked **[STATED]** — neither is a substitute for reading the code. **Phase 0 of this plan is a mandatory repo audit** that converts every [UNKNOWN]/[STATED] item into [VERIFIED] / [PARTIAL] / [PLANNED] / [MISSING] before any teammate starts Phase 1. Do not skip Phase 0 — the rest of this plan assumes its output exists.
>
> Classification legend used throughout:
> `[VERIFIED]` confirmed by reading code · `[PARTIAL]` exists but incomplete · `[PLANNED]` described, not implemented · `[MISSING]` required, doesn't exist · `[UNKNOWN]` not enough evidence yet, needs Phase 0.

---

## PART 0 — CURRENT STATE AUDIT (to be completed in Phase 0, template below)

| Area | Status (pre-audit) | What Phase 0 must confirm |
|---|---|---|
| Frontend scaffold (Next.js/TS/Tailwind/Framer Motion) | [STATED] | Which pages/components exist vs. named-only |
| Backend scaffold (FastAPI, `classifier.py`, `pipeline.py`) | [STATED] | Do these files contain real logic or stubs? |
| Hybrid retrieval (ChromaDB + BM25) | [STATED], fusion unconfirmed | Is there an actual fusion/re-rank step, or just one index wired up? |
| LLM abstraction + fallback | [UNKNOWN] | Is there a provider-agnostic interface, or a hardcoded SDK call? |
| Case schema / persistence | [UNKNOWN] | Does any structured object survive past a single request? |
| Citation / trust layer | [UNKNOWN] | Do claims get checked against sources, or just narrated by the LLM? |
| Voice (STT/TTS) | [STATED], unclear completeness | Any working round trip at all, even one language? |
| Legal Saathi Engine (extraction/similarity/clustering/consent) | [STATED] as concept, [UNKNOWN] as code | Almost certainly the least built — confirm what (if anything) exists |
| Action modules (Notice/RTI/DLSA/e-FIR/Checklist) | [MISSING] (not mentioned as existing) | Confirm none exist yet |
| Auth/session | [UNKNOWN] | Confirm no auth exists, or find what's there |
| Tests, CI, Docker, env config | [UNKNOWN] | Confirm what tooling already exists so Phase 2 doesn't duplicate it |

**Phase 0 deliverable:** a filled-in version of this table, one row per component, each cell changed to `[VERIFIED]`, `[PARTIAL]`, `[PLANNED]`, or `[MISSING]`, with a one-line note and a file path as evidence. This becomes the actual baseline — every later phase in this document assumes you've done this and adjusts its own scope accordingly (a phase whose target is already `[VERIFIED]` shrinks to a review task, not a rebuild).

---

## PART 1 — ARCHITECTURE RECAP (frozen at Phase 1, unless Phase 0 finds a reason to change it)

```
User → Frontend → API Layer → Intent Classification → Case Understanding
     → Hybrid Retrieval → Evidence/Context → LLM → Trust/Citation Layer
     → Action Layer → Legal Saathi Engine → Collective Action
```

Full layer-by-layer explanation, data flows, RAG design, Engine design, DB model, and API surface are already specified in `docs/legal-saathi-blueprint.md` (the prior deliverable) — this roadmap does not repeat that content, it schedules and assigns it. Read that document first if you haven't.

**Core user journey (all task IDs below map back to this):**
```
CITIZEN → ASK → UNDERSTAND → VERIFY → EXPLAIN → ACT → UNITE
```

---

## PART 2 — TEAM STRUCTURE (4 Developers)

Legal Saathi's architecture has four natural seams: a UI layer, an API/orchestration layer, a data+AI layer (retrieval, LLM, the Engine), and a cross-cutting layer (voice, action modules, testing, deployment). That maps cleanly to 4 people without anyone waiting idle — this is why the split below deviates slightly from the generic template: **AI/RAG and the Legal Saathi Engine are combined into T3** (both are "operate on stored data" work, and splitting them would force T3 and a hypothetical 5th person to constantly renegotiate the Case schema), and **Voice + Action Modules move to T4** alongside integration/QA (both are "bolt onto an already-working core pipeline" work, which is exactly what T4 does after Phase 4).

### TEAMMATE 1 — Frontend / UI
- Next.js pages, components, state management (React context / Zustand)
- API client layer (typed, mirrors backend Pydantic schemas)
- Loading / error / empty states for every async view
- Chat UI, case workspace UI, citation/confidence display, action module forms
- Accessibility (voice-first affordances, large tap targets, contrast)
- **Depends on:** API contract (Part 14) frozen before real integration; can build against mocks before that.

### TEAMMATE 2 — Backend / API / Orchestration
- FastAPI app structure, routers, Pydantic schemas
- `classifier.py`, `pipeline.py` (orchestration: classify → retrieve → generate → cite)
- LLM abstraction layer (primary + fallback provider)
- Citation/trust layer (claim → source mapping, confidence scoring)
- Auth/session, rate limiting, input validation (`backend/safety/`)
- **Depends on:** T3's retrieval service being callable (can build against a mock retrieval response first).

### TEAMMATE 3 — Data / Retrieval / AI / Legal Saathi Engine
- Corpus ingestion, chunking, metadata, ChromaDB + BM25 hybrid index, fusion/re-ranking
- Case schema definition (owns this contract — T2 and T1 consume it)
- Legal Saathi Engine: extraction, normalization, similarity, clustering, explanation, consent
- Retrieval evaluation (golden query set)
- **Depends on:** nothing external to start (corpus + schema work is independent); Engine work depends on Case schema being frozen (Phase 1).

### TEAMMATE 4 — Voice / Action Modules / Integration / DevOps / QA
- Voice service (STT/TTS, language detection)
- Action modules (Evidence Checklist first, then Notice/RTI/DLSA/e-FIR)
- Testing strategy execution, CI pipeline, Docker/deployment
- Security review pass, end-to-end test scripts
- **Depends on:** the core pipeline (T2+T3) reaching Milestone 1 (Part 7, Phase 4) before voice/action modules have something real to bolt onto — until then, T4 builds CI, test scaffolding, and Docker/env setup, which has zero dependency on the others.

### Team Ownership Matrix

| Area | T1 | T2 | T3 | T4 | Primary Owner | Secondary |
|---|---|---|---|---|---|---|
| Frontend pages/components | ✓ | | | | T1 | T4 (a11y/QA) |
| API routers & schemas | | ✓ | | | T2 | T1 (contract review) |
| Classifier / pipeline orchestration | | ✓ | | | T2 | T3 |
| Hybrid retrieval (ChromaDB+BM25) | | | ✓ | | T3 | T2 |
| Case schema | | ✓(consumes) | ✓(owns) | | T3 | T2 |
| LLM abstraction + fallback | | ✓ | | | T2 | — |
| Citation / Trust layer | | ✓ | ✓ (source metadata) | | T2 | T3 |
| Legal Saathi Engine | | | ✓ | | T3 | T4 (privacy/consent QA) |
| Voice (STT/TTS) | | | | ✓ | T4 | T1 (UI) |
| Action modules | | | | ✓ | T4 | T2 (API), T3 (Case schema) |
| Auth/session | | ✓ | | | T2 | T4 |
| CI/CD, Docker, deployment | | | | ✓ | T4 | T2 |
| Testing (unit/integration/E2E) | ✓ (FE) | ✓ (BE) | ✓ (RAG/Engine) | ✓ (E2E/owns plan) | T4 | Everyone |
| Security review | | ✓ | | ✓ | T4 | T2 |

---

## PART 3 — PARALLEL EXECUTION MODEL

```
                         PHASE 0
                    Repo Audit (ALL)
                            │
                         PHASE 1
                   Architecture Freeze (ALL)
                            │
              ┌─────────────┼─────────────┬─────────────┐
              ▼             ▼             ▼             ▼
           PHASE 2       PHASE 2       PHASE 2       PHASE 2
         FE Skeleton   BE Skeleton   RAG/Corpus     CI/Docker/
           (T1)          (T2)         (T3)           Env (T4)
              │             │             │             │
              └─────────────┼─────────────┘             │
                            ▼                            │
                        PHASE 3-4                        │
              Case Schema + First Grounded               │
                Chat Workflow (T2 + T3)                  │
                            │◄─────────────────────────────┘
                            ▼
                        PHASE 5
              Case Workspace (T1) + first Action
                  Module: Checklist (T4)
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          PHASE 6       PHASE 7       PHASE 7
       More Action     Voice (T4)    Engine v1
      Modules (T4)                  (T3)
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                        PHASE 8
                Collective Workflow (T3 + T1)
                            │
                        PHASE 9
              Testing / Security (T4 leads, ALL contribute)
                            │
                        PHASE 10
                    Final Polish / Demo
```

**Parallelization answer per phase** (Part 13 of the brief):

| Phase | T1 independent? | T2 independent? | T3 independent? | T4 independent? |
|---|---|---|---|---|
| 0 — Audit | Yes (own area) | Yes (own area) | Yes (own area) | Yes (own area) |
| 1 — Arch Freeze | No — joint decision | No — joint decision | No — joint decision | No — joint decision |
| 2 — Skeletons | Yes, against mocks | Yes, own routers | Yes, corpus/index work | Yes, CI/Docker |
| 3–4 — Core workflow | No — waits on API contract | Partially — needs T3's retrieval interface (mockable) | Yes | Yes (still on CI/env) |
| 5 — Case Workspace / Checklist | Partially — needs Case schema shape | No — feeds T1 | No — feeds T1/T4 | Partially — needs Case schema shape |
| 6–7 — More actions / Voice / Engine v1 | Yes (own UI work) | Partially — action APIs | Yes | Yes |
| 8 — Collective workflow | No — needs Engine output | No — needs Engine output | Yes (drives this) | No — needs Engine output |
| 9 — Testing/Security | Yes (FE tests) | Yes (BE tests) | Yes (RAG/Engine tests) | Yes (owns E2E plan) |

### Critical Path
```
Phase 0 (Audit) → Phase 1 (Architecture + Case Schema Freeze)
  → Phase 3 (Case schema implemented, T3)
  → Phase 4 (Retrieval + LLM + Citation wired, T2+T3)  ← BOTTLENECK: nothing in Phase 5-8 works without this
  → Phase 5 (Case Workspace + Checklist)
  → Phase 8 (Collective Workflow — needs Engine, which needs Case schema from Phase 1)
  → Phase 9 (Testing/Security)
  → Phase 10 (Demo)
```
**The single biggest bottleneck is Phase 4** (first grounded, cited answer). Nothing downstream — action modules, voice, the Engine, or the demo — is genuinely finishable until this works, because everything downstream reads from the Case schema and the citation output this phase establishes. Protect this phase's timeline above all others; if it slips, slip the demo scope (drop P2 features) before slipping this.

---

## PART 4 — TASK ID SYSTEM

```
ARCH-xxx   Architecture / cross-cutting decisions
AUDIT-xxx  Phase 0 repo audit tasks
DB-xxx     Database schema / migrations
BE-xxx     Backend routes / services
FE-xxx     Frontend pages / components
RAG-xxx    Corpus, chunking, retrieval, ranking
AI-xxx     LLM abstraction, prompting, citation logic
ENG-xxx    Legal Saathi Engine (extraction/similarity/clustering/consent)
VOICE-xxx  STT/TTS integration
ACT-xxx    Action modules (Notice/RTI/DLSA/e-FIR/Checklist)
AUTH-xxx   Auth/session
SEC-xxx    Security tasks
QA-xxx     Testing tasks
DEVOPS-xxx CI/CD, Docker, deployment
```
Every task in the phase tables below can be expanded into this ID format; a fully atomized example is given in Part 6 for the highest-risk area (the Case Schema + Grounded Answer pipeline), which you should use as the template to atomize every other phase's tasks the same way before assigning them.

---

## PART 5 — PHASE PLAN (standard format per phase)

Each phase below follows: Objective · Why · Prerequisites · Team Assignments · Parallel/Sequential · Files · DB/API/FE/BE/AI changes · Testing · Integration · Definition of Done · Claude Code Prompt.

### PHASE 0 — Repository Audit & Understanding
**Objective:** Replace every [STATED]/[UNKNOWN] label in Part 0 with [VERIFIED]/[PARTIAL]/[PLANNED]/[MISSING], backed by a file path.
**Why:** Every later phase's scope depends on what already exists — building over an unverified assumption wastes the most expensive resource (developer time) on day one.
**Prerequisites:** Repo access for all 4 teammates.
**Team Assignments:**
```
T1: Audit frontend/ — pages, components, state mgmt, API client stubs
T2: Audit backend/routers, services/classifier.py, services/pipeline.py, auth
T3: Audit retrieval code, ChromaDB/BM25 setup, any Engine-related files, data/
T4: Audit tests/, CI config, Docker, .env.example, README accuracy
```
**Parallel Work:** All 4 fully parallel — no shared files touched.
**Sequential Dependencies:** None within this phase; Phase 1 cannot start until all 4 audits are merged into one document.
**Files To Create:** `docs/AUDIT_RESULTS.md` (one shared file, one section per teammate).
**Files To Modify:** None (read-only phase).
**Database/API/Frontend/Backend/AI Changes:** None — audit only.
**Testing:** N/A.
**Integration:** Merge all 4 audit sections same day; hold a 30-minute sync to reconcile disagreements (e.g., T2 says pipeline.py is a stub, T3 says it calls real retrieval — resolve by reading it together).
**Definition of Done:**
```
[ ] Every row in Part 0's table has a real status + file path
[ ] Team agrees on the corrected P0/P1/P2 feature list (may differ from the prior blueprint)
[ ] AUDIT_RESULTS.md committed to docs/
```
**Claude Code Prompt (per teammate, adapt the folder):**
```
You are auditing the <frontend|backend|retrieval/data|tests & CI> portion of the Legal Saathi repo.
Read: docs/legal-saathi-blueprint.md (architecture reference — not necessarily reality).
Task: for each component the blueprint claims exists in your area, inspect the actual code and
report: VERIFIED (works, cite file+line), PARTIAL (exists but incomplete — say what's missing),
PLANNED (mentioned only in comments/docs, no real implementation), or MISSING.
Do not modify any files. Output a markdown table only.
```

---

### PHASE 1 — Architecture Freeze
**Objective:** Lock the Case schema, API contract shapes, and any corrections Phase 0 revealed, so all 4 teammates build against the same nouns.
**Why:** Parallel work only works if everyone agrees on the shape of `Case`, `Citation`, `Incident` etc. before writing code against them.
**Prerequisites:** Phase 0 complete.
**Team Assignments:**
```
T1: Review API contract (Part 14) for frontend feasibility, flag anything unworkable
T2: Own the API contract draft, incorporate feedback
T3: Own the Case schema draft (Section 8.1 of blueprint), incorporate Engine's needs
T4: Confirm testing/CI implications, flag any tooling gaps
```
**Parallel Work:** Draft-then-review is inherently sequential for the shared artifact, but all 4 can review simultaneously.
**Sequential Dependencies:** Phases 2+ cannot start until this is signed off.
**Files To Create:** `docs/CASE_SCHEMA.md`, `docs/API_CONTRACT.md` (frozen versions of blueprint Sections 8.1 and 12).
**Definition of Done:**
```
[ ] Case schema fields finalized, typed, and agreed by T1–T4
[ ] API contract for /chat, /cases, /retrieval/search, /incidents/similar frozen
[ ] Any Phase-0-driven scope changes reflected in an updated P0/P1/P2 list
```
**Claude Code Prompt:**
```
Read docs/legal-saathi-blueprint.md Section 8.1 (Case schema) and Section 12 (API design) and
docs/AUDIT_RESULTS.md. Produce docs/CASE_SCHEMA.md as a concrete Pydantic model (backend) and
matching TypeScript interface (frontend) for the Case object, incorporating any audit findings
that change field names or types. Do not implement any endpoints yet — this is a contract-only task.
```

---

### PHASE 2 — Environment & Skeletons (Parallel)
**Objective:** Working local dev environment; empty-but-running FE/BE skeletons; corpus ingestion scaffold; CI pipeline scaffold.
**Why:** Everyone needs to run the app locally before building features into it.
**Prerequisites:** Phase 1 signed off.
**Team Assignments:**
```
T1: Next.js app scaffold, routing per Section 9 of blueprint, API client stub against
    docs/API_CONTRACT.md (mocked responses)
T2: FastAPI app scaffold, routers per Section 10, /health endpoint, .env.example
T3: Ingestion script skeleton, ChromaDB + BM25 index bootstrap on a tiny (5-doc) test corpus
T4: CI pipeline (lint + build + test stage, even with zero tests yet), Docker Compose for
    local FE+BE+ChromaDB, README dev-setup instructions
```
**Parallel Work:** Fully parallel — no shared files.
**Files To Create:**
```
frontend/app/*, frontend/lib/api-client.ts
backend/main.py, backend/routers/health.py, backend/core/config.py
scripts/ingest_corpus.py, data/raw/.gitkeep
.github/workflows/ci.yml (or equivalent), docker-compose.yml
```
**Definition of Done:**
```
[ ] `docker compose up` runs FE + BE + ChromaDB locally for all 4 teammates
[ ] /health returns 200
[ ] Frontend renders a chat page against mocked API responses
[ ] CI runs (even trivially) on every PR
```
**Claude Code Prompt (T2 example):**
```
Read docs/API_CONTRACT.md and docs/CASE_SCHEMA.md. Scaffold a FastAPI app with the router
structure from docs/legal-saathi-blueprint.md Section 10. Implement only GET /health for now —
every other router should exist as a file with a stub handler returning 501 Not Implemented.
Do not implement business logic yet. Run the app and confirm /health returns 200 before reporting done.
```

---

### PHASE 3 — Case Schema Implementation + Corpus Foundation
**Objective:** Case schema is a real, persisted object; a small real legal corpus is ingested and queryable.
**Team Assignments:**
```
T2: Implement Case DB model + /cases POST/GET per the frozen schema
T3: Ingest 20-30 real Act sections/judgments (Milestone-1-sized corpus), build ChromaDB +
    BM25 indexes, implement fusion/re-ranking, expose retrieval_service.py
T1: Build the Case creation UI flow (can run against T2's real endpoint once ready)
T4: Write DB migration tooling / seed scripts, add first unit tests for /cases and retrieval
```
**Sequential Dependencies:** T1's UI needs T2's `/cases` endpoint; T2's endpoint needs the Case schema from Phase 1 (already frozen).
**Definition of Done:**
```
[ ] POST /cases persists a real row; GET /cases/{id} returns it
[ ] /retrieval/search returns real, ranked, cited-source-ready chunks for a test query
[ ] Golden query set (docs/eval/golden_queries.json, 15-20 entries) exists and passes a
    baseline precision check
```
**Claude Code Prompt (T3 example):**
```
Read docs/legal-saathi-blueprint.md Section 7 (RAG Architecture). Implement
backend/services/retrieval_service.py: ingest the documents in data/raw/ (Acts/judgments),
chunk by logical section, embed and store in ChromaDB, build a parallel BM25 index, and
implement a fused/re-ranked search function. Write a golden query set of 15 questions with
their expected source chunk IDs into data/eval/golden_queries.json and a script that reports
precision@5 against it. Do not touch backend/routers/ — expose only the service function.
```

---

### PHASE 4 — First Complete Grounded Chatbot Workflow (Milestone 1 — CRITICAL PATH)
**Objective:** `User Question → Intent → Legal Retrieval → Verified Answer → Citation → Action` works end-to-end.
**Team Assignments:**
```
T2: Wire pipeline.py: classify → call T3's retrieval_service → assemble context → call LLM
    abstraction → citation_service → confidence score → response
T3: LLM abstraction layer (primary + fallback provider), citation_service (claim→source
    mapping using the retrieved chunk metadata)
T1: Chat UI wired to the real /chat endpoint; CitationCard, ConfidenceBadge components
T4: E2E test script for this exact flow; this is the single most important test in the project
```
**Definition of Done (this is Milestone 1 from the blueprint, Part 16):**
```
[ ] A real question returns an answer with a strong/partial/insufficient confidence badge
[ ] Citations shown are traceable to actual retrieved chunks (spot-check 5 by hand)
[ ] Fallback LLM provider tested by deliberately breaking the primary
[ ] One action module (Evidence Checklist, hard-coded template) offered at the end
```
**Claude Code Prompt (T2 example):**
```
Read docs/API_CONTRACT.md's /chat spec and backend/services/retrieval_service.py's public
interface (do not modify it). Implement backend/services/pipeline.py to orchestrate:
classifier.py → retrieval_service.search() → context assembly → llm_provider.generate()
→ citation_service.attach_citations(). If the primary LLM provider call fails or times out
(>8s), retry once against the fallback provider before returning an error. Wire this into
POST /chat. Run the golden query set through it and report the confidence-badge distribution.
```

---

### PHASE 5 — Case Workspace + First Action Module
**Team Assignments:**
```
T1: Case workspace page (history, citations, evidence checklist view)
T2: /cases/{id} PATCH, evidence tracking fields
T4: Evidence Checklist action module (backend/routers/actions/notice.py or checklist
    equivalent) — template lookup by issue_type
T3: Support with issue-type taxonomy needed for checklist templates
```
**Definition of Done:**
```
[ ] A user's case persists across the session and shows accumulated evidence status
[ ] Evidence Checklist generates a real, issue-type-specific list, not a generic placeholder
```

---

### PHASE 6 — Additional Action Modules
**Team Assignments:** `T4` leads Notice/RTI draft generation; `T2` exposes the endpoints; `T1` builds the corresponding forms/draft display.
**Definition of Done:** at least one additional action module (Notice or RTI) produces a real draft from real Case data, reviewed for template quality by T4.

---

### PHASE 7 — Voice + Legal Saathi Engine v1 (Parallel)
**Team Assignments:**
```
T4: STT → normalize → existing pipeline → TTS, for one language, full round trip
T3: Engine v1 — entity extraction refinement, normalization, pairwise similarity scoring
    + human-readable explanation on seeded incident data (Section 8 of blueprint)
```
**Definition of Done:**
```
[ ] A spoken question in the target language produces a spoken, cited answer
[ ] Given 10 seeded incidents (2-3 known-similar pairs), the Engine correctly flags the
    similar pairs and explains why, with zero false positives on the deliberately dissimilar ones
```

---

### PHASE 8 — Collective Workflow
**Team Assignments:** `T3` implements clustering + consent gating; `T1` builds the consent UI and cluster explanation view; `T2` exposes `/incidents`, `/incidents/{id}/similar`; `T4` reviews for privacy leaks (this is the highest-risk phase for accidental PII exposure — see Part 10, Security Roadmap).
**Definition of Done:** a consenting user sees an aggregate pattern first, and only individual detail after a second, explicit consent step; a non-consenting user's case never appears to anyone else.

---

### PHASE 9 — Testing, Security, Performance
**Team Assignments:** Each teammate owns their layer's test suite (Part 8, Team Ownership Matrix); `T4` owns the E2E suite and the security checklist (Part 10) end-to-end.
**Definition of Done:** CI green on all suites; security checklist (Part 10) fully checked off; no P0 bug open.

---

### PHASE 10 — Final Polish & Demo Rehearsal
**Team Assignments:** All 4 — UI polish (T1), reliability hardening (T2), retrieval/Engine edge cases (T3), full run-throughs + fallback rehearsal (T4).
**Definition of Done:** the Final Demo Story (blueprint Section 26) runs successfully twice in a row without manual intervention.

---

## PART 6 — ATOMIC TASK BREAKDOWN (worked example: the critical-path feature)

Use this as the template to atomize every other phase's tasks the same way. This example covers Phase 3–4's core deliverable, "Case Schema + Grounded Answer Pipeline," because it sits on the critical path.

| Task ID | Name | Owner | Priority | Depends On | Files |
|---|---|---|---|---|---|
| CORE-001 | Define Case Pydantic model | T3 | P0 | ARCH-001 (schema freeze) | `backend/schemas/case.py` |
| CORE-002 | DB migration for `cases` table | T2 | P0 | CORE-001 | `backend/data/models/case.py`, migration file |
| CORE-003 | POST /cases endpoint | T2 | P0 | CORE-002 | `backend/routers/cases.py` |
| CORE-004 | GET /cases/{id} endpoint | T2 | P0 | CORE-002 | `backend/routers/cases.py` |
| CORE-005 | Corpus ingestion script | T3 | P0 | none | `scripts/ingest_corpus.py` |
| CORE-006 | ChromaDB + BM25 hybrid index + fusion | T3 | P0 | CORE-005 | `backend/services/retrieval_service.py` |
| CORE-007 | LLM abstraction (primary+fallback) | T2 | P0 | none | `backend/services/llm_provider.py` |
| CORE-008 | Citation/confidence service | T2 | P0 | CORE-006 | `backend/services/citation_service.py` |
| CORE-009 | Pipeline orchestration | T2 | P0 | CORE-003, CORE-006, CORE-007, CORE-008 | `backend/services/pipeline.py` |
| CORE-010 | POST /chat endpoint | T2 | P0 | CORE-009 | `backend/routers/chat.py` |
| CORE-011 | Frontend chat UI + citation/confidence components | T1 | P0 | CORE-010 (or mocked earlier) | `frontend/app/chat/*`, `frontend/components/*` |
| CORE-012 | Golden query set + precision test | T3 | P0 | CORE-006 | `data/eval/golden_queries.json` |
| CORE-013 | E2E test: full grounded-answer flow | T4 | P0 | CORE-011 | `tests/e2e/chat_flow.spec.ts` |

**Per-task detail example (CORE-009, the highest-risk task):**
```
Task ID: CORE-009
Name: Pipeline orchestration
Owner: T2
Priority: P0
Dependencies: CORE-003, CORE-006, CORE-007, CORE-008
Files: backend/services/pipeline.py
Inputs: user text, session_id, language
Outputs: { answer, citations[], confidence, suggested_action }
Implementation Steps:
  1. Call classifier.py → issue_type, urgency
  2. If urgency == "emergency" → short-circuit to emergency routing response, skip rest
  3. Call retrieval_service.search(query, corpus=issue_type) → ranked chunks
  4. Assemble context pack (chunks + metadata)
  5. Call llm_provider.generate(context, question) with fallback on failure/timeout
  6. Call citation_service.attach_citations(llm_output, chunks) → citations + confidence
  7. Return structured response
Testing: unit test with a mocked retrieval_service and llm_provider; integration test with
  real (small) corpus and real LLM call against 3 golden queries
Definition of Done: golden query set run produces a confidence-badge distribution reviewed
  and accepted by T2+T3 together (not just "it returns 200")
```

---

## PART 7 — API CONTRACTS (frozen in Phase 1, implemented in Phase 3-4)

```http
POST /chat
```
Request:
```json
{ "session_id": "string", "text": "string", "lang": "hi|en|..." }
```
Response:
```json
{
  "answer": "string",
  "citations": [{ "source_id": "string", "title": "string", "section_ref": "string", "excerpt": "string" }],
  "confidence": "strong|partial|insufficient",
  "suggested_action": { "type": "checklist|notice|rti|none", "action_id": "string|null" }
}
```
Errors: `{ "error": "retrieval_unavailable|llm_unavailable|invalid_input", "code": 503|400 }`

```http
POST /cases
GET  /cases/{id}
PATCH /cases/{id}
```
Request (POST): the Case object per `docs/CASE_SCHEMA.md` (issue_type, entities, etc. — partial objects allowed, missing fields inferred later).
Response: `{ "case_id": "string", "case": { ...Case } }`

```http
POST /retrieval/search
```
Request: `{ "query": "string", "corpus": "acts|judgments|incidents", "top_k": 5 }`
Response: `{ "chunks": [{ "chunk_id", "text", "source_id", "score", "metadata" }] }`

```http
GET /incidents/{id}/similar
```
Response: `{ "similar": [{ "incident_id", "similarity_score", "explanation", "matched_fields": [] }] }`

All endpoints: standard error format `{ "error": "string", "code": number }`; auth via session header once AUTH tasks land; no pagination needed at hackathon scale except `/analytics/summary`.

---

## PART 8 — MOCKING STRATEGY

```
Frontend (T1) ──► Mock API (hand-written fixtures matching docs/API_CONTRACT.md)
                       │  (swap once real endpoint exists)
                       ▼
                   Real API (T2)

Pipeline (T2) ──► Mock retrieval_service (returns fixed chunks)
                       │  (swap once T3's real index is ready)
                       ▼
                   Real retrieval_service (T3)

Engine (T3) ──► Mock consent store (in-memory dict)
                       │  (swap once real DB consent field exists)
                       ▼
                   Real consent persistence (T2)
```
**Rule:** mocks live in a clearly named `__mocks__/` or `fixtures/` folder next to the real implementation, never inline in production files, so removing a mock is a one-line import change, not a code hunt.

---

## PART 9 — GIT / BRANCHING STRATEGY

```
main        — always deployable, demo-ready
develop     — integration branch, CI must pass before merge
feature/*   — one branch per task ID, e.g. feature/core-009-pipeline-orchestration
```
**Rules:**
- Branch name = task ID + short description: `feature/core-009-pipeline-orchestration`
- Commit format: `[CORE-009] Wire pipeline orchestration with LLM fallback`
- PRs require 1 review from a teammate who owns an adjacent area (T2's PR reviewed by T3 or T4, not another BE-only task if avoidable) to catch contract drift early
- No one merges a change to `docs/CASE_SCHEMA.md` or `docs/API_CONTRACT.md` without a message to the other 3 teammates first (see Part 12, Shared Contracts)
- Conflicts in shared contract files are resolved live (call/chat), not by whoever merges first

---

## PART 10 — SECURITY ROADMAP

| ID | Task | Owner | Notes |
|---|---|---|---|
| SEC-001 | Session-based auth | T2 | Full accounts are P1/P2, session is P0 |
| SEC-002 | Authorization (own-case-only access) | T2 | Enforced at query level, not just UI |
| SEC-003 | Input validation | T2 | Pydantic schemas on every endpoint, reject oversized payloads |
| SEC-004 | Secrets management | T4 | LLM/provider keys in env vars, never committed |
| SEC-005 | Rate limiting | T4 | Per-session/IP on /chat and /voice |
| SEC-006 | Prompt-injection guard | T2+T3 | Retrieved text and user input never override system instructions |
| SEC-007 | Malicious document handling | T4 | Sanitize/scan any uploaded evidence files |
| SEC-008 | Incident/Engine privacy enforcement | T3 | Bucketing/hashing before any cross-user comparison (highest-risk area, extra review in Phase 8) |
| SEC-009 | Consent audit trail | T2 | AuditEvent on every consent grant/revoke |
| SEC-010 | Logging hygiene | T2 | No raw complaint text in plaintext logs where avoidable |

---

## PART 11 — TESTING ROADMAP

| Owner | Scope |
|---|---|
| T1 | Component rendering, loading/error/empty states, accessibility checks |
| T2 | Unit tests per service, API contract tests, auth/rate-limit tests |
| T3 | Retrieval precision/recall on golden set, citation accuracy audit, Engine similarity precision on seeded pairs |
| T4 | E2E flow (text + voice variants), security test pass, CI enforcement of all of the above |

---

## PART 12 — DEPLOYMENT ROADMAP

```
Local (docker-compose) → Staging (same stack, seeded demo corpus) → Demo/Production
```
Each environment needs its own `.env` (never shared secrets between them), its own ChromaDB volume (staging seeded with the golden/demo corpus, not scratch data), and a documented one-command deploy + rollback script owned by T4.

---

## PART 13 — MVP / DEMO SCOPE (unchanged from the earlier blueprint, restated for this plan)

```
MVP = Phase 4 (grounded, cited chat) + Phase 5 (Evidence Checklist)
CORE DEMO ADD-ONS = Phase 6 (one more action module) + Phase 7 (voice, Engine v1)
POLISH = Phase 9-10
P2 (only if ahead of schedule) = full clustering, consent-gated collective UI, DLSA/e-FIR
```
**Must have / Should have / Nice to have** mirrors the P0/P1/P2 table already in `docs/legal-saathi-blueprint.md` Section 4 — this roadmap does not re-litigate it, only schedules it.

---

## PART 14 — RISK REGISTER

| Risk | Probability | Impact | Owner | Mitigation | Trigger |
|---|---|---|---|---|---|
| Phase 4 (critical path) slips | Medium | High | T2/T3 | Cut Phase 6-8 scope first, protect Phase 4 timeline | Phase 4 not done by planned midpoint |
| LLM provider outage during demo | Low | High | T2 | Fallback provider tested well before demo day, not on demo day | Any primary-provider error in final rehearsal |
| Engine produces false-positive clusters | Medium | Medium (trust/privacy risk) | T3 | Require multi-field agreement (blueprint 8.11), always show explanation | Any seeded dissimilar pair gets clustered in testing |
| Corpus too small/narrow for demo questions | Medium | Medium | T3 | Golden query set built early (Phase 3), gaps found before Phase 4 crunch | Precision@5 below acceptable threshold on golden set |
| Contract drift (FE/BE disagree on shape) | Medium | High | T1+T2 | Frozen contract in Phase 1, PR review rule (Part 9) | Any runtime type-mismatch bug |
| Privacy leak in cluster UI | Low | Very High | T3+T4 | Dedicated security review in Phase 8 (Part 10, SEC-008) | Any raw PII visible in a cluster view during testing |
| Scope creep from Part-22-style feature list | High | Medium | All (PM role) | P0/P1/P2 discipline; new ideas go to P2 unless they unblock P0 | Any new feature proposed after Phase 4 without a P0 justification |

---

## PART 15 — TEAM COMMUNICATION & CHANGE MANAGEMENT

**Shared contracts — no one changes these unilaterally:**
```
Case schema · API response formats · Auth flow · DB schema · Engine similarity fields
```
**Change process:**
```
Problem discovered → document it in a shared note → propose the change →
identify who else it affects → get their explicit OK → update docs/CASE_SCHEMA.md
or docs/API_CONTRACT.md → then implement
```
No one rewrites a shared contract "while they're in there anyway." If Phase 0's audit reveals the original architecture was wrong somewhere, that's exactly the process above, not a silent fix.

---

## PART 16 — DAILY WORKFLOW & END-OF-DAY CHECKLIST

```
Pull develop → read assigned task ID → check its dependencies are actually done
→ Claude Code planning pass → implement only that task → run tests → run build
→ commit with task ID in message → open PR → request review from an adjacent-area teammate
```
**End of day:**
```
[ ] Task implemented and matches its Definition of Done
[ ] Tests written and passing
[ ] Build passing
[ ] No unrelated files changed
[ ] Shared contract untouched, or touched only via the Part 15 process
[ ] Commit pushed, PR open or merged
```

---

## PART 17 — CLAUDE CODE / AI-ASSISTED WORKFLOW RULES

**Always give Claude Code, at the start of every session:** the relevant section of `docs/legal-saathi-blueprint.md`, `docs/CASE_SCHEMA.md` / `docs/API_CONTRACT.md`, and the specific task ID + Definition of Done from this roadmap.

```
DO NOT let it:                         ALWAYS have it:
- rewrite unrelated code                - inspect existing implementation first
- change the Case schema/API silently   - reuse existing utilities/services
- install unnecessary packages          - follow the frozen contracts
- remove working functionality          - run tests + build before declaring done
- touch another teammate's task's files - report exactly which files changed
- skip tests "to save time"             - flag anything it's unsure about, not guess
```

**Generic per-task prompt template** (fill in the task ID row from Part 6 or the phase tables):
```
You are working on TASK <ID>.
Read: docs/legal-saathi-blueprint.md (relevant section), docs/CASE_SCHEMA.md, docs/API_CONTRACT.md.
Your task: <Name from the task table>.
Before coding: inspect the existing files listed in "Files" for this task. Do not redesign
the architecture or touch files outside this task's scope.
Implement only this task, to its stated Definition of Done.
After implementation: run tests, run the build/type check, list exactly which files changed,
and explicitly flag anything you were unsure about rather than guessing.
```

---

## PART 18 — TEAMMATE MASTER PROMPTS (paste at the start of each teammate's Claude Code session)

### TEAMMATE 1 MASTER PROMPT — Frontend
```
You are Teammate 1 (Frontend) on Legal Saathi. Read docs/legal-saathi-blueprint.md Sections
2, 9, and 21; docs/PROJECT_DEVELOPMENT_ROADMAP.md Parts 2, 5 (Phases 2/4/5), 7 (API contract).
Your responsibility: Next.js pages/components, state management, the API client layer, and
all loading/error/empty states. You never touch backend/, scripts/, or docs/CASE_SCHEMA.md
without flagging it to the team first (Part 15 of the roadmap).
Work strictly against docs/API_CONTRACT.md — if the real backend endpoint isn't ready yet,
build against a mock matching that exact shape (Part 8, Mocking Strategy) and swap it in once
T2 confirms the endpoint is live.
Your current task ID is: <fill in from the phase/task tables>.
Follow the Claude Code rules in Part 17 exactly.
```

### TEAMMATE 2 MASTER PROMPT — Backend / API / Orchestration
```
You are Teammate 2 (Backend) on Legal Saathi. Read docs/legal-saathi-blueprint.md Sections
5, 6, 10, 12, 18; docs/PROJECT_DEVELOPMENT_ROADMAP.md Parts 5 (Phases 2-4), 6, 7, 10 (Security).
Your responsibility: FastAPI routers, classifier.py/pipeline.py orchestration, the LLM
abstraction layer, the citation/trust layer, auth/session, and backend/safety/.
You consume T3's retrieval_service and Case schema as fixed interfaces — you do not modify
their internals; if something about them blocks you, raise it per Part 15, don't work around
it by duplicating logic.
Your current task ID is: <fill in>.
Follow the Claude Code rules in Part 17 exactly.
```

### TEAMMATE 3 MASTER PROMPT — Data / Retrieval / AI / Legal Saathi Engine
```
You are Teammate 3 (Data/AI/Engine) on Legal Saathi. Read docs/legal-saathi-blueprint.md
Sections 7, 8; docs/PROJECT_DEVELOPMENT_ROADMAP.md Parts 5 (Phases 2-3, 7-8), 6, 10 (SEC-008).
Your responsibility: corpus ingestion, chunking, the hybrid ChromaDB+BM25 index and fusion
ranking, the Case schema (you own this contract — changes go through Part 15), and the entire
Legal Saathi Engine (extraction, normalization, similarity, clustering, explanation, consent).
Privacy is your highest-stakes area: never let raw PII leave a user's own case context without
passing through the bucketing/hashing described in blueprint Section 8.3 — this is checked
explicitly in Phase 8's security review, but you should assume T4 will audit it, not that they will
catch everything, so validate it yourself first.
Your current task ID is: <fill in>.
Follow the Claude Code rules in Part 17 exactly.
```

### TEAMMATE 4 MASTER PROMPT — Voice / Action Modules / Integration / DevOps / QA
```
You are Teammate 4 (Voice/Actions/Integration/QA) on Legal Saathi. Read docs/legal-saathi-
blueprint.md Sections 17-20; docs/PROJECT_DEVELOPMENT_ROADMAP.md Parts 5 (Phases 2, 5-7, 9),
9 (Git), 10 (Security), 11 (Testing).
Your responsibility until Phase 4 lands: CI pipeline, Docker/env setup, test scaffolding —
none of this depends on the other three finishing anything, so don't wait idle. After Phase 4:
voice integration (STT/TTS), action modules (Notice/RTI/DLSA/e-FIR/Checklist), and owning the
full testing + security checklist end to end.
You are also the team's PR-review safety net for shared-contract drift — if a PR touches
docs/CASE_SCHEMA.md or docs/API_CONTRACT.md without the Part 15 process having happened, flag it
before approving.
Your current task ID is: <fill in>.
Follow the Claude Code rules in Part 17 exactly.
```

---

## PART 19 — INTEGRATION CHECKPOINTS

| Checkpoint | What's tested | Participants | Must work | Rollback |
|---|---|---|---|---|
| 1 — FE + BE | Chat UI against real /chat | T1, T2 | Real question → real cited answer renders correctly | Revert to mocked API client |
| 2 — BE + Retrieval | Pipeline against real corpus | T2, T3 | Golden query set produces expected confidence distribution | Pin to last known-good corpus/index |
| 3 — Engine + Core | Similarity/clustering against seeded incidents | T3, T2 | Known-similar pairs cluster, known-dissimilar don't | Disable clustering, fall back to Phase-4-only demo |
| 4 — Full System | End-to-end text + voice demo flow | All 4 | Final Demo Story (blueprint Sec. 26) completes twice in a row | Fall back to text-only demo |

---

## PART 20 — FINAL MASTER CHECKLIST

```
ARCHITECTURE
[ ] Phase 0 audit complete, all statuses converted from [UNKNOWN]
[ ] Case schema + API contract frozen (Phase 1)

DATABASE
[ ] Case, Evidence, Source, Citation, Incident, Cluster, Draft, AuditEvent tables exist
[ ] Migrations run cleanly on a fresh environment

BACKEND
[ ] /health, /chat, /cases, /retrieval/search live and tested
[ ] LLM fallback verified under a forced primary-provider failure

FRONTEND
[ ] Chat UI, case workspace, at least one action module UI complete
[ ] Loading/error/empty states designed for every async view (not just spinners)

AI / RAG / ENGINE
[ ] Golden query set passes an agreed precision threshold
[ ] Engine similarity tested against seeded known-similar/dissimilar pairs

ACTIONS
[ ] Evidence Checklist fully working end-to-end
[ ] At least one of Notice/RTI working end-to-end

SECURITY
[ ] Part 10 checklist fully checked off
[ ] Privacy review of Engine/cluster views specifically signed off (SEC-008)

TESTING
[ ] Unit tests per service; E2E text-flow and voice-flow tests both passing in CI

DEVOPS
[ ] docker compose up works for a new teammate with zero manual steps beyond .env
[ ] CI blocks merge on failing tests/build

DEMO
[ ] Final Demo Story runs twice in a row without manual intervention
```

## PART 21 — FINAL PROJECT STATUS DASHBOARD (template — fill in during Phase 9)

| Area | Completion | Status | Owner | Blocking? | Next Task |
|---|---|---|---|---|---|
| Architecture | Not measured | | | | |
| Database | Not measured | | | | |
| Backend | Not measured | | | | |
| Frontend | Not measured | | | | |
| AI/RAG/Engine | Not measured | | | | |
| Actions | Not measured | | | | |
| Testing | Not measured | | | | |
| Security | Not measured | | | | |
| Deployment | Not measured | | | | |

*(Do not fabricate percentages — fill this in only from real CI/test output and the checklist above.)*

---

## PART 22 — FINAL RECOMMENDED EXECUTION ORDER

```
Phase 0  Repository Audit (ALL, parallel, ~half a day)
   ↓
Phase 1  Architecture Freeze — Case schema + API contract (ALL, joint)
   ↓
Phase 2  Environment & Skeletons (T1/T2/T3/T4, fully parallel)
   ↓
Phase 3  Case Schema Implementation + Corpus Foundation (T2+T3, T1/T4 continue parallel work)
   ↓
Phase 4  ★ First Grounded Chatbot Workflow — CRITICAL PATH ★ (T2+T3, T1 wires UI, T4 writes E2E test)
   ↓
Phase 5  Case Workspace + Evidence Checklist (T1+T4, T2 supports)
   ↓
Phase 6  Additional Action Module (T4 leads, T1+T2 support)      ─┐
Phase 7  Voice (T4) + Engine v1 (T3), run in parallel             ├─ can overlap
   ↓                                                              ─┘
Phase 8  Collective Workflow (T3 drives, T1 UI, T2 API, T4 privacy review)
   ↓
Phase 9  Testing / Security / Performance (ALL, T4 leads)
   ↓
Phase 10 Final Polish & Demo Rehearsal (ALL)
```

**One-line summary for the team:** audit before you build, freeze the Case schema and API contract before you split up, protect Phase 4 above everything else, and never let a P2 idea from the feature list (blueprint Section 22) touch the critical path before Phase 8.
