# Legal Saathi — Project Report & Technical Blueprint

> **A note on scope before you read this:** this blueprint was written from the project description and technical direction supplied by the team, not from a live inspection of the actual repository (no code was provided alongside this request). Every claim in Section 3 ("Current Project Analysis") is labelled **[STATED]** (asserted by the team as existing/planned) rather than **[VERIFIED]** (confirmed by reading actual code). Before development starts, someone should do a 30-minute pass through the real repo and convert every [STATED] item into either [VERIFIED] or [MISSING]. Everywhere else in this document, recommendations are built on top of the architecture you already described, not a rewrite of it.

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

### Main Differentiator
Legal Saathi is not "a chatbot with a legal prompt." It is an **evidence-grounded pipeline** where:
1. The LLM is never the source of truth — every answer is checked against retrieved legal sources and shows its citations.
2. The system tells the user what it doesn't know, not just what it thinks.
3. Every answer ends in an action, not a dead end.
4. A dedicated engine looks across all incidents (not just this one conversation) to find patterns, with privacy and consent built in from the start.

### Why Legal Saathi Is Different From a Generic Chatbot

| Generic Legal Chatbot | Legal Saathi |
|---|---|
| Answers from LLM's internal knowledge | Answers grounded in retrieved Acts/judgments, LLM only synthesizes |
| No indication of source or confidence | Every answer shows sources + a confidence/evidence indicator |
| Conversation ends at "information" | Conversation routes into a concrete action module |
| Treats every conversation as isolated | Legal Saathi Engine links related incidents across users (with consent) |
| English-only or single-language | Multilingual text + voice as a first-class feature, not an add-on |
| No structured case memory | Structured case object (entities, timeline, evidence) persists and can be reused across the case lifecycle |

---

## 2. Product Vision

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

**Method note:** the items below are built from the technical direction supplied by the team. Nothing here was confirmed by reading the actual repository. Treat every row as a hypothesis to check, not a fact.

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
These are the areas most hackathon-stage legal-AI projects underbuild, and worth explicitly checking:

- **Citation layer**: does the pipeline currently attach a verifiable source (Act name, section, judgment citation) to each claim, or does the LLM just "mention" sources in free text?
- **Case schema**: is there a persisted structured object per conversation (entities, issue type, location, dates, amount) or is everything ephemeral per-request?
- **LLM abstraction layer**: is there actually a provider-agnostic interface, or is a specific SDK called directly inside `pipeline.py`?
- **Legal Saathi Engine**: almost certainly the least mature — likely no clustering, similarity scoring, or consent flow exists yet.
- **Action modules** (Legal Notice, RTI, DLSA, e-FIR): likely not implemented; these are P0/P1 build targets, not current state.
- **Auth/session**: no mention of an existing auth system — assume it doesn't exist yet unless verified.
- **Privacy/consent**: given the engine itself isn't confirmed built, consent flows are almost certainly not built either.

### 3.4 What To Do Before Coding Starts
1. Walk the actual repo folder-by-folder against the checklist above.
2. For each [STATED] item, mark [VERIFIED] or [MISSING].
3. Feed the corrected list back into Section 4 (P0/P1/P2) so effort isn't spent re-building something that already works, and isn't assumed for something that doesn't exist.

---

## 4. Recommended Final Product

Features are prioritized by what makes the **first working demo** true to the product identity (multilingual, grounded, actionable) without over-scoping for a hackathon timeline.

### P0 — MUST HAVE (the demo doesn't work without these)
- Text-based chat: ask → understand → verify → explain, with visible citations
- Hybrid retrieval (ChromaDB + BM25) actually fused and ranked, over at least a small real corpus of Acts/judgments
- LLM abstraction layer with a working fallback (even if fallback is just a second provider, untested extensively)
- Confidence/evidence indicator on every answer (strong / partial / insufficient support)
- At least one action module fully working end-to-end (recommend: **Evidence Checklist** — lowest legal risk, highest generalizability)
- Basic case schema (structured extraction of issue type, parties, dates, amount, location) persisted per conversation

### P1 — IMPORTANT (materially strengthens the story, feasible in scope)
- One additional action module (Legal Notice draft, or RTI draft)
- Voice input in at least one Indian language (STT → normalize → same pipeline → TTS out)
- "Why this law applies" explanation (connects extracted facts to the retrieved section, not just cites it)
- Legal Saathi Engine v1: entity normalization + basic similarity scoring across stored incidents, with an explanation of *why* two incidents are similar — even without live clustering algorithms, a nearest-neighbour similarity + human-readable explanation is enough to prove the concept
- Missing Information Assistant (targeted follow-up questions instead of generic ones)

### P2 — OPTIONAL (only if time allows, do not let these delay P0/P1)
- Full clustering (not just pairwise similarity) across many incidents
- Consent-gated collective action workflow (UI + backend, even if simplified)
- Case Timeline Builder
- Multiple additional action modules (DLSA guidance, e-FIR assistance)
- Source Comparison UI when multiple sources conflict
- Multilingual UI beyond voice (translated interface chrome)

**Rule of thumb:** if a feature can't be demoed convincingly end-to-end in under 90 seconds, it's P1 or P2, not P0.

---

## 5. Complete Software Architecture

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
                        │  INTENT CLASSIFICATION   │  classifier.py — what kind of legal issue is this?
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

**Layer-by-layer:**

- **Frontend** — renders the conversation, citations, evidence indicator, and action modules; handles voice capture and playback.
- **API Layer** — the only entry point into the backend; validates input, enforces auth/session, routes to services. No business logic lives here.
- **Intent Classification** (`classifier.py`) — decides what *kind* of legal issue this is (tenancy, consumer, family, criminal-adjacent, etc.), which determines which retrieval corpus and which action modules are relevant.
- **Case Understanding** — extracts structured entities (opposing party, issue type, location, amount, dates) into the Case schema (Section 13). This is what makes everything downstream reusable instead of re-parsing raw text every time.
- **Hybrid Retrieval** — ChromaDB gives semantic matches (paraphrase-robust), BM25 gives exact-term matches (critical for legal text where exact section numbers and terms matter); results are fused, not just concatenated.
- **Evidence/Context Assembly** — turns raw retrieved chunks into a structured context pack (with source metadata) that the LLM is given — this is what makes citations possible later.
- **LLM** — generates the natural-language explanation *from* the context pack; is explicitly told not to introduce facts the context doesn't support. Runs through an abstraction layer so provider outages don't break the app.
- **Trust/Citation Layer** — the layer that actually enforces principle #1 and #2 (Trust, Evidence): it checks that claims in the LLM output map back to retrieved chunks, attaches source citations, and computes the confidence indicator (strong/partial/insufficient).
- **Action Layer** — converts a verified explanation into a concrete next step (a drafted notice, an RTI template, an evidence checklist).
- **Legal Saathi Engine** — operates on the structured Case objects (not raw conversation text) to find, cluster, and explain similarity across incidents, with privacy and consent enforced before any cross-user visibility.
- **Collective Action** — the consent-gated workflow that groups verified-similar incidents into a shared action.

---

## 6. Detailed Data Flow

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
   → Consent Prompt (user is asked, explicitly, before being shown as part of a cluster to anyone else)
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

## 8. Legal Saathi Engine — Detailed Technical Design

This is the core differentiator and deserves the most rigor.

### 8.1 Case Schema (conceptual)
```
Case {
  case_id
  created_at
  issue_type            // from classifier taxonomy
  opposing_party         { name_hash, type }      // hashed/pseudonymized, not raw PII where avoidable
  location               { state, district, locality_bucket }
  amount                 { value, currency, bucket }   // buckets used for clustering, exact value kept privately
  dates                  [ { label, date } ]
  raw_summary_hash        // for dedup, not full raw text
  entities                { ... extracted fields }
  consent_status          // none | given | revoked
  cluster_id (nullable)
}
```

### 8.2 Entity Extraction
Uses the same LLM/NLP pipeline as case understanding (Section 6) but tuned to a fixed schema — this should be a constrained extraction (e.g., structured output / JSON schema prompting) rather than free-text parsing, since downstream similarity scoring depends on consistent fields.

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
Once similarity scores exist, connect incidents above a similarity threshold; a simple approach (e.g., threshold-based graph connected-components) is sufficient for an MVP — full unsupervised clustering algorithms (DBSCAN, hierarchical) are a P2 refinement, not a P0 requirement.

### 8.7 Cluster Explanation
Never show "you are in a cluster" without showing *why*: e.g., "3 other cases in your district report the same issue type against a similarly-named opposing party within the last 60 days." This should be generated from the actual matching fields, not the LLM guessing.

### 8.8 Privacy
- Never store or display raw PII in cluster-facing views; use hashes/buckets as in the schema above.
- Aggregate-first display (Section 22.J): show "5 similar cases nearby" before ever revealing anything about a specific other user.
- Full incident detail of another user is never shown without that user's explicit consent.

### 8.9 Consent
- Consent is asked at two points: (1) "may your (anonymized) case be used to detect patterns?" (default should lean toward informed opt-in, not silent opt-out), and (2) "may you be connected with others in this cluster for collective action?" — a separate, higher-bar consent.
- Consent status is stored per-case and is revocable; revocation should remove the case from active clustering.

### 8.10 Collective Workflow
Once multiple users consent within the same cluster, provide a shared space (could be as simple as a shared draft document / shared checklist) that references the cluster's common facts — this can start as a lightweight, mostly-manual workflow for a hackathon and doesn't need to be a full case-management system.

### 8.11 False-Positive Prevention
- Require agreement across *multiple* structured fields (not just one) before suggesting a cluster — semantic similarity alone is not sufficient (two different landlord disputes can sound similar without being the same fact pattern).
- Always show the explanation and let the user confirm/reject "yes this matches my situation" — never auto-merge without human confirmation.

### 8.12 Evaluation Metrics
- Precision of clustering: of clusters suggested, how many are confirmed relevant by users (measured via the confirm/reject step in 8.11).
- Citation accuracy: sampled manual check that citations actually support the claims made.
- Retrieval recall on the golden query set (Section 7.11).

---

## 9. Frontend Architecture

**Page Structure (Next.js App Router assumed)**
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

**State Management** — keep it simple: React context or a lightweight store (Zustand) for the active case/conversation; server state (retrieval results, case history) fetched via a thin API client, not duplicated into global state unnecessarily.

**API Integration** — a single typed API client module wrapping fetch calls to the FastAPI backend; every response shape should mirror the backend Pydantic schemas (Section 12) so frontend/backend don't silently drift.

**Loading / Error / Empty States** — every async view needs all three explicitly designed, not just a spinner:
- Loading: skeleton for chat response, not a blank screen.
- Error: distinguish "LLM/retrieval failed, please retry" from "no legal source found for this — here's what we do know" (these are different UX, not the same error banner).
- Empty: a first-time user should see example questions, not a blank chat box.

**Accessibility** — voice input as a primary interaction, not hidden in a menu; large tap targets; readable font sizes and contrast for low digital-literacy users.

**Multilingual UI** — at minimum, the conversation content (questions, answers, citations) should render in the user's language; UI chrome translation (buttons, labels) is a P2 nice-to-have.

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
├── schemas/                     // Pydantic request/response models, mirrored by frontend types
├── services/
│   ├── classifier.py            // existing — intent/issue classification
│   ├── pipeline.py              // existing — orchestration: retrieval → LLM → citation
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
│   └── models/                  // DB models (Section 13)
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

## 11. Recommended Repository Structure

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
- `data/eval` holds the small labeled query set from Section 7.11 — this is what CI runs retrieval tests against.
- `docs/` is where this blueprint and any API reference/diagrams live so a new teammate has one place to start.
- `backend/safety/` is intentionally separate from `services/` so security-relevant code is easy to find and review in isolation.

---

## 12. API Design

| Endpoint | Method | Purpose | Request (key fields) | Response (key fields) | Owner | Priority |
|---|---|---|---|---|---|---|
| `/chat` | POST | Send a message, get grounded answer | `session_id, text, lang` | `answer, citations[], confidence, suggested_action` | Backend | P0 |
| `/classify` | POST | Classify issue type/intent | `text` | `issue_type, urgency` | Backend | P0 |
| `/retrieval/search` | POST | Query hybrid retrieval directly | `query, corpus, top_k` | `chunks[]` (with metadata) | RAG Team | P0 |
| `/cases` | POST/GET | Create/fetch structured Case object | `case fields` (Section 8.1) | `case_id, case` | Backend | P0 |
| `/cases/{id}` | PATCH | Update case (e.g., add evidence) | partial case fields | `case` | Backend | P1 |
| `/incidents` | POST | Submit a case into the incident corpus (for clustering) | `case_id, consent_flag` | `incident_id` | Engine Team | P1 |
| `/incidents/{id}/similar` | GET | Get similar incidents + explanation | — | `similar[]` (with explanation) | Engine Team | P1 |
| `/clustering/run` | POST | Trigger/refresh clustering (admin/batch) | `scope` | `clusters[]` | Engine Team | P2 |
| `/sources/{id}` | GET | Fetch full source detail for a citation | — | `source_text, metadata` | RAG Team | P0 |
| `/voice/stt` | POST | Speech-to-text | `audio, lang_hint` | `text, detected_lang` | Voice Team | P1 |
| `/voice/tts` | POST | Text-to-speech | `text, lang` | `audio_url` | Voice Team | P1 |
| `/actions/notice` | POST | Draft a legal notice | `case_id` | `draft_text` | Legal Workflow | P1 |
| `/actions/rti` | POST | Draft an RTI application | `case_id` | `draft_text` | Legal Workflow | P1 |
| `/actions/dlsa` | GET | DLSA guidance for user's area | `location` | `dlsa_contact, guidance` | Legal Workflow | P2 |
| `/actions/efir` | POST | Guided e-FIR assistance | `case_id` | `guidance_steps[]` | Legal Workflow | P2 |
| `/analytics/summary` | GET | Aggregate, non-PII usage stats | — | `counts_by_issue_type, etc.` | QA/DevOps | P2 |
| `/health` | GET | Liveness/readiness check | — | `status` | QA/DevOps | P0 |

---

## 13. Database / Data Model

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

**Relationships:** `Session 1—N Case`, `Case 1—N Evidence`, `Case 1—N Citation N—1 Source`, `Case 1—1 Incident` (an incident is a case opted into the engine), `Incident N—1 Cluster`, `Case 1—N Draft`. `AuditEvent` references any entity by `target_id` and is append-only.

---

## 14. Team Structure

| Team | Responsibilities | Files/Modules | Depends On | Deliverables | Handoff Point |
|---|---|---|---|---|---|
| Frontend | Chat UI, case workspace, action UIs, voice UI | `frontend/app`, `frontend/components` | API contract from Backend | Working UI against mocked then real API | API schema freeze (Section 12) |
| Backend | API layer, orchestration pipeline, auth | `backend/routers`, `backend/services/pipeline.py` | RAG Team's retrieval service, LLM provider | Working `/chat`, `/cases` endpoints | Schemas frozen for Frontend + Engine |
| RAG/Data Team | Corpus ingestion, chunking, hybrid retrieval, citation mapping | `data/`, `backend/services/retrieval_service.py`, `citation_service.py` | Source legal texts collected | Queryable hybrid index + eval set | Retrieval API ready for Backend |
| Legal Saathi Engine Team | Case schema, extraction, normalization, similarity, clustering, consent | `backend/services/engine/` | Case schema agreed with Backend | Working similarity + explanation on seeded data | Engine API ready for Frontend/Backend |
| Voice/Localization Team | STT/TTS integration, language detection, normalization | `backend/services/voice_service.py`, `backend/routers/voice.py` | Core pipeline accepts text input already | Voice round-trip in ≥1 language | Voice API ready for Frontend |
| Legal Workflow Team | Action modules (Notice, RTI, DLSA, e-FIR), evidence checklist | `backend/routers/actions/` | Case schema + retrieval available | Draft-generation endpoints | Action API ready for Frontend |
| QA/DevOps | Testing strategy, CI, deployment, security review | `tests/`, `.github/workflows` (or equivalent), `backend/safety/` | All teams' code | CI pipeline, test coverage report | Sign-off before demo freeze |

---

## 15. Development Roadmap

| Phase | Goal | Key Tasks | Dependencies | Completion Criteria |
|---|---|---|---|---|
| 0 — Setup | Repo, environments, contracts agreed | Repo structure, `.env.example`, agree on API schemas, agree on Case schema | None | Everyone can run the app locally |
| 1 — Frontend Skeleton | Basic chat UI against mocked API | Chat page, message components, mock API client | Phase 0 | Chat UI usable with fake data |
| 2 — Backend Skeleton | API layer + health check + basic classify | `main.py`, routers scaffolded, `/health`, `/classify` | Phase 0 | Frontend can hit real `/classify` |
| 3 — Knowledge/RAG | Ingest corpus, build hybrid index | Ingestion scripts, ChromaDB + BM25 index, eval set | Phase 0 | `/retrieval/search` returns real ranked chunks |
| 4 — First Complete Chatbot Workflow | End-to-end grounded answer with citations | Wire `pipeline.py`: classify → retrieve → LLM → citation | Phases 2, 3 | A real question gets a cited, confidence-scored answer |
| 5 — Case Workspace | Persist structured case, evidence checklist | Case schema, `/cases` endpoints, case UI | Phase 4 | User's case persists across a session |
| 6 — Legal Actions | At least 1–2 action modules working | Notice/RTI draft generation + UI | Phase 5 | User can generate a real draft from their case |
| 7 — Voice | STT/TTS wired into existing pipeline | Voice endpoints, voice UI | Phase 4 | A spoken question gets a spoken, cited answer |
| 8 — Legal Saathi Engine | Similarity + explanation on real/seeded incidents | Extraction, normalization, similarity, explanation | Phase 5 | System correctly flags 2+ seeded similar cases with explanation |
| 9 — Collective Workflow | Consent + shared cluster view | Consent flow, cluster UI | Phase 8 | Consenting users can see (and confirm) a cluster |
| 10 — Testing/Security | Full test pass, security review | Section 17 & 18 checklists | All above | CI green, security checklist signed off |
| 11 — Final Polish | Demo rehearsal, UI polish, fallback rehearsal | Rehearse Section 26 demo story | All above | Demo runs reliably twice in a row |

---

## 16. "Build This First" Plan

The first working vertical slice is the smallest version of the full journey that still proves the product identity:

```
User Question → Intent → Legal Retrieval → Verified Answer → Citation → Action
```

**Exact files/modules needed for this milestone (nothing more):**
1. `frontend/app/chat/page.tsx` + `ChatWindow`, `MessageBubble`, `CitationCard` components — a single-page chat UI, no auth, no case workspace yet.
2. `backend/routers/chat.py` — one endpoint, `/chat`, that does everything below synchronously.
3. `backend/services/classifier.py` — existing, reused as-is if it already classifies issue type reasonably.
4. `backend/services/retrieval_service.py` — hybrid retrieval over a **small, real** corpus (even 20–30 well-chosen Act sections/judgments is enough for a milestone).
5. `backend/services/llm_provider.py` — a minimal abstraction: one primary provider call, hard-coded fallback allowed at this stage (full retry/fallback logic can come in Phase 4 hardening).
6. `backend/services/citation_service.py` — the simplest version: map retrieved chunk metadata directly into the response as citations; confidence indicator can start as a simple heuristic (e.g., "strong" if ≥2 chunks support the answer, "insufficient" if 0).
7. `backend/routers/actions/notice.py` (or evidence checklist, whichever is simpler) — one action module, hard-coded template filled from the Case schema.

**What NOT to build yet for this milestone:** auth, case persistence beyond the single session, voice, the Legal Saathi Engine, clustering, multiple action modules. All of that comes after this slice proves the core loop works end-to-end and is demo-able.

---

## 17. Testing Strategy

| Layer | What to Test |
|---|---|
| Frontend | Component rendering, loading/error/empty states, voice button states, accessibility (contrast, tap targets) |
| Backend | Unit tests per service (`classifier`, `pipeline`, `retrieval_service`, `citation_service`) |
| API | Contract tests: request/response shapes match Pydantic schemas; status codes for bad input |
| RAG | Retrieval precision/recall against the golden query set (Section 7.11); regression check on every corpus update |
| Citation | Sampled manual audit: does every citation actually support the claim it's attached to? |
| LLM Grounding | Adversarial test set: questions with no good source in the corpus — system must say "insufficient evidence," not fabricate |
| Voice | STT accuracy on a sample of real accented/regional speech; TTS intelligibility spot-check |
| Engine | Similarity scoring on a labeled seed set of "known similar" and "known dissimilar" incident pairs |
| Clustering | Precision of suggested clusters against user confirm/reject feedback (Section 8.11/8.12) |
| Security | Auth bypass attempts, rate-limit enforcement, prompt-injection payloads (Section 18) |
| End-to-End | Full journey (ASK → UNDERSTAND → VERIFY → EXPLAIN → ACT) run as a scripted test, plus the voice variant |

**Suggested small evaluation dataset:**
- 15–20 real legal questions across 3–4 issue types (tenancy, consumer, RTI, family), each hand-labeled with the correct source section(s) it should retrieve — this is the golden set for both retrieval and citation testing, and doubles as demo material.
- 10 seeded "incident" cases, deliberately including 2–3 known-similar pairs and several unrelated ones, to test the Engine's similarity/clustering without needing real user data.

---

## 18. Security & Privacy

- **API key security** — all provider keys in environment variables / secrets manager, never in frontend code or committed files.
- **Authentication** — session-based at minimum; full user accounts can be P1/P2.
- **Authorization** — a user can only access their own cases/evidence/drafts; cluster views only show aggregate data unless explicit consent exists.
- **Data minimization** — store only what's needed for the feature (Section 8.3's bucketing approach applies here directly).
- **Incident privacy** — enforced at the schema level (Section 8.1/8.8), not just at the UI level.
- **Consent** — explicit, per-purpose (pattern detection vs. collective contact), revocable, and logged.
- **Logging** — log system events and errors; avoid logging full raw user complaint text in plaintext logs where avoidable.
- **Audit trail** — `AuditEvent` table for consent changes, data access to another user's data, and admin actions.
- **Rate limiting** — per-session/per-IP limits on `/chat` and `/voice` to control cost and abuse.
- **Input validation** — strict Pydantic schemas on every endpoint; reject malformed/oversized payloads.
- **Prompt injection risks** — retrieved legal text and user input should never be able to override system instructions to the LLM; sanitize/segment retrieved content clearly as "context," not as instructions.
- **Malicious documents** — if users can upload evidence documents, scan/sanitize before any processing; never execute or interpret uploaded content as code.
- **Sensitive data handling** — treat opposing-party names, exact addresses, and exact financial amounts as sensitive; apply the bucketing/hashing from Section 8.3 wherever the data leaves the owning user's context.

---

## 19. Reliability

- **LLM fallback** — if the primary provider errors or times out, the abstraction layer automatically retries against the fallback provider before failing the request.
- **Retrieval failure** — if hybrid retrieval returns nothing (or fails), the system should say so explicitly ("no matching legal source found") rather than let the LLM answer ungrounded.
- **Timeout** — set explicit timeouts on LLM/retrieval calls; a slow response should degrade to a clear "still working" or "try again" state, not hang indefinitely.
- **Malformed response** — validate LLM output structure before using it (e.g., if expecting structured citation mapping, parse defensively and fall back to a safe "insufficient evidence" response on parse failure).
- **Missing evidence** — explicitly represented as a valid system state ("insufficient support"), not an error.
- **Unavailable service** — if voice or engine services are down, the core text chat should still function (Section 7's modularity principle) — one module failing should never take down the whole app.
- **Retry strategy** — exponential backoff with a small max-retry count on transient provider errors.
- **Graceful degradation** — always prefer "answer with lower confidence and say so" over "no answer at all," where honest about the lower confidence.

---

## 20. Performance

- **Caching** — cache retrieval results for identical/near-identical queries (esp. for common questions) to cut latency and cost.
- **Streaming** — stream the LLM response to the frontend token-by-token for perceived responsiveness, if the chosen provider supports it.
- **Retrieval optimization** — pre-filter by issue type/corpus before running the more expensive semantic search, rather than searching the whole corpus every time.
- **Async processing** — use FastAPI's async endpoints for I/O-bound calls (LLM, retrieval, voice) so the server isn't blocked per-request.
- **Indexing** — keep ChromaDB and BM25 indexes updated incrementally on corpus additions, not rebuilt from scratch each time.
- **API latency** — track and log per-stage latency (classify/retrieve/generate/cite) to find the actual bottleneck rather than guessing.
- **Frontend performance** — lazy-load non-critical components (e.g., action module forms) so the initial chat view loads fast, especially on lower-end phones.

---

## 21. UX Improvements

- Keep the first screen to a single clear input (text or voice) with 2–3 example questions — no onboarding wall before a low-literacy user can try the product.
- Show the confidence indicator visually (a simple badge: strong/partial/insufficient), not buried in text.
- Every answer should end in a visible, tappable "what to do next" — never let the conversation just... stop.
- For voice users, always show a text transcript alongside audio, so hearing/reading can reinforce each other.
- Use plain-language explanations with the legal citation available on tap/expand, not both shown at full length by default — this respects both trust (source is there) and simplicity (don't overwhelm).
- Design the "insufficient evidence" state carefully — it should feel like an honest, helpful boundary ("I don't have a reliable source for this specific point — here's what's related, and here's who to ask") not a dead end or an error.

---

## 22. New and Useful Features

| Feature | Problem It Solves | How It Works | Technical Implementation | Difficulty | Priority | Why It Improves Legal Saathi |
|---|---|---|---|---|---|---|
| A. Legal Confidence / Evidence Indicator | Users can't tell if an AI answer is reliable | Badge shown per answer: strong / partial / insufficient support | Count + relevance-score of supporting chunks from citation_service | Low | P0 | Directly implements the Trust principle |
| B. "Why This Law Applies" | Users see a citation but not *why* it's relevant to them | Explicit mapping from extracted case facts to the specific clause of the retrieved source | LLM prompted with case facts + source chunk, asked to connect them explicitly (not just cite) | Medium | P1 | Turns a citation into genuine understanding |
| C. Missing Information Assistant | Generic follow-up questions frustrate users | Identify the *specific* missing field needed to improve confidence (e.g., "what date did this happen?") | Rule-based: check Case schema for empty fields relevant to the classified issue type; ask only for those | Medium | P1 | Faster path to a confident answer |
| D. Evidence Checklist | Users don't know what proof they need before acting | Generate a checklist keyed to the issue type + relevant Act sections | Template lookup by issue_type, refined by retrieved source content | Low | P0 | Lowest-risk, highest-value action module — build first |
| E. Case Timeline Builder | Facts get lost/disorganized across a long conversation | Convert extracted dates/events into a visual timeline (Date → Event → Evidence → Person → Action) | Render from the Case schema's `dates`/`entities` fields, no new backend logic needed | Low–Medium | P2 | Helps users (and lawyers later) see the case at a glance |
| F. Legal Action Roadmap | Users don't know what to do first vs. later | Show Now / Next / Later steps generated from issue type + case state | Rule-based sequencing per issue-type playbook | Medium | P1 | Converts information into a plan, not just facts |
| G. Source Comparison | Multiple sources may seem to conflict | Show sources side-by-side with a plain-language note on how they differ/apply | LLM given multiple top chunks, asked to compare, not just summarize one | Medium | P2 | Prevents users from being confused by legitimate legal nuance |
| H. Complaint Quality Checker | Weak complaints/notices fail procedurally | Before generating a draft, check for missing required facts against a template's requirements | Validation step in action module before draft generation | Low | P1 | Reduces real-world failure of the drafted action |
| I. Case Similarity Explanation | Users don't trust an opaque "you match others" | Show the specific matching fields, not a vague score | Direct output of Engine's similarity scoring (Section 8.7) | Low (once Engine exists) | P1 | Required for the Engine to be trustworthy, not creepy |
| J. Privacy-First Cluster Participation | Users fear exposure by joining a cluster | Show aggregate pattern first ("5 similar cases nearby"), reveal detail only with consent | Two-stage consent as in Section 8.9, aggregate query before detail query | Medium | P1 | Directly implements the Privacy principle |
| K. Case Progress Workspace | Users lose track of drafts/deadlines/status | A simple per-case dashboard of documents, drafts, actions, deadlines | Reads from `Draft`, `Evidence`, `Case` tables (Section 13) | Medium | P2 | Keeps users engaged past the first answer |
| L. Multilingual Legal Simplification | Legal text is dense even when translated | Keep the original source text intact, but generate a simplified explanation in the user's language alongside it | LLM generation step, language param passed through existing pipeline | Medium | P1 | Core to the Multilingual Accessibility principle without altering legal text integrity |
| M. Emergency/High-Risk Routing | Some cases shouldn't be handled as ordinary chat (e.g., immediate safety risk) | Detect high-risk signals in the classifier and route to a clear, direct message pointing to appropriate human/emergency resources | Add a high-risk category to the classifier taxonomy; hard-route away from normal LLM chat flow when triggered | Medium | P0 | Legal/ethical necessity, not optional — protects users in genuinely urgent situations |

---

## 23. Features to Avoid

- Unnecessary dashboards/analytics that don't inform a user or developer decision.
- Decorative "AI features" added just to sound advanced (auto-generated summaries nobody asked for, chatbot personas/avatars, etc.).
- Blockchain, hardware, IoT, or anything outside the software scope explicitly ruled out for this project.
- Social-media-style features (likes, public profiles, feeds) — this is a legal assistance tool, not a social network; public visibility of legal disputes without strict consent controls is actively risky.
- Features unrelated to the ASK → UNDERSTAND → VERIFY → EXPLAIN → ACT → UNITE journey.
- Excessive animation/motion that slows down low-end devices or distracts from a serious task.
- Any feature that increases legal risk (e.g., the system giving definitive legal advice/verdicts rather than information + sourced explanation + suggested action) without a clear corresponding value — always keep the system positioned as *assistance toward* action, not a replacement for a lawyer where one is genuinely needed.

---

## 24. Final Recommended Architecture

The architecture in Section 5 stands as the final recommended architecture — nothing in Sections 6–23 requires structurally changing it. The improvements are additive:

```
User → Frontend → API Layer → Intent Classification → Case Understanding
     → Hybrid Retrieval → Evidence/Context → LLM → Trust/Citation Layer
     → Action Layer → Legal Saathi Engine → Collective Action
```

with the additions of: an Evidence Indicator and "Why This Law Applies" explanation inside the Trust/Citation Layer; a Missing Information Assistant and Complaint Quality Checker inside Case Understanding / Action Layer respectively; and Emergency/High-Risk Routing as a hard branch immediately after Intent Classification (bypassing the normal chat flow entirely when triggered).

---

## 25. Final Feature Matrix

| Feature | Current Status | Priority | Owner | Dependencies | Demo Importance |
|---|---|---|---|---|---|
| Text chat with citations | To verify / likely partial | P0 | Backend | Retrieval, LLM abstraction | Critical |
| Hybrid retrieval (fused) | To verify | P0 | RAG Team | Corpus ingested | Critical |
| Evidence/confidence indicator | New | P0 | Backend | Citation service | Critical |
| Evidence Checklist action | New | P0 | Legal Workflow | Case schema | Critical |
| Emergency/high-risk routing | New | P0 | Backend | Classifier taxonomy update | Critical (ethical necessity) |
| LLM abstraction + fallback | To verify | P0 | Backend | Provider access | High |
| Case schema persistence | To verify / likely new | P0 | Backend | DB setup | High |
| Legal Notice / RTI draft | New | P1 | Legal Workflow | Case schema | High |
| Voice (1 language round-trip) | Planned | P1 | Voice Team | Core pipeline stable | High |
| "Why this law applies" | New | P1 | Backend/RAG | Citation service | Medium-High |
| Missing Information Assistant | New | P1 | Backend | Case schema | Medium |
| Engine v1 (similarity + explanation) | Likely not built | P1 | Engine Team | Case schema, seeded incidents | High (differentiator) |
| Multilingual simplification | New | P1 | Backend | LLM prompt update | Medium-High |
| Full clustering | Likely not built | P2 | Engine Team | Engine v1 | Medium |
| Consent-gated collective workflow | Likely not built | P2 | Engine Team | Clustering | Medium |
| Case Timeline Builder | New | P2 | Frontend | Case schema | Low-Medium |
| Source Comparison UI | New | P2 | Frontend/RAG | Multiple sources retrievable | Low |
| DLSA/e-FIR modules | New | P2 | Legal Workflow | Case schema | Low |

---

## 26. Final Demo Story

**One end-to-end scenario, told as a single narrative:**

> A citizen (voice, in Hindi) describes that their landlord is refusing to return a security deposit two months after they vacated. The system transcribes and normalizes the speech, classifies it as a tenancy/deposit issue, and extracts the structured facts (amount, dates, opposing party, location). It retrieves the relevant sections of the applicable rent/tenancy law and any relevant judgments, generates a grounded explanation of the citizen's rights — shown with a "strong evidence" badge and the actual cited section — and explains in plain Hindi why that section applies to their specific facts. It then shows an Evidence Checklist (rent agreement, payment proof, vacate notice) and offers to draft a Legal Notice using the case's structured facts. Finally, the Legal Saathi Engine flags that four other citizens in the same locality reported a similar deposit issue against a similarly-named landlord in the last two months — showing the aggregate pattern first, and only after the citizen consents, offering to connect them toward a collective notice.

```
Citizen Problem → Voice → Understanding → Case Extraction → Legal Retrieval
→ Citation → Explanation → Evidence Checklist → Legal Action
→ Similar Incidents → Consent → Collective Action
```

---

## 27. Presentation Strategy

**What to show first:** the core loop (ASK → grounded, cited EXPLAIN → ACT) in under 60 seconds — this proves the product is not "just another chatbot" before anyone gets bored.

**What differentiates you:** say it explicitly, don't make people infer it — "we don't let the AI make up legal answers; every claim traces back to a real source, and we tell you when we're not sure" — followed by the collective-action reveal, which is the moment that usually gets an audible reaction because most people haven't seen a legal tool connect isolated complaints into a pattern.

**Which technical details matter (to a technical judge/audience):** the hybrid retrieval fusion (not just "we used a vector DB"), the citation-verification step (claims are checked against sources, not just decorated with links), and the privacy-preserving design of the Engine (bucketing/hashing before comparison, consent before any cross-user visibility).

**What judges/users should remember:** one sentence — *"it turns a legal problem into a sourced answer and a next step, and it notices when you're not the only one."*

**What metrics to show (labelled honestly):**
- Retrieval precision/recall on your golden query set — label as "**Team evaluation on our own test set**," not a general claim.
- Number of Act sections/judgments in the demo corpus — a real, verifiable number.
- Any planning-stage estimates (e.g., roadmap timing) must be labelled "**Recommended planning priority**" or "**Team planning estimate**," never presented as measured data.

---

## AI-Assisted Coding: How the Team Should Use It

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

Practical rules:
- AI tools (Claude Code, Cursor, or similar) implement against the architecture and schemas already agreed in this document — they don't get to redesign the Case schema, the API contract, or the Legal Saathi Engine's approach on their own initiative.
- Every AI-generated change to `services/engine/`, `citation_service.py`, or anything touching privacy/consent gets a human review before merge — these are the highest-risk files in the codebase.
- Use AI freely for boilerplate, tests, documentation, and debugging — that's where it saves the most time with the least risk.
- Keep this document (or a living version of it in `docs/`) as the spec AI tools are pointed at, so generated code stays consistent with the architecture across different team members' sessions.

---

## Summary: A Through I

**A. Current State** — a Next.js/FastAPI project with a classifier and pipeline in place, a hybrid retrieval intention (ChromaDB + BM25) of unconfirmed completeness, and a Legal Saathi Engine that is conceptually well-specified but very likely not yet implemented. *(Verify against the real repo before trusting this summary.)*

**B. Problems** — the biggest risks are: (1) the citation/trust layer may not exist yet, meaning answers could look grounded without actually being verified; (2) the Engine, the core differentiator, is likely the least-built part; (3) without a persisted Case schema, most of the higher-value features (checklist, drafts, engine) have nothing to build on.

**C. Recommended Changes** — build the Case schema and citation/confidence layer early (Phase 4–5), since nearly everything else depends on them; don't let voice or the full Engine block the first working demo.

**D. New High-Value Features** — Evidence Indicator, Evidence Checklist, Missing Information Assistant, "Why This Law Applies," and Emergency Routing are the highest-value, lowest-risk additions (Section 22).

**E. Final Architecture** — unchanged in structure from Section 5; strengthened by making the Trust/Citation Layer and Action Layer genuinely rigorous rather than superficial.

**F. Development Plan** — Sections 15–16: 12 phases, with a concrete first vertical slice defined precisely enough to start coding today.

**G. Team Assignments** — Section 14: 7 teams, each with explicit files, dependencies, and handoff points.

**H. Testing Plan** — Section 17: layer-by-layer tests plus a concrete, buildable evaluation dataset.

**I. Final Demo Plan** — Section 26: one coherent, honest, technically substantive story that shows the full CITIZEN → ASK → UNDERSTAND → VERIFY → EXPLAIN → ACT → UNITE journey.
