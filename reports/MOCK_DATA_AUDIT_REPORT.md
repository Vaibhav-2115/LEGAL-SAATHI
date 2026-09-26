# Legal Saathi — Mock Data Audit & Real Backend Integration Architecture Report

**Project:** Legal Saathi  
**Project Root:** `E:\Rox\LegalSaathi`  
**Database:** Supabase PostgreSQL (`thqoqnxhqluivesfsntl`)  
**Legal Knowledge Base:** 9,549 Canonical Indian Statutory & Judicial Chunks (`backend/data/corpus/indian_legal_acts.json`)  
**Audit Date:** 2026-09-27  

---

## 1. Executive Summary

This audit assesses all sources of mock, synthetic, simulated, and placeholder data across the Legal Saathi repository and defines the technical path to wire every frontend page and interaction to live backend services, persistent Supabase PostgreSQL storage, and the real 9,549-chunk Indian legal knowledge base.

---

## 2. Inventory of Mock Data Sources in Frontend

| Component / File | Mock Artifact / Pattern | Why Used Previously | Real Backend Service / API Replacement |
| :--- | :--- | :--- | :--- |
| `src/lib/mock-data.ts` | `INITIAL_CASES` (1,211 lines) | Seed data for initial in-memory render | Live cases retrieved via `GET /cases` and Supabase PostgreSQL `cases` table |
| `src/lib/mock-data.ts` | `INITIAL_CHAT_MESSAGES` | Hardcoded welcome & sample chat | Initial empty state or persistent conversation history from `GET /cases/{id}` |
| `src/lib/mock-data.ts` | `VERIFIED_LEGAL_SOURCES` | Static list of 6 laws | Live `GET /sources` and `GET /sources/{id}` querying 9,549 real Indian statutes & judgments |
| `src/lib/mock-data.ts` | `SIMILAR_CASE_CLUSTERS` | Static list of 4 clusters | Live `GET /clustering/list` querying Supabase `clusters` table |
| `src/lib/mock-data.ts` | `LEGAL_EXPLANATION_TRACES` | Static JSON traces | Dynamic explanation generated during RAG pipeline execution in `POST /chat` |
| `src/lib/mock-data.ts` | `MISSING_INFO_QUESTIONS` | Static questions per case | Dynamic missing info questions generated from case entity gap detection |
| `src/context/LegalSaathiContext.tsx` | In-memory `useState(INITIAL_CASES)` | Local state without persistence | Async `fetchCases()` from `GET /cases` with fallback to clean empty states |
| `src/context/LegalSaathiContext.tsx` | `createCaseFromProblem` (random `LS-2026-XXXX`) | Client-only random generation | `POST /cases` persisting structured Case & Evidence to Supabase PostgreSQL |
| `src/context/LegalSaathiContext.tsx` | `addChatMessage` (hardcoded `setTimeout`) | Static canned assistant reply | `POST /chat` with hybrid RAG retrieval, citation verification, and LLM synthesis |
| `src/components/VoiceAssistantPanel.tsx` | `mockTranscripts` dictionary | Simulated speech recognition | Web Speech API (`webkitSpeechRecognition`) with fallback to prompt input |
| `src/app/sources/page.tsx` & `[id]/page.tsx` | `VERIFIED_LEGAL_SOURCES` import | Static source cards | Live `GET /sources` with keyword search and category filtering |
| `src/app/similar-cases/page.tsx` & `[clusterId]/page.tsx` | `SIMILAR_CASE_CLUSTERS` import | Static cluster cards | Live `GET /clustering/list` |
| `src/app/complaints/page.tsx` | Hardcoded `if (id === 'LS-2026-0042')` | Branching for dummy IDs | Dynamic generic calculations using `collectedEvidenceCount` / `totalEvidenceCount` |

---

## 3. Real Legal Dataset Inventory

The actual downloaded dataset for Legal Saathi has been thoroughly audited:

1. **Master Indian Legal Dataset (`download_dataset/master_indian_legal_dataset.csv`):**
   - **Size:** 85.6 MB (81.68 MiB)
   - **Row Count:** 175,000 legal documents
   - **Sources:**
     - KanoonGPT/indian-case-laws: 150,000 judgments
     - KanoonGPT/indian-legal-documents: 10,000 documents
     - Hanno-Labs/legal-retrieval-pairs-v1: 10,000 query-passage pairs
     - Supreme-Court-Open-Data: 5,000 judgments
   - **Fields:** `doc_id`, `source`, `text`

2. **Canonical Legislation & Judgments (`data/normalized/`):**
   - `master_canonical_corpus.json`: 11.2 MB, 7,144 canonical acts & judgments
   - `judgments_canonical.json`: 7.55 MB
   - `legislation_canonical.json`: 3.64 MB
   - `incident_clusters_canonical.json`: 4.88 KB
   - `legal_aid_canonical.json`: 3.05 KB

3. **Active Live Knowledge Base (`backend/data/corpus/indian_legal_acts.json`):**
   - **Total Active Chunks:** 9,549 chunks
   - **Total Unique Sources:** 9,447 sources
   - **Statutes Covered:**
     - Bharatiya Nyaya Sanhita, 2023 (BNS) & Indian Penal Code, 1860 (IPC)
     - Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) & CrPC, 1973
     - Bharatiya Sakshya Adhiniyam, 2023 (BSA) & Indian Evidence Act, 1872
     - Model Tenancy Act, 2021 & Delhi/State Rent Control Acts
     - Consumer Protection Act, 2019
     - Real Estate (Regulation and Development) Act, 2016 (RERA)
     - Negotiable Instruments Act, 1881 (Section 138)
     - Motor Vehicles Act, 1988 (MACT)
     - Right to Information Act, 2005 (RTI)
     - Legal Services Authorities Act, 1987 (NALSA/SLSA/DLSA)
     - Industrial Disputes Act, 1947 & Civil Procedure Code, 1908 (CPC)

---

## 4. Architectural Transformation Plan

1. **Add `GET /sources` and enhance `GET /sources/{source_id}` in `backend/routers/sources.py`:**
   - Expose real search and listing across the 9,549 statutory records for the frontend.
2. **Wire `LegalSaathiContext.tsx` to Live Backend:**
   - Replace canned `setTimeout` in `addChatMessage` with async fetch to `POST /chat`.
   - Replace in-memory case creation with `POST /cases`.
   - Maintain active user cases persisted in Supabase PostgreSQL.
3. **Wire Legal Sources UI to Real Data:**
   - Fetch real statutory documents from `GET /sources`.
4. **Wire Similar Cases UI to Real Clusters:**
   - Fetch real cluster patterns from `GET /clustering/list`.
5. **Clean Obsolete Production Mocks:**
   - Empty states for cases and activity feeds when no disputes have been created.
   - Zero fabricated court judgments or fake user accounts.
