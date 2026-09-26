# Legal Saathi — Complete Project Document

> **A single-source-of-truth document** consolidating the full technical blueprint, development roadmap, team structure, and execution playbook for Legal Saathi — an evidence-grounded, multilingual, voice-capable legal assistance platform for Indian citizens.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Core Journey](#2-product-vision--core-journey)
3. [Current Project Analysis](#3-current-project-analysis)
4. [Feature Priorities (P0 / P1 / P2)](#4-feature-priorities-p0--p1--p2)
5. [System Architecture](#5-system-architecture)
6. [Detailed Data Flows](#6-detailed-data-flows)
7. [RAG Architecture](#7-rag-architecture)
8. [Legal Saathi Engine — Technical Design](#8-legal-saathi-engine--technical-design)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Backend Architecture](#10-backend-architecture)
11. [Repository Structure](#11-repository-structure)
12. [API Design](#12-api-design)
13. [Database & Data Model](#13-database--data-model)
14. [Team Structure (4 Developers)](#14-team-structure-4-developers)
15. [Parallel Execution Model](#15-parallel-execution-model)
16. [Development Roadmap (Phase 0–10)](#16-development-roadmap-phase-010)
17. [Atomic Task Breakdown](#17-atomic-task-breakdown)
18. [API Contracts (Frozen in Phase 1)](#18-api-contracts-frozen-in-phase-1)
19. [Mocking Strategy](#19-mocking-strategy)
20. [Git & Branching Strategy](#20-git--branching-strategy)
21. [Testing Strategy](#21-testing-strategy)
22. [Security & Privacy](#22-security--privacy)
23. [Reliability & Performance](#23-reliability--performance)
24. [UX Improvements](#24-ux-improvements)
25. [New Features & Features to Avoid](#25-new-features--features-to-avoid)
26. [AI-Assisted "Vibe Coding" Playbook](#26-ai-assisted-vibe-coding-playbook)
27. [Risk Register](#27-risk-register)
28. [Demo Story & Presentation Strategy](#28-demo-story--presentation-strategy)
29. [Master Checklists](#29-master-checklists)

---

## 1. Executive Summary

### Problem
Most citizens facing a legal problem in India don't lack access to a chatbot — they lack access to **trustworthy, understandable, actionable** legal guidance. Existing tools either (a) give generic AI answers with no traceable legal source, (b) require legal literacy the user doesn't have, or (c) stop at "information" and never help the user actually *do* anything about their problem. There is also no mechanism for a citizen to discover that their "individual" problem is actually part of a **pattern** affecting many people in their area — which is often exactly the kind of case that benefits from collective legal action.

### Solution
**Legal Saathi** is a multilingual, voice-capable legal assistance platform that takes a citizen's problem in their own words (text or voice, in a regional language) and carries it through a verifiable pipeline: understand the case → retrieve real legal sources (Acts, judgments) → generate an answer that is grounded in and cited to those sources → surface concrete next actions (notices, RTI, DLSA, e-FIR guidance) → and, through the **Legal Saathi Engine**, detect when this complaint resembles other citizens' complaints so that a privacy-preserving, consent-gated **collective action** pathway can be offered.

### Target Users
- Citizens with limited legal knowledge, including low digital literacy and non-English speakers, who need to understand a legal situation in plain language.
- Citizens who want to *act* — draft a notice, file an RTI, know what evidence to gather — not just read an explanation.
- Communities/groups experiencing the same recurring issue (e.g., a builder not delivering possession, a recurring consumer fraud pattern), who benefit from discovering they aren't alone.

### Why Legal Saathi Is Different

| Generic Legal Chatbot | Legal Saathi |
|---|---|
| Answers from LLM's internal knowledge | Answers grounded in retrieved Acts/judgments, LLM only synthesizes |
| No indication of source or confidence | Every answer shows sources + a confidence/evidence indicator |
| Conversation ends at "information" | Conversation routes into a concrete action module |
| Treats every conversation as isolated | Legal Saathi Engine links related incidents across users (with consent) |
| English-only or single-language | Multilingual text + voice as a first-class feature, not an add-on |
| No structured case memory | Structured case object (entities, timeline, evidence) persists and can be reused across the case lifecycle |

---

## 2. Product Vision & Core Journey

### Long-Term Vision
Legal Saathi should become the layer between "a citizen has a legal problem" and "a citizen has taken a correct, informed first step" — for any citizen, in their own language, with or without a lawyer, while quietly aggregating anonymized patterns that help identify systemic legal issues worth collective attention.

### Core User Journey

```
   CITIZEN
      │
      ▼
     ASK          (describe the problem — voice or text, any supported language)
      │
      ▼
  UNDERSTAND       (system extracts structured case facts, classifies the issue)
      │
      ▼
    VERIFY         (retrieve real legal sources that support / bear on the case)
      │
      ▼
   EXPLAIN         (grounded, cited, plain-language answer; confidence shown)
      │
      ▼
     ACT           (notice / RTI / DLSA / e-FIR / evidence checklist / case prep)
      │
      ▼
    UNITE          (Legal Saathi Engine: is this part of a larger pattern? consent → collective action)
```

### Product Principles
1. **Trust** — every legal answer shows its supporting sources where they exist.
2. **Evidence** — the LLM synthesizes, it does not invent; retrieval is the source of truth.
3. **Transparency** — the user always sees: where the answer came from, what's missing, what evidence was used, what the system is unsure about.
4. **Action** — every answer points toward something the citizen can actually do next.
5. **Multilingual Accessibility** — voice + regional language is core UX, not a bonus feature.
6. **Privacy** — incident clustering never exposes personal data without consent.
7. **Modularity** — frontend, backend, retrieval, voice, the Legal Saathi Engine, and action modules are independently replaceable pieces.

### Main Use Cases
- A tenant wants to know if a landlord can withhold a deposit without reason, and wants a notice drafted.
- A consumer wants to know if they can get a refund for a defective product and needs an evidence checklist before filing a consumer complaint.
- A citizen wants to file an RTI but doesn't know the correct format or department.
- A group of flat owners each files similar complaints about a builder and the system surfaces that pattern for potential collective action.
- A user who only speaks Hindi/Marathi/Tamil etc. wants to do all of the above by voice.

---

## 3. Current Project Analysis

> **Method note:** the items below are built from the technical direction supplied by the team. Nothing here was confirmed by reading the actual repository. Treat every row as a hypothesis to check via Phase 0 audit, not a fact.

### 3.1 What Already Exists (as described) [STATED]

| Area | Stated Current State |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind + Framer Motion — implies pages/components already scaffolded, but exact routes/components unknown |
| Backend | FastAPI + Python, with `classifier.py` and `pipeline.py` present — implies at least a basic intent classification step and an orchestration pipeline exist |
| Retrieval | ChromaDB (vector) + BM25 (lexical) intended for hybrid retrieval over Legal Acts, Judgments, Incident data — unclear if hybrid ranking (fusion) is actually implemented or if only one path is wired up |
| LLM layer | A primary + fallback LLM provider is intended, behind an abstraction layer — unclear if the abstraction layer exists yet or if the app currently calls one provider directly |
| Voice | STT, Indian language support, text normalization, TTS are intended — unclear how much is wired end-to-end vs. planned |
| Legal Saathi Engine | Described in detail as the core differentiator (entity extraction, normalization, similarity, clustering, explanation, consent, collective action) — this reads as the least-built part; likely conceptual/early-stage rather than implemented |

### 3.2 Current Architecture (as described) [STATED]
A monolithic-ish arrangement: Next.js frontend talking to a FastAPI backend, which contains a `classifier.py` (intent/case classification) and a `pipeline.py` (presumably the orchestration that calls retrieval + LLM). Retrieval is meant to be hybrid (ChromaDB + BM25) but there's no confirmation of a fusion/ranking layer, a citation-formatting layer, or a case-schema data model.

### 3.3 Incomplete or Weak Areas Likely to Exist
- **Citation layer**: does the pipeline currently attach a verifiable source (Act name, section, judgment citation) to each claim, or does the LLM just "mention" sources in free text?
- **Case schema**: is there a persisted structured object per conversation (entities, issue type, location, dates, amount) or is everything ephemeral per-request?
- **LLM abstraction layer**: is there actually a provider-agnostic interface, or is a specific SDK called directly inside `pipeline.py`?
- **Legal Saathi Engine**: almost certainly the least mature — likely no clustering, similarity scoring, or consent flow exists yet.
- **Action modules** (Legal Notice, RTI, DLSA, e-FIR): likely not implemented; these are P0/P1 build targets, not current state.
- **Auth/session**: no mention of an existing auth system — assume it doesn't exist yet unless verified.
- **Privacy/consent**: given the engine itself isn't confirmed built, consent flows are almost certainly not built either.

### 3.4 Phase 0 Audit Template

| Area | Status (pre-audit) | What Phase 0 must confirm |
|---|---|---|
| Frontend scaffold (Next.js/TS/Tailwind/Framer Motion) | [STATED] | Which pages/components exist vs. named-only |
| Backend scaffold (FastAPI, `classifier.py`, `pipeline.py`) | [STATED] | Do these files contain real logic or stubs? |
| Hybrid retrieval (ChromaDB + BM25) | [STATED], fusion unconfirmed | Is there an actual fusion/re-rank step, or just one index wired up? |
| LLM abstraction + fallback | [UNKNOWN] | Is there a provider-agnostic interface, or a hardcoded SDK call? |
| Case schema / persistence | [UNKNOWN] | Does any structured object survive past a single request? |
| Citation / trust layer | [UNKNOWN] | Do claims get checked against sources, or just narrated by the LLM? |
| Voice (STT/TTS) | [STATED], unclear completeness | Any working round trip at all, even one language? |
| Legal Saathi Engine | [STATED] as concept, [UNKNOWN] as code | Almost certainly the least built — confirm what (if anything) exists |
| Action modules (Notice/RTI/DLSA/e-FIR/Checklist) | [MISSING] (not mentioned as existing) | Confirm none exist yet |
| Auth/session | [UNKNOWN] | Confirm no auth exists, or find what's there |
| Tests, CI, Docker, env config | [UNKNOWN] | Confirm what tooling already exists |

---

## 4. Feature Priorities (P0 / P1 / P2)

### P0 — MUST HAVE (the demo doesn't work without these)
- Text-based chat: ask → understand → verify → explain, with visible citations
- Hybrid retrieval (ChromaDB + BM25) actually fused and ranked, over at least a small real corpus of Acts/judgments
- LLM abstraction layer with a working fallback
- Confidence/evidence indicator on every answer (strong / partial / insufficient support)
- At least one action module fully working end-to-end (recommend: **Evidence Checklist**)
- Basic case schema (structured extraction of issue type, parties, dates, amount, location) persisted per conversation
- Emergency/high-risk routing (detect and safely redirect urgent safety situations)

### P1 — IMPORTANT (materially strengthens the story, feasible in scope)
- One additional action module (Legal Notice draft, or RTI draft)
- Voice input in at least one Indian language (STT → normalize → same pipeline → TTS out)
- "Why this law applies" explanation (connects extracted facts to the retrieved section)
- Legal Saathi Engine v1: entity normalization + basic similarity scoring across stored incidents, with explanation
- Missing Information Assistant (targeted follow-up questions instead of generic ones)
- Multilingual legal simplification
- Complaint Quality Checker
- Case Similarity Explanation
- Privacy-First Cluster Participation (aggregate-first display)

### P2 — OPTIONAL (only if time allows)
- Full clustering (not just pairwise similarity) across many incidents
- Consent-gated collective action workflow (UI + backend)
- Case Timeline Builder
- Multiple additional action modules (DLSA guidance, e-FIR assistance)
- Source Comparison UI when multiple sources conflict
- Multilingual UI beyond voice (translated interface chrome)
- Case Progress Workspace

**Rule of thumb:** if a feature can't be demoed convincingly end-to-end in under 90 seconds, it's P1 or P2, not P0.

### Final Feature Matrix

| Feature | Priority | Owner | Demo Importance |
|---|---|---|---|
| Text chat with citations | P0 | Backend | Critical |
| Hybrid retrieval (fused) | P0 | RAG Team | Critical |
| Evidence/confidence indicator | P0 | Backend | Critical |
| Evidence Checklist action | P0 | Legal Workflow | Critical |
| Emergency/high-risk routing | P0 | Backend | Critical (ethical necessity) |
| LLM abstraction + fallback | P0 | Backend | High |
| Case schema persistence | P0 | Backend | High |
| Legal Notice / RTI draft | P1 | Legal Workflow | High |
| Voice (1 language round-trip) | P1 | Voice Team | High |
| "Why this law applies" | P1 | Backend/RAG | Medium-High |
| Missing Information Assistant | P1 | Backend | Medium |
| Engine v1 (similarity + explanation) | P1 | Engine Team | High (differentiator) |
| Multilingual simplification | P1 | Backend | Medium-High |
| Full clustering | P2 | Engine Team | Medium |
| Consent-gated collective workflow | P2 | Engine Team | Medium |
| Case Timeline Builder | P2 | Frontend | Low-Medium |
| Source Comparison UI | P2 | Frontend/RAG | Low |
| DLSA/e-FIR modules | P2 | Legal Workflow | Low |

---

## 5. System Architecture

```
                              ┌─────────────┐
                              │    USER     │
                              └──────┬──────┘
                                     │ text or voice
                              ┌──────▼──────┐
                              │  FRONTEND   │  Next.js / TS / Tailwind / Framer Motion
                              └──────┬──────┘
                                     │ REST/HTTP (JSON)
                              ┌──────▼──────┐
                              │  API LAYER  │  FastAPI routers, request validation (Pydantic)
                              └──────┬──────┘
                                     │
                        ┌────────────▼────────────┐
                        │  INTENT CLASSIFICATION   │  classifier.py — what kind of legal issue?
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │   CASE UNDERSTANDING     │  entity extraction into structured Case schema
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │    HYBRID RETRIEVAL      │  ChromaDB (semantic) + BM25 (exact) → fused ranking
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │   EVIDENCE / CONTEXT     │  assemble top-k chunks + metadata into a context pack
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │           LLM            │  primary provider → fallback provider (abstraction layer)
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │  TRUST / CITATION LAYER  │  attach verifiable sources, compute confidence indicator
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │       ACTION LAYER       │  Notice / RTI / DLSA / e-FIR / Evidence Checklist
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │   LEGAL SAATHI ENGINE    │  normalize → similarity → cluster → explain → consent
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │    COLLECTIVE ACTION     │  consent-gated group workflow
                        └──────────────────────────┘
```

### Layer-by-Layer Detail

- **Frontend** — renders the conversation, citations, evidence indicator, and action modules; handles voice capture and playback.
- **API Layer** — the only entry point into the backend; validates input, enforces auth/session, routes to services. No business logic lives here.
- **Intent Classification** (`classifier.py`) — decides what *kind* of legal issue this is (tenancy, consumer, family, criminal-adjacent, etc.), which determines which retrieval corpus and which action modules are relevant.
- **Case Understanding** — extracts structured entities (opposing party, issue type, location, amount, dates) into the Case schema. This is what makes everything downstream reusable instead of re-parsing raw text every time.
- **Hybrid Retrieval** — ChromaDB gives semantic matches (paraphrase-robust), BM25 gives exact-term matches (critical for legal text where exact section numbers and terms matter); results are fused, not just concatenated.
- **Evidence/Context Assembly** — turns raw retrieved chunks into a structured context pack (with source metadata) that the LLM is given — this is what makes citations possible later.
- **LLM** — generates the natural-language explanation *from* the context pack; is explicitly told not to introduce facts the context doesn't support. Runs through an abstraction layer so provider outages don't break the app.
- **Trust/Citation Layer** — the layer that enforces Trust and Evidence principles: it checks that claims in the LLM output map back to retrieved chunks, attaches source citations, and computes the confidence indicator (strong/partial/insufficient).
- **Action Layer** — converts a verified explanation into a concrete next step (a drafted notice, an RTI template, an evidence checklist).
- **Legal Saathi Engine** — operates on the structured Case objects (not raw conversation text) to find, cluster, and explain similarity across incidents, with privacy and consent enforced before any cross-user visibility.
- **Collective Action** — the consent-gated workflow that groups verified-similar incidents into a shared action.

---

## 6. Detailed Data Flows

### 6.1 Text Input Flow
```
User text
   → Normalization (cleanup, language detection)
   → Classifier (issue type, urgency)
   → Case Extraction (entities → Case schema)
   → Hybrid Retrieval (ChromaDB + BM25 over relevant corpus)
   → Ranking/Fusion (merge + re-rank results)
   → Context Assembly (top-k chunks + metadata → context pack)
   → LLM Generation (grounded answer from context pack only)
   → Citation Attachment (map claims → sources, compute confidence)
   → Response (answer + citations + confidence + suggested action)
   → Action Layer (user opts into a concrete next step)
```

### 6.2 Voice Input Flow
```
Voice
   → Speech-to-Text (language-aware STT)
   → Language Detection / Confirmation
   → Text Normalization (STT artifacts cleaned, e.g. filler words, code-switching)
   → [same legal processing pipeline as 6.1]
   → Verified Response (text)
   → Text-to-Speech (spoken back in the same language)
```

### 6.3 Incident / Legal Saathi Engine Flow
```
Complaint (already parsed into Case schema by 6.1)
   → Entity Extraction (confirm/refine structured fields)
   → Normalization (canonical forms: dates, amounts, locations, issue taxonomy)
   → Similarity Scoring (compare against existing incidents on normalized fields + embeddings)
   → Candidate Clustering (group incidents above a similarity threshold)
   → Explanation (human-readable reason: "same opposing party + same issue type + same locality")
   → Consent Prompt (user is asked, explicitly, before being shown as part of a cluster)
   → Collective Action (only for consenting users, aggregate-first, details revealed progressively)
```

---

## 7. RAG Architecture

### Pipeline Stages
1. **Ingestion** — load raw sources: Legal Acts (statutory text), Judgments (case law), and separately, user-submitted Incident data.
2. **Cleaning** — strip boilerplate/headers/footers, normalize whitespace, fix OCR artifacts if sourced from scanned PDFs.
3. **Chunking** — chunk by logical unit where possible (a Section of an Act, a paragraph of a judgment) rather than fixed character counts, so a citation always points to something coherent and quotable by reference.
4. **Metadata** — attach: source type (Act/Judgment/Incident), title, section/citation number, jurisdiction, date, and a stable source ID used later for citation.
5. **Embeddings** — generate vector embeddings per chunk for semantic search (ChromaDB).
6. **Indexing** — store embeddings in ChromaDB; build a parallel BM25 index over the same chunks for exact-term matching.
7. **Hybrid Ranking** — query both indexes, fuse results (e.g., reciprocal rank fusion or a weighted score combination), and re-rank.
8. **Context Assembly** — select top-k fused results, format with their metadata into a context pack for the LLM.
9. **Citations** — every chunk carries enough metadata to render a real citation (e.g., "Consumer Protection Act, 2019, Section 2(11)") rather than a vague "the law says."
10. **Source Verification** — before showing an answer, check that the LLM's claims can be traced back to at least one retrieved chunk; unsupported claims should be flagged, not silently presented as fact.
11. **Retrieval Evaluation** — maintain a small labeled query set ("golden set") to periodically check retrieval precision/recall isn't silently degrading as the corpus grows.

### Critical Separation: Legal Authority vs. User-Generated Incident Data

| | Legal Authority Corpus | Incident Corpus |
|---|---|---|
| Source | Acts, judgments, official legal text | User-submitted complaints/cases |
| Trust level | High — treated as ground truth | Variable — treated as unverified user claims |
| Used for | Answer generation + citation | Legal Saathi Engine similarity/clustering |
| Retrieval index | Own ChromaDB collection + BM25 index | Separate ChromaDB collection + BM25 index |
| Privacy | None (public legal text) | High — PII must be minimized/redacted before indexing |
| Never | Never used to justify a legal claim to the user | Never surfaced as a "citation" in an answer |

Keeping these as **physically separate indexes/collections** (not just a metadata flag) prevents an entire class of bugs where an unverified user complaint accidentally gets treated as legal authority.

---

## 8. Legal Saathi Engine — Technical Design

This is the core differentiator and deserves the most rigor.

### 8.1 Case Schema (conceptual)
```
Case {
  case_id
  created_at
  issue_type            // from classifier taxonomy
  opposing_party         { name_hash, type }      // hashed/pseudonymized
  location               { state, district, locality_bucket }
  amount                 { value, currency, bucket }   // buckets used for clustering
  dates                  [ { label, date } ]
  raw_summary_hash        // for dedup, not full raw text
  entities                { ... extracted fields }
  consent_status          // none | given | revoked
  cluster_id (nullable)
}
```

### 8.2 Entity Extraction
Uses the same LLM/NLP pipeline as case understanding but tuned to a fixed schema — this should be a constrained extraction (e.g., structured output / JSON schema prompting) rather than free-text parsing, since downstream similarity scoring depends on consistent fields.

### 8.3 Normalization
- Dates → ISO format, relative dates ("last month") resolved against submission date.
- Amounts → bucketed ranges (e.g., ₹0–5k, ₹5k–20k...) for privacy-preserving comparison, exact value retained only for the user's own case.
- Locations → normalized to state/district, and a coarser "locality bucket" for cross-user comparison, so exact addresses aren't required for clustering.
- Issue type → mapped to a fixed taxonomy (not free text) so incidents can be compared categorically.

### 8.4 Similarity Scoring
Combine two signals:
- **Structured similarity**: exact/near match on issue type, opposing-party hash, location bucket, amount bucket, date proximity.
- **Semantic similarity**: embedding similarity between case summaries (using the same embedding approach as the RAG layer).

Weighted combination produces a single similarity score per incident pair.

### 8.5 Candidate Retrieval
Rather than comparing a new case against every stored incident (expensive at scale), use the structured fields as a coarse filter (same issue type + same locality bucket) to produce a small candidate set, then apply semantic similarity only within that candidate set.

### 8.6 Clustering
Once similarity scores exist, connect incidents above a similarity threshold; a simple approach (e.g., threshold-based graph connected-components) is sufficient for an MVP — full unsupervised clustering algorithms (DBSCAN, hierarchical) are a P2 refinement.

### 8.7 Cluster Explanation
Never show "you are in a cluster" without showing *why*: e.g., "3 other cases in your district report the same issue type against a similarly-named opposing party within the last 60 days." This should be generated from the actual matching fields, not the LLM guessing.

### 8.8 Privacy
- Never store or display raw PII in cluster-facing views; use hashes/buckets as in the schema above.
- Aggregate-first display: show "5 similar cases nearby" before ever revealing anything about a specific other user.
- Full incident detail of another user is never shown without that user's explicit consent.

### 8.9 Consent
- Consent is asked at two points: (1) "may your (anonymized) case be used to detect patterns?" (informed opt-in), and (2) "may you be connected with others in this cluster for collective action?" — a separate, higher-bar consent.
- Consent status is stored per-case and is revocable; revocation should remove the case from active clustering.

### 8.10 Collective Workflow
Once multiple users consent within the same cluster, provide a shared space (could be as simple as a shared draft document / shared checklist) that references the cluster's common facts — this can start as a lightweight, mostly-manual workflow.

### 8.11 False-Positive Prevention
- Require agreement across *multiple* structured fields (not just one) before suggesting a cluster — semantic similarity alone is not sufficient.
- Always show the explanation and let the user confirm/reject "yes this matches my situation" — never auto-merge without human confirmation.

### 8.12 Evaluation Metrics
- Precision of clustering: of clusters suggested, how many are confirmed relevant by users.
- Citation accuracy: sampled manual check that citations actually support the claims made.
- Retrieval recall on the golden query set.

---

## 9. Frontend Architecture

**Page Structure (Next.js App Router)**
```
app/
├── page.tsx                     // landing / entry point
├── chat/
│   └── page.tsx                 // main ASK → UNDERSTAND → VERIFY → EXPLAIN interface
├── case/[caseId]/
│   └── page.tsx                 // case workspace: history, citations, evidence checklist
├── actions/
│   ├── notice/page.tsx
│   ├── rti/page.tsx
│   └── efir/page.tsx
├── incidents/
│   └── page.tsx                 // "similar cases near you" / collective view (consent-gated)
└── settings/
    └── page.tsx                 // language preference, consent management
```

**Component Structure**
- `ChatWindow`, `MessageBubble`, `CitationCard`, `ConfidenceBadge`, `VoiceInputButton`, `ActionSuggestionCard`, `EvidenceChecklist`, `CaseTimeline`, `ClusterExplanationCard`, `ConsentModal`.

**State Management** — React context or a lightweight store (Zustand) for the active case/conversation; server state fetched via a thin API client, not duplicated into global state unnecessarily.

**API Integration** — a single typed API client module wrapping fetch calls to the FastAPI backend; every response shape should mirror the backend Pydantic schemas so frontend/backend don't silently drift.

**Loading / Error / Empty States** — every async view needs all three explicitly designed:
- Loading: skeleton for chat response, not a blank screen.
- Error: distinguish "LLM/retrieval failed, please retry" from "no legal source found for this."
- Empty: a first-time user should see example questions, not a blank chat box.

**Accessibility** — voice input as a primary interaction, not hidden in a menu; large tap targets; readable font sizes and contrast for low digital-literacy users.

**Responsive Behavior** — mobile-first; most target users will be on phones, not desktops.

---

## 10. Backend Architecture

```
backend/
├── main.py                      // FastAPI app instantiation, router registration
├── routers/
│   ├── chat.py
│   ├── classify.py
│   ├── retrieval.py
│   ├── cases.py
│   ├── incidents.py
│   ├── clustering.py
│   ├── sources.py
│   ├── voice.py
│   ├── actions/
│   │   ├── notice.py
│   │   ├── rti.py
│   │   ├── dlsa.py
│   │   └── efir.py
│   ├── analytics.py
│   └── health.py
├── schemas/                     // Pydantic request/response models
├── services/
│   ├── classifier.py            // intent/issue classification
│   ├── pipeline.py              // orchestration: retrieval → LLM → citation
│   ├── retrieval_service.py     // ChromaDB + BM25 hybrid logic
│   ├── llm_provider.py          // abstraction layer: primary + fallback provider
│   ├── citation_service.py      // claim → source mapping, confidence scoring
│   ├── voice_service.py         // STT/TTS orchestration
│   └── engine/                  // Legal Saathi Engine
│       ├── extraction.py
│       ├── normalization.py
│       ├── similarity.py
│       ├── clustering.py
│       └── consent.py
├── data/
│   ├── ingestion/                // scripts to build the legal corpus index
│   └── models/                  // DB models
├── safety/
│   ├── input_validation.py
│   ├── prompt_injection_guard.py
│   └── rate_limiter.py
├── tests/
└── core/
    ├── config.py
    ├── auth.py
    └── logging.py
```

---

## 11. Repository Structure

```
legal-saathi/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/                     // API client, hooks, utils
│   ├── public/
│   └── package.json
├── backend/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   ├── data/
│   ├── safety/
│   ├── core/
│   ├── tests/
│   └── requirements.txt
├── data/
│   ├── raw/                     // source Acts, judgments (before processing)
│   ├── processed/                // cleaned, chunked corpus
│   └── eval/                    // golden query set for retrieval evaluation
├── scripts/
│   ├── ingest_corpus.py
│   ├── build_indexes.py
│   └── seed_incidents.py
├── docs/
│   ├── this-blueprint.md
│   ├── api-reference.md
│   └── architecture-diagrams/
├── tests/
│   └── e2e/
├── .env.example
└── README.md
```

**What belongs where:**
- `data/raw` vs `data/processed` keeps ingestion reproducible — never hand-edit `processed/`, regenerate it from `raw/` via `scripts/ingest_corpus.py`.
- `data/eval` holds the small labeled query set — this is what CI runs retrieval tests against.
- `docs/` is where this document and any API reference/diagrams live so a new teammate has one place to start.
- `backend/safety/` is intentionally separate from `services/` so security-relevant code is easy to find and review in isolation.

---

## 12. API Design

| Endpoint | Method | Purpose | Request (key fields) | Response (key fields) | Priority |
|---|---|---|---|---|---|
| `/chat` | POST | Send a message, get grounded answer | `session_id, text, lang` | `answer, citations[], confidence, suggested_action` | P0 |
| `/classify` | POST | Classify issue type/intent | `text` | `issue_type, urgency` | P0 |
| `/retrieval/search` | POST | Query hybrid retrieval directly | `query, corpus, top_k` | `chunks[]` (with metadata) | P0 |
| `/cases` | POST/GET | Create/fetch structured Case object | `case fields` | `case_id, case` | P0 |
| `/cases/{id}` | PATCH | Update case (e.g., add evidence) | partial case fields | `case` | P1 |
| `/incidents` | POST | Submit a case into the incident corpus | `case_id, consent_flag` | `incident_id` | P1 |
| `/incidents/{id}/similar` | GET | Get similar incidents + explanation | — | `similar[]` (with explanation) | P1 |
| `/clustering/run` | POST | Trigger/refresh clustering (admin/batch) | `scope` | `clusters[]` | P2 |
| `/sources/{id}` | GET | Fetch full source detail for a citation | — | `source_text, metadata` | P0 |
| `/voice/stt` | POST | Speech-to-text | `audio, lang_hint` | `text, detected_lang` | P1 |
| `/voice/tts` | POST | Text-to-speech | `text, lang` | `audio_url` | P1 |
| `/actions/notice` | POST | Draft a legal notice | `case_id` | `draft_text` | P1 |
| `/actions/rti` | POST | Draft an RTI application | `case_id` | `draft_text` | P1 |
| `/actions/dlsa` | GET | DLSA guidance for user's area | `location` | `dlsa_contact, guidance` | P2 |
| `/actions/efir` | POST | Guided e-FIR assistance | `case_id` | `guidance_steps[]` | P2 |
| `/analytics/summary` | GET | Aggregate, non-PII usage stats | — | `counts_by_issue_type, etc.` | P2 |
| `/health` | GET | Liveness/readiness check | — | `status` | P0 |

---

## 13. Database & Data Model

```
User
 ├── user_id (PK)
 ├── language_pref
 └── consent_status

Session
 ├── session_id (PK)
 ├── user_id (FK → User)
 └── created_at

Case
 ├── case_id (PK)
 ├── session_id (FK → Session)
 ├── issue_type
 ├── entities (JSON: opposing_party, location, amount, dates)
 └── consent_status

Evidence
 ├── evidence_id (PK)
 ├── case_id (FK → Case)
 ├── type (document/photo/message/receipt)
 └── status (needed/collected)

Source
 ├── source_id (PK)
 ├── type (Act/Judgment)
 ├── title, section_ref, jurisdiction, date
 └── chunk_text

Citation
 ├── citation_id (PK)
 ├── case_id (FK → Case)
 ├── source_id (FK → Source)
 └── claim_text

Incident
 ├── incident_id (PK)
 ├── case_id (FK → Case)
 └── cluster_id (FK → Cluster, nullable)

Cluster
 ├── cluster_id (PK)
 ├── issue_type
 ├── locality_bucket
 └── explanation_text

Draft
 ├── draft_id (PK)
 ├── case_id (FK → Case)
 ├── action_type (notice/rti/efir)
 └── content

AuditEvent
 ├── event_id (PK)
 ├── actor (user/system)
 ├── action
 ├── target_id
 └── timestamp
```

**Relationships:** `Session 1—N Case`, `Case 1—N Evidence`, `Case 1—N Citation N—1 Source`, `Case 1—1 Incident`, `Incident N—1 Cluster`, `Case 1—N Draft`. `AuditEvent` references any entity by `target_id` and is append-only.

---

## 14. Team Structure (4 Developers)

### Teammate 1 — Frontend / UI
- Next.js pages, components, state management (React context / Zustand)
- API client layer (typed, mirrors backend Pydantic schemas)
- Loading / error / empty states for every async view
- Chat UI, case workspace UI, citation/confidence display, action module forms
- Accessibility (voice-first affordances, large tap targets, contrast)
- **Depends on:** API contract frozen before real integration; can build against mocks before that.

### Teammate 2 — Backend / API / Orchestration
- FastAPI app structure, routers, Pydantic schemas
- `classifier.py`, `pipeline.py` (orchestration: classify → retrieve → generate → cite)
- LLM abstraction layer (primary + fallback provider)
- Citation/trust layer (claim → source mapping, confidence scoring)
- Auth/session, rate limiting, input validation (`backend/safety/`)
- **Depends on:** T3's retrieval service being callable (can build against a mock retrieval response first).

### Teammate 3 — Data / Retrieval / AI / Legal Saathi Engine
- Corpus ingestion, chunking, metadata, ChromaDB + BM25 hybrid index, fusion/re-ranking
- Case schema definition (owns this contract — T2 and T1 consume it)
- Legal Saathi Engine: extraction, normalization, similarity, clustering, explanation, consent
- Retrieval evaluation (golden query set)
- **Depends on:** nothing external to start; Engine work depends on Case schema being frozen (Phase 1).

### Teammate 4 — Voice / Action Modules / Integration / DevOps / QA
- Voice service (STT/TTS, language detection)
- Action modules (Evidence Checklist first, then Notice/RTI/DLSA/e-FIR)
- Testing strategy execution, CI pipeline, Docker/deployment
- Security review pass, end-to-end test scripts
- **Depends on:** the core pipeline reaching Milestone 1 (Phase 4) before voice/action modules have something real to bolt onto.

### Team Ownership Matrix

| Area | T1 | T2 | T3 | T4 | Primary Owner |
|---|---|---|---|---|---|
| Frontend pages/components | ✓ | | | | T1 |
| API routers & schemas | | ✓ | | | T2 |
| Classifier / pipeline orchestration | | ✓ | | | T2 |
| Hybrid retrieval (ChromaDB+BM25) | | | ✓ | | T3 |
| Case schema | | consumes | ✓ (owns) | | T3 |
| LLM abstraction + fallback | | ✓ | | | T2 |
| Citation / Trust layer | | ✓ | ✓ (source metadata) | | T2 |
| Legal Saathi Engine | | | ✓ | | T3 |
| Voice (STT/TTS) | | | | ✓ | T4 |
| Action modules | | | | ✓ | T4 |
| Auth/session | | ✓ | | | T2 |
| CI/CD, Docker, deployment | | | | ✓ | T4 |
| Testing (unit/integration/E2E) | ✓ (FE) | ✓ (BE) | ✓ (RAG/Engine) | ✓ (E2E/owns plan) | T4 |
| Security review | | ✓ | | ✓ | T4 |

---

## 15. Parallel Execution Model

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

### Critical Path
```
Phase 0 (Audit) → Phase 1 (Architecture + Case Schema Freeze)
  → Phase 3 (Case schema implemented, T3)
  → Phase 4 (Retrieval + LLM + Citation wired, T2+T3)  ← BOTTLENECK
  → Phase 5 (Case Workspace + Checklist)
  → Phase 8 (Collective Workflow)
  → Phase 9 (Testing/Security)
  → Phase 10 (Demo)
```

**The single biggest bottleneck is Phase 4** (first grounded, cited answer). Nothing downstream — action modules, voice, the Engine, or the demo — is genuinely finishable until this works. Protect this phase's timeline above all others.

---

## 16. Development Roadmap (Phase 0–10)

### Phase 0 — Repository Audit & Understanding
**Objective:** Replace every [STATED]/[UNKNOWN] label with [VERIFIED]/[PARTIAL]/[PLANNED]/[MISSING], backed by a file path.

**Team Assignments:**
- T1: Audit frontend/ — pages, components, state mgmt, API client stubs
- T2: Audit backend/routers, services/classifier.py, services/pipeline.py, auth
- T3: Audit retrieval code, ChromaDB/BM25 setup, any Engine-related files, data/
- T4: Audit tests/, CI config, Docker, .env.example, README accuracy

**Deliverable:** `docs/AUDIT_RESULTS.md` (one shared file, one section per teammate).

---

### Phase 1 — Architecture Freeze
**Objective:** Lock the Case schema, API contract shapes, and any corrections Phase 0 revealed.

**Deliverables:** `docs/CASE_SCHEMA.md`, `docs/API_CONTRACT.md` (frozen versions).

**Definition of Done:**
- Case schema fields finalized, typed, and agreed by T1–T4
- API contract for /chat, /cases, /retrieval/search, /incidents/similar frozen

---

### Phase 2 — Environment & Skeletons (Parallel)
**Objective:** Working local dev environment; empty-but-running FE/BE skeletons; corpus ingestion scaffold; CI pipeline scaffold.

**Team Assignments:**
- T1: Next.js app scaffold, routing, API client stub against mocks
- T2: FastAPI app scaffold, routers, /health endpoint, .env.example
- T3: Ingestion script skeleton, ChromaDB + BM25 index bootstrap on a tiny (5-doc) test corpus
- T4: CI pipeline, Docker Compose for local FE+BE+ChromaDB, README dev-setup instructions

**Definition of Done:**
- `docker compose up` runs FE + BE + ChromaDB locally for all 4 teammates
- /health returns 200
- Frontend renders a chat page against mocked API responses
- CI runs on every PR

---

### Phase 3 — Case Schema Implementation + Corpus Foundation
**Objective:** Case schema is a real, persisted object; a small real legal corpus is ingested and queryable.

**Team Assignments:**
- T2: Implement Case DB model + /cases POST/GET per the frozen schema
- T3: Ingest 20-30 real Act sections/judgments, build ChromaDB + BM25 indexes, implement fusion/re-ranking
- T1: Build the Case creation UI flow
- T4: Write DB migration tooling / seed scripts, add first unit tests

**Definition of Done:**
- POST /cases persists a real row; GET /cases/{id} returns it
- /retrieval/search returns real, ranked, cited-source-ready chunks for a test query
- Golden query set (15-20 entries) exists and passes a baseline precision check

---

### Phase 4 — First Complete Grounded Chatbot Workflow (★ CRITICAL PATH ★)
**Objective:** `User Question → Intent → Legal Retrieval → Verified Answer → Citation → Action` works end-to-end.

**Team Assignments:**
- T2: Wire pipeline.py: classify → retrieval → context → LLM → citation → confidence → response
- T3: LLM abstraction layer (primary + fallback), citation_service (claim→source mapping)
- T1: Chat UI wired to real /chat endpoint; CitationCard, ConfidenceBadge components
- T4: E2E test script for this exact flow

**Definition of Done (Milestone 1):**
- A real question returns an answer with a strong/partial/insufficient confidence badge
- Citations shown are traceable to actual retrieved chunks (spot-check 5 by hand)
- Fallback LLM provider tested by deliberately breaking the primary
- One action module (Evidence Checklist) offered at the end

---

### Phase 5 — Case Workspace + First Action Module
**Team Assignments:**
- T1: Case workspace page (history, citations, evidence checklist view)
- T2: /cases/{id} PATCH, evidence tracking fields
- T4: Evidence Checklist action module — template lookup by issue_type
- T3: Support with issue-type taxonomy needed for checklist templates

---

### Phase 6 — Additional Action Modules
T4 leads Notice/RTI draft generation; T2 exposes the endpoints; T1 builds the corresponding forms/draft display.

---

### Phase 7 — Voice + Legal Saathi Engine v1 (Parallel)
**Team Assignments:**
- T4: STT → normalize → existing pipeline → TTS, for one language, full round trip
- T3: Engine v1 — entity extraction refinement, normalization, pairwise similarity scoring + human-readable explanation on seeded incident data

**Definition of Done:**
- A spoken question produces a spoken, cited answer
- Given 10 seeded incidents (2-3 known-similar pairs), the Engine correctly flags the similar pairs and explains why

---

### Phase 8 — Collective Workflow
T3 implements clustering + consent gating; T1 builds the consent UI and cluster explanation view; T2 exposes /incidents, /incidents/{id}/similar; T4 reviews for privacy leaks.

---

### Phase 9 — Testing, Security, Performance
Each teammate owns their layer's test suite; T4 owns the E2E suite and the security checklist end-to-end.

---

### Phase 10 — Final Polish & Demo Rehearsal
All 4 — UI polish (T1), reliability hardening (T2), retrieval/Engine edge cases (T3), full run-throughs + fallback rehearsal (T4).

**Definition of Done:** the Final Demo Story runs successfully twice in a row without manual intervention.

---

## 17. Atomic Task Breakdown

### Task ID System
```
ARCH-xxx   Architecture / cross-cutting decisions
AUDIT-xxx  Phase 0 repo audit tasks
DB-xxx     Database schema / migrations
BE-xxx     Backend routes / services
FE-xxx     Frontend pages / components
RAG-xxx    Corpus, chunking, retrieval, ranking
AI-xxx     LLM abstraction, prompting, citation logic
ENG-xxx    Legal Saathi Engine
VOICE-xxx  STT/TTS integration
ACT-xxx    Action modules
AUTH-xxx   Auth/session
SEC-xxx    Security tasks
QA-xxx     Testing tasks
DEVOPS-xxx CI/CD, Docker, deployment
```

### Worked Example: Critical-Path Feature (Phase 3–4)

| Task ID | Name | Owner | Priority | Depends On | Files |
|---|---|---|---|---|---|
| CORE-001 | Define Case Pydantic model | T3 | P0 | ARCH-001 | `backend/schemas/case.py` |
| CORE-002 | DB migration for `cases` table | T2 | P0 | CORE-001 | `backend/data/models/case.py` |
| CORE-003 | POST /cases endpoint | T2 | P0 | CORE-002 | `backend/routers/cases.py` |
| CORE-004 | GET /cases/{id} endpoint | T2 | P0 | CORE-002 | `backend/routers/cases.py` |
| CORE-005 | Corpus ingestion script | T3 | P0 | none | `scripts/ingest_corpus.py` |
| CORE-006 | ChromaDB + BM25 hybrid index + fusion | T3 | P0 | CORE-005 | `backend/services/retrieval_service.py` |
| CORE-007 | LLM abstraction (primary+fallback) | T2 | P0 | none | `backend/services/llm_provider.py` |
| CORE-008 | Citation/confidence service | T2 | P0 | CORE-006 | `backend/services/citation_service.py` |
| CORE-009 | Pipeline orchestration | T2 | P0 | CORE-003, 006, 007, 008 | `backend/services/pipeline.py` |
| CORE-010 | POST /chat endpoint | T2 | P0 | CORE-009 | `backend/routers/chat.py` |
| CORE-011 | Frontend chat UI + citation/confidence components | T1 | P0 | CORE-010 (or mocked) | `frontend/app/chat/*`, `frontend/components/*` |
| CORE-012 | Golden query set + precision test | T3 | P0 | CORE-006 | `data/eval/golden_queries.json` |
| CORE-013 | E2E test: full grounded-answer flow | T4 | P0 | CORE-011 | `tests/e2e/chat_flow.spec.ts` |

---

## 18. API Contracts (Frozen in Phase 1)

### POST /chat
**Request:**
```json
{ "session_id": "string", "text": "string", "lang": "hi|en|..." }
```
**Response:**
```json
{
  "answer": "string",
  "citations": [{ "source_id": "string", "title": "string", "section_ref": "string", "excerpt": "string" }],
  "confidence": "strong|partial|insufficient",
  "suggested_action": { "type": "checklist|notice|rti|none", "action_id": "string|null" }
}
```
**Errors:** `{ "error": "retrieval_unavailable|llm_unavailable|invalid_input", "code": 503|400 }`

### POST /cases, GET /cases/{id}, PATCH /cases/{id}
**Request (POST):** the Case object per `docs/CASE_SCHEMA.md` (partial objects allowed, missing fields inferred later).
**Response:** `{ "case_id": "string", "case": { ...Case } }`

### POST /retrieval/search
**Request:** `{ "query": "string", "corpus": "acts|judgments|incidents", "top_k": 5 }`
**Response:** `{ "chunks": [{ "chunk_id", "text", "source_id", "score", "metadata" }] }`

### GET /incidents/{id}/similar
**Response:** `{ "similar": [{ "incident_id", "similarity_score", "explanation", "matched_fields": [] }] }`

All endpoints: standard error format `{ "error": "string", "code": number }`; auth via session header once AUTH tasks land.

---

## 19. Mocking Strategy

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

## 20. Git & Branching Strategy

```
main        — always deployable, demo-ready
develop     — integration branch, CI must pass before merge
feature/*   — one branch per task ID, e.g. feature/core-009-pipeline-orchestration
```

**Rules:**
- Branch name = task ID + short description: `feature/core-009-pipeline-orchestration`
- Commit format: `[CORE-009] Wire pipeline orchestration with LLM fallback`
- PRs require 1 review from a teammate who owns an adjacent area
- No one merges a change to `docs/CASE_SCHEMA.md` or `docs/API_CONTRACT.md` without a message to the other 3 teammates first
- Conflicts in shared contract files are resolved live (call/chat), not by whoever merges first

---

## 21. Testing Strategy

| Layer | What to Test |
|---|---|
| Frontend | Component rendering, loading/error/empty states, voice button states, accessibility |
| Backend | Unit tests per service (`classifier`, `pipeline`, `retrieval_service`, `citation_service`) |
| API | Contract tests: request/response shapes match Pydantic schemas; status codes for bad input |
| RAG | Retrieval precision/recall against the golden query set; regression check on every corpus update |
| Citation | Sampled manual audit: does every citation actually support the claim it's attached to? |
| LLM Grounding | Adversarial test set: questions with no good source — system must say "insufficient evidence," not fabricate |
| Voice | STT accuracy on real accented/regional speech; TTS intelligibility spot-check |
| Engine | Similarity scoring on a labeled seed set of "known similar" and "known dissimilar" incident pairs |
| Clustering | Precision of suggested clusters against user confirm/reject feedback |
| Security | Auth bypass attempts, rate-limit enforcement, prompt-injection payloads |
| End-to-End | Full journey (ASK → UNDERSTAND → VERIFY → EXPLAIN → ACT) run as a scripted test |

**Suggested small evaluation dataset:**
- 15–20 real legal questions across 3–4 issue types (tenancy, consumer, RTI, family), each hand-labeled with the correct source section(s) it should retrieve.
- 10 seeded "incident" cases, deliberately including 2–3 known-similar pairs and several unrelated ones.

---

## 22. Security & Privacy

| ID | Task | Owner | Notes |
|---|---|---|---|
| SEC-001 | Session-based auth | T2 | Full accounts are P1/P2, session is P0 |
| SEC-002 | Authorization (own-case-only access) | T2 | Enforced at query level, not just UI |
| SEC-003 | Input validation | T2 | Pydantic schemas on every endpoint, reject oversized payloads |
| SEC-004 | Secrets management | T4 | LLM/provider keys in env vars, never committed |
| SEC-005 | Rate limiting | T4 | Per-session/IP on /chat and /voice |
| SEC-006 | Prompt-injection guard | T2+T3 | Retrieved text and user input never override system instructions |
| SEC-007 | Malicious document handling | T4 | Sanitize/scan any uploaded evidence files |
| SEC-008 | Incident/Engine privacy enforcement | T3 | Bucketing/hashing before any cross-user comparison (highest-risk area) |
| SEC-009 | Consent audit trail | T2 | AuditEvent on every consent grant/revoke |
| SEC-010 | Logging hygiene | T2 | No raw complaint text in plaintext logs where avoidable |

**Additional Security Principles:**
- API key security — all provider keys in environment variables / secrets manager, never in frontend code or committed files.
- Data minimization — store only what's needed for the feature.
- Incident privacy — enforced at the schema level, not just at the UI level.
- Consent — explicit, per-purpose, revocable, and logged.
- Audit trail — `AuditEvent` table for consent changes, data access, and admin actions.
- Malicious documents — if users can upload evidence documents, scan/sanitize before any processing.
- Sensitive data handling — treat opposing-party names, exact addresses, and exact financial amounts as sensitive; apply bucketing/hashing wherever the data leaves the owning user's context.

---

## 23. Reliability & Performance

### Reliability
- **LLM fallback** — if the primary provider errors or times out, the abstraction layer automatically retries against the fallback provider before failing.
- **Retrieval failure** — if hybrid retrieval returns nothing (or fails), the system should say so explicitly ("no matching legal source found") rather than let the LLM answer ungrounded.
- **Timeout** — set explicit timeouts on LLM/retrieval calls; a slow response should degrade to a clear "still working" or "try again" state.
- **Malformed response** — validate LLM output structure before using it; fall back to a safe "insufficient evidence" response on parse failure.
- **Missing evidence** — explicitly represented as a valid system state ("insufficient support"), not an error.
- **Unavailable service** — if voice or engine services are down, the core text chat should still function — one module failing should never take down the whole app.
- **Retry strategy** — exponential backoff with a small max-retry count on transient provider errors.
- **Graceful degradation** — always prefer "answer with lower confidence and say so" over "no answer at all."

### Performance
- **Caching** — cache retrieval results for identical/near-identical queries to cut latency and cost.
- **Streaming** — stream the LLM response token-by-token for perceived responsiveness.
- **Retrieval optimization** — pre-filter by issue type/corpus before running the more expensive semantic search.
- **Async processing** — use FastAPI's async endpoints for I/O-bound calls so the server isn't blocked per-request.
- **Indexing** — keep ChromaDB and BM25 indexes updated incrementally on corpus additions.
- **API latency** — track and log per-stage latency (classify/retrieve/generate/cite) to find the actual bottleneck.
- **Frontend performance** — lazy-load non-critical components so the initial chat view loads fast on lower-end phones.

---

## 24. UX Improvements

- Keep the first screen to a single clear input (text or voice) with 2–3 example questions — no onboarding wall before a low-literacy user can try the product.
- Show the confidence indicator visually (a simple badge: strong/partial/insufficient), not buried in text.
- Every answer should end in a visible, tappable "what to do next" — never let the conversation just... stop.
- For voice users, always show a text transcript alongside audio, so hearing/reading can reinforce each other.
- Use plain-language explanations with the legal citation available on tap/expand, not both shown at full length by default.
- Design the "insufficient evidence" state carefully — it should feel like an honest, helpful boundary, not a dead end or an error.

---

## 25. New Features & Features to Avoid

### New & Useful Features

| Feature | Problem It Solves | Priority |
|---|---|---|
| A. Legal Confidence / Evidence Indicator | Users can't tell if an AI answer is reliable | P0 |
| B. "Why This Law Applies" | Users see a citation but not *why* it's relevant to them | P1 |
| C. Missing Information Assistant | Generic follow-up questions frustrate users | P1 |
| D. Evidence Checklist | Users don't know what proof they need before acting | P0 |
| E. Case Timeline Builder | Facts get lost/disorganized across a long conversation | P2 |
| F. Legal Action Roadmap | Users don't know what to do first vs. later | P1 |
| G. Source Comparison | Multiple sources may seem to conflict | P2 |
| H. Complaint Quality Checker | Weak complaints/notices fail procedurally | P1 |
| I. Case Similarity Explanation | Users don't trust an opaque "you match others" | P1 |
| J. Privacy-First Cluster Participation | Users fear exposure by joining a cluster | P1 |
| K. Case Progress Workspace | Users lose track of drafts/deadlines/status | P2 |
| L. Multilingual Legal Simplification | Legal text is dense even when translated | P1 |
| M. Emergency/High-Risk Routing | Some cases shouldn't be handled as ordinary chat | P0 |

### Features to Avoid
- Unnecessary dashboards/analytics that don't inform a user or developer decision.
- Decorative "AI features" added just to sound advanced (auto-generated summaries nobody asked for, chatbot personas/avatars, etc.).
- Blockchain, hardware, IoT, or anything outside the software scope.
- Social-media-style features (likes, public profiles, feeds) — this is a legal assistance tool, not a social network.
- Features unrelated to the ASK → UNDERSTAND → VERIFY → EXPLAIN → ACT → UNITE journey.
- Excessive animation/motion that slows down low-end devices or distracts from a serious task.
- Any feature that increases legal risk (e.g., the system giving definitive legal advice/verdicts rather than information + sourced explanation + suggested action).

---

## 26. AI-Assisted "Vibe Coding" Playbook

### What is "Vibe Coding"?
Vibe coding is NOT blindly prompting an AI and pasting whatever code it generates. In Legal Saathi, **Vibe Coding means: Humans act as Architects and Tech Leads; AI acts as hyper-fast junior developers.** We maintain velocity without breaking the codebase.

### The 6 Golden Laws

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE 6 LAWS OF LEGAL SAATHI VIBE CODING               │
├────────────────────────────────────────────────────────────────────────┤
│ 1. NEVER let AI invent API schemas or DB models on the fly.            │
│    (All schemas come from docs/CASE_SCHEMA.md & docs/API_CONTRACT.md)  │
│ 2. ONE Task ID per prompt session. Do not say "build the chat app".    │
│ 3. ALWAYS feed context files at the start of every session.            │
│ 4. NEVER let AI delete or refactor a teammate's working file.          │
│ 5. AI must write tests and run build checks BEFORE you mark done.      │
│ 6. Shared contracts are IMMUTABLE without a team live sync.            │
└────────────────────────────────────────────────────────────────────────┘
```

### The 5-Step AI Coding Loop (Every Teammate, Every Task)

1. **Pull** latest develop branch & create feature/TASK-ID
2. **Feed** Master Prompt + docs/API_CONTRACT.md + Task Spec to AI
3. **Review** AI's proposed plan & approve/adjust scope
4. **Build** — AI writes code, service functions & unit tests
5. **Verify** — run pytest / npm run build, check git diff with your own eyes, commit & PR

### Generic Per-Task Prompt Template
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

### Teammate Master Prompts

#### 💻 Teammate 1 (Frontend / UI)
```
You are Teammate 1 (Frontend Lead) on the Legal Saathi project.
Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
Documents to strictly respect:
- docs/legal-saathi-blueprint.md (UI/UX design, Section 9 & 21)
- docs/API_CONTRACT.md (API request/response shapes)
- docs/CASE_SCHEMA.md (Case object TypeScript interface)

Your Boundaries:
- You own: frontend/app/*, frontend/components/*, frontend/lib/api-client.ts, frontend/types/*
- You DO NOT modify backend/, scripts/, or database models.
- If a backend endpoint is not ready, code against a fixture in frontend/lib/__mocks__/.
- Ensure every async view has 3 states: Loading (skeleton), Error (friendly retry), and Empty.

Task to work on: [INSERT TASK-ID]
```

#### ⚙️ Teammate 2 (Backend & Orchestration)
```
You are Teammate 2 (Backend Lead) on the Legal Saathi project.
Stack: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy/SQLModel.
Documents to strictly respect:
- docs/legal-saathi-blueprint.md (Sections 5, 6, 10, 12, 18)
- docs/API_CONTRACT.md (Exact router paths & JSON shapes)
- docs/CASE_SCHEMA.md (Pydantic model for Case)

Your Boundaries:
- You own: backend/routers/*, backend/services/pipeline.py, classifier.py, llm_provider.py, citation_service.py
- You consume T3's retrieval_service.py as a black box interface.
- Implement strict fallback for LLMs (Primary with fallback to backup if timeout > 8s).

Task to work on: [INSERT TASK-ID]
```

#### 🧠 Teammate 3 (Data / Hybrid RAG / Engine)
```
You are Teammate 3 (AI/RAG & Legal Saathi Engine Lead) on Legal Saathi.
Stack: Python 3.11+, ChromaDB, Rank-BM25, LangChain/LlamaIndex chunking, Sentence-Transformers.
Documents to strictly respect:
- docs/legal-saathi-blueprint.md (Section 7 RAG, Section 8 Engine)
- docs/CASE_SCHEMA.md (You OWN this contract)

Your Boundaries:
- You own: scripts/ingest_corpus.py, backend/services/retrieval_service.py, backend/services/engine/*
- Expose retrieval_service.search(query, corpus, top_k) returning ranked chunks with metadata.
- Implement Reciprocal Rank Fusion (RRF) between ChromaDB and BM25.
- For the Engine: build entity normalization, similarity scoring, and privacy-first bucketing.

Task to work on: [INSERT TASK-ID]
```

#### 🚀 Teammate 4 (Voice / Action Modules / DevOps / QA)
```
You are Teammate 4 (DevOps, Voice, Action Modules & QA Lead) on Legal Saathi.
Stack: Docker Compose, GitHub Actions, Playwright/Cypress, FastAPI action routers, Whisper/Bhashini STT/TTS.
Documents to strictly respect:
- docs/legal-saathi-blueprint.md (Sections 17-20: Actions, Voice, DevOps, Security)
- docs/PROJECT_DEVELOPMENT_ROADMAP.md (Parts 10 Security & 11 Testing)

Your Boundaries:
- Phase 2-3: docker-compose.yml, CI pipeline, dev setup.
- Phase 4+: Action Modules, Voice pipeline, E2E testing scripts.
- You are the Quality and Security gatekeeper.

Task to work on: [INSERT TASK-ID]
```

### AI Coding Do's and Don'ts

```
DO NOT let it:                         ALWAYS have it:
- rewrite unrelated code                - inspect existing implementation first
- change the Case schema/API silently   - reuse existing utilities/services
- install unnecessary packages          - follow the frozen contracts
- remove working functionality          - run tests + build before declaring done
- touch another teammate's task's files - report exactly which files changed
- skip tests "to save time"             - flag anything it's unsure about, not guess
```

---

## 27. Risk Register

| Risk | Probability | Impact | Owner | Mitigation | Trigger |
|---|---|---|---|---|---|
| Phase 4 (critical path) slips | Medium | High | T2/T3 | Cut Phase 6-8 scope first, protect Phase 4 timeline | Phase 4 not done by planned midpoint |
| LLM provider outage during demo | Low | High | T2 | Fallback provider tested well before demo day | Any primary-provider error in final rehearsal |
| Engine produces false-positive clusters | Medium | Medium | T3 | Require multi-field agreement, always show explanation | Any seeded dissimilar pair gets clustered in testing |
| Corpus too small/narrow for demo questions | Medium | Medium | T3 | Golden query set built early (Phase 3), gaps found before Phase 4 | Precision@5 below acceptable threshold |
| Contract drift (FE/BE disagree on shape) | Medium | High | T1+T2 | Frozen contract in Phase 1, PR review rule | Any runtime type-mismatch bug |
| Privacy leak in cluster UI | Low | Very High | T3+T4 | Dedicated security review in Phase 8 | Any raw PII visible in a cluster view during testing |
| Scope creep from feature list | High | Medium | All | P0/P1/P2 discipline; new ideas go to P2 | Any new feature proposed after Phase 4 without P0 justification |

---

## 28. Demo Story & Presentation Strategy

### The Demo Story (One End-to-End Scenario)

> A citizen (voice, in Hindi) describes that their landlord is refusing to return a security deposit two months after they vacated. The system transcribes and normalizes the speech, classifies it as a tenancy/deposit issue, and extracts the structured facts (amount, dates, opposing party, location). It retrieves the relevant sections of the applicable rent/tenancy law and any relevant judgments, generates a grounded explanation of the citizen's rights — shown with a "strong evidence" badge and the actual cited section — and explains in plain Hindi why that section applies to their specific facts. It then shows an Evidence Checklist (rent agreement, payment proof, vacate notice) and offers to draft a Legal Notice using the case's structured facts. Finally, the Legal Saathi Engine flags that four other citizens in the same locality reported a similar deposit issue against a similarly-named landlord in the last two months — showing the aggregate pattern first, and only after the citizen consents, offering to connect them toward a collective notice.

```
1. Citizen speaks in Hindi:
   "मेरा मकान मालिक 2 महीने बाद भी 40,000 का सिक्योरिटी डिपॉजिट वापस नहीं कर रहा है।"
   (My landlord has not returned my ₹40,000 security deposit even after 2 months.)
              │
              ▼
2. System Transcribes & Normalizes ➔ Extracts:
   - Issue: Tenancy / Security Deposit Withholding
   - Amount: ₹40,000 | Opposing Party: Landlord | Timeline: 2 months post-vacate
              │
              ▼
3. Hybrid Search pulls Model Tenancy Act & State Rent Control clauses & Case Law
              │
              ▼
4. Grounded Explanation generated with:
   - Green Badge: [STRONG EVIDENCE]
   - Expandable Citation: Section 13(2), Model Tenancy Act
   - "Why this applies to you": Explains landlord notice requirements
              │
              ▼
5. Instant Action Offered:
   - [Evidence Checklist]: Rent agreement, bank statement, key handover receipt
   - [Generate Legal Notice]: 1-click pre-filled formal demand notice
              │
              ▼
6. The "Holy Sh*t" Moment — The Legal Saathi Engine:
   - "4 other tenants in your locality reported deposit withholding by this same property firm."
   - Privacy Banner: Aggregate pattern shown first.
   - 1-Click Consent: "Join collective legal notice" ➔ Amplifies their leverage 10x!
```

### Presentation Strategy

**What to show first:** the core loop (ASK → grounded, cited EXPLAIN → ACT) in under 60 seconds — this proves the product is not "just another chatbot" before anyone gets bored.

**What differentiates you:** say it explicitly — "we don't let the AI make up legal answers; every claim traces back to a real source, and we tell you when we're not sure" — followed by the collective-action reveal, which is the moment that usually gets an audible reaction.

**Which technical details matter:** the hybrid retrieval fusion (not just "we used a vector DB"), the citation-verification step (claims are checked against sources, not just decorated with links), and the privacy-preserving design of the Engine (bucketing/hashing before comparison, consent before any cross-user visibility).

**What judges/users should remember:** one sentence — *"It turns a legal problem into a sourced answer and a next step, and it notices when you're not the only one."*

**What metrics to show (labelled honestly):**
- Retrieval precision/recall on your golden query set — label as "**Team evaluation on our own test set**," not a general claim.
- Number of Act sections/judgments in the demo corpus — a real, verifiable number.
- Any planning-stage estimates must be labelled "**Team planning estimate**," never presented as measured data.

---

## 29. Master Checklists

### "Build This First" Checklist (Minimum Viable First Vertical Slice)
The smallest version of the full journey that still proves the product identity:

**Exact files/modules needed:**
1. `frontend/app/chat/page.tsx` + `ChatWindow`, `MessageBubble`, `CitationCard` components — a single-page chat UI, no auth, no case workspace yet.
2. `backend/routers/chat.py` — one endpoint, `/chat`, that does everything below synchronously.
3. `backend/services/classifier.py` — existing, reused as-is.
4. `backend/services/retrieval_service.py` — hybrid retrieval over a **small, real** corpus (even 20–30 well-chosen Act sections/judgments is enough).
5. `backend/services/llm_provider.py` — minimal abstraction: one primary provider call, hard-coded fallback allowed at this stage.
6. `backend/services/citation_service.py` — simplest version: map retrieved chunk metadata directly into the response as citations.
7. One action module (Evidence Checklist or Legal Notice) — hard-coded template filled from the Case schema.

**What NOT to build yet:** auth, case persistence beyond session, voice, the Legal Saathi Engine, clustering, multiple action modules.

---

### Integration Checkpoints

| Checkpoint | What's tested | Participants | Must work | Rollback |
|---|---|---|---|---|
| 1 — FE + BE | Chat UI against real /chat | T1, T2 | Real question → real cited answer renders correctly | Revert to mocked API client |
| 2 — BE + Retrieval | Pipeline against real corpus | T2, T3 | Golden query set produces expected confidence distribution | Pin to last known-good corpus/index |
| 3 — Engine + Core | Similarity/clustering against seeded incidents | T3, T2 | Known-similar pairs cluster, known-dissimilar don't | Disable clustering, fall back to Phase-4-only demo |
| 4 — Full System | End-to-end text + voice demo flow | All 4 | Final Demo Story completes twice in a row | Fall back to text-only demo |

---

### Final Master Checklist

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
[ ] Security checklist fully checked off
[ ] Privacy review of Engine/cluster views specifically signed off (SEC-008)

TESTING
[ ] Unit tests per service; E2E text-flow and voice-flow tests both passing in CI

DEVOPS
[ ] docker compose up works for a new teammate with zero manual steps beyond .env
[ ] CI blocks merge on failing tests/build

DEMO
[ ] Final Demo Story runs twice in a row without manual intervention
```

---

### Deployment Roadmap

```
Local (docker-compose) → Staging (same stack, seeded demo corpus) → Demo/Production
```
Each environment needs its own `.env` (never shared secrets between them), its own ChromaDB volume, and a documented one-command deploy + rollback script owned by T4.

---

### Daily Workflow & End-of-Day Checklist

**Daily Loop:**
```
Pull develop → read assigned task ID → check its dependencies are actually done
→ AI planning pass → implement only that task → run tests → run build
→ commit with task ID in message → open PR → request review from an adjacent-area teammate
```

**End of Day:**
```
[ ] Task implemented and matches its Definition of Done
[ ] Tests written and passing
[ ] Build passing
[ ] No unrelated files changed
[ ] Shared contract untouched, or touched only via the change process
[ ] Commit pushed, PR open or merged
```

---

### Team Communication & Change Management

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

---

### AI-Assisted Coding: How the Team Should Use It

```
Human: Architecture + requirements + legal decisions
   ↓
 AI: Implementation assistance (writing code from agreed specs)
   ↓
Human: Review + testing + integration
   ↓
 AI: Debugging / documentation assistance
   ↓
Human: Final approval
```

**Practical rules:**
- AI tools implement against the architecture and schemas already agreed in this document — they don't get to redesign the Case schema, the API contract, or the Engine's approach on their own initiative.
- Every AI-generated change to `services/engine/`, `citation_service.py`, or anything touching privacy/consent gets a human review before merge — these are the highest-risk files.
- Use AI freely for boilerplate, tests, documentation, and debugging — that's where it saves the most time with the least risk.
- Keep this document as the spec AI tools are pointed at, so generated code stays consistent with the architecture across different team members' sessions.

---

### Project Status Dashboard (Template — Fill in During Phase 9)

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

### Recommended Execution Order Summary

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

**One-line summary for the team:** audit before you build, freeze the Case schema and API contract before you split up, protect Phase 4 above everything else, and never let a P2 idea touch the critical path before Phase 8.

---

### Summary: A Through I

**A. Current State** — a Next.js/FastAPI project with a classifier and pipeline in place, a hybrid retrieval intention (ChromaDB + BM25) of unconfirmed completeness, and a Legal Saathi Engine that is conceptually well-specified but very likely not yet implemented. *(Verify against the real repo before trusting this summary.)*

**B. Problems** — the biggest risks are: (1) the citation/trust layer may not exist yet, meaning answers could look grounded without actually being verified; (2) the Engine, the core differentiator, is likely the least-built part; (3) without a persisted Case schema, most of the higher-value features (checklist, drafts, engine) have nothing to build on.

**C. Recommended Changes** — build the Case schema and citation/confidence layer early (Phase 4–5), since nearly everything else depends on them; don't let voice or the full Engine block the first working demo.

**D. New High-Value Features** — Evidence Indicator, Evidence Checklist, Missing Information Assistant, "Why This Law Applies," and Emergency Routing are the highest-value, lowest-risk additions.

**E. Final Architecture** — unchanged in structure from Section 5; strengthened by making the Trust/Citation Layer and Action Layer genuinely rigorous rather than superficial.

**F. Development Plan** — 12 phases, with a concrete first vertical slice defined precisely enough to start coding today.

**G. Team Assignments** — 4 developers, each with explicit files, dependencies, and handoff points.

**H. Testing Plan** — layer-by-layer tests plus a concrete, buildable evaluation dataset.

**I. Final Demo Plan** — one coherent, honest, technically substantive story that shows the full CITIZEN → ASK → UNDERSTAND → VERIFY → EXPLAIN → ACT → UNITE journey.

---

> *This document consolidates the Legal Saathi Blueprint, Development Roadmap, and Team Meeting Briefing into a single source of truth. Keep it in `docs/` and point every AI tool and every new teammate here first.*
