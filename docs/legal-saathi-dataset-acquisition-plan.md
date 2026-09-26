# Legal Saathi — Dataset Acquisition & Corpus-Building Plan

*Research-grade discovery of public Indian-law datasets, verified where possible against live pages, GitHub repos, Hugging Face, AWS Open Data, and academic sources (Sept 2026).*

> **How to read the "Verified" column:** ✅ = page/repo confirmed live and content matches description during this research session. ⚠️ = exists and is described in a paper/registry but access details (auth, current uptime) not independently re-checked. ❌ = referenced in literature but currently unavailable/paywalled/dead.

---

## PART 1 — MASTER DATASET TABLE

| # | Dataset | Source/Org | Category | Size / Records | Format | Lang(s) | License | Auth Required | Verified |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Indian Supreme Court Judgments (AWS Open Data)** | Dattam Labs / vanga (GitHub) | Judgments | 1950–2025, all SC judgments | JSON (raw) + Parquet (metadata), zipped PDFs | English + some regional (eSCR/SUVAS) | CC-BY-4.0 (packaging; underlying text public domain, Copyright Act §52(1)(q)(iv)) | No — public S3, `--no-sign-request` | ✅ |
| 2 | **Indian High Court Judgments (AWS Open Data)** | vanga/indian-high-court-judgments (GitHub) | Judgments | 25 High Courts, ~17.8M judgments, ~1.25 TiB | PDF + JSON + Parquet, tar bundles | English, some regional | CC-BY-4.0 | No — public S3 bucket | ✅ |
| 3 | **Development Data Lab — Judicial Data (eCourts district/taluka)** | Development Data Lab | Judgments/case records | 81M district & taluka court case records, 2010–2018 | CSV/structured tables | English | CC BY-NC-SA 4.0 (commercial license separate) | No, direct download | ✅ |
| 4 | **NyayaAnumana** | Law-AI Lab, IIT Kharagpur (COLING 2025) | Judgment prediction | 7,02,945 preprocessed cases (22,82,137 raw scraped) — SC, HC, tribunals, district, daily orders | JSON/text | English (mostly) | Research license (check paper/HF repo) | Likely HF login | ⚠️ |
| 5 | **ILDC (Indian Legal Documents Corpus)** | Malik et al. 2021 / Exploration-Lab | Judgment prediction & explanation | ~35–40K SC cases (1947–2020) | Text/JSON | English | Research use (see GitHub) | HF/GitHub | ✅ |
| 6 | **IL-TUR (Indian Legal Text Understanding & Reasoning)** | Exploration-Lab, HF | Multi-task benchmark (8 tasks: rhetorical roles, judgment prediction, bail prediction, summarization, NER, statute ID, precedent retrieval, semantic segmentation) | Varies per task; PCR/judgment split has 34K+ docs | HF dataset viewer + Parquet | English + some Indic | Research (HF terms) | HF account for some | ✅ |
| 7 | **HLDC — Hindi Legal Documents Corpus** | Kapoor et al. 2022, Exploration-Lab/IIT Kanpur | Judgments (district-level, Hindi) | 912,568 documents | Structured text/JSON | Hindi | Research license (GitHub) | No | ✅ |
| 8 | **InLegalBERT pretraining corpus** | law-ai (IIT Kharagpur) | Raw legal text corpus (not QA) | ~5.4M documents, ~27GB raw text, 1950–2019 | Raw text | English | Research (model weights open on HF) | No (model open); raw corpus availability unclear | ⚠️ |
| 9 | **opennyaiorg/InRhetoricalRoles** | OpenNyAI | Rhetorical-role segmentation | Corpus of judgments segmented/labelled (Facts, Issues, Arguments, Ruling, etc.) | JSON | English | Open (HF) | No | ✅ |
| 10 | **opennyaiorg/InLegalNER** | OpenNyAI | NER | 46,545 annotated legal named entities, 14 entity types | JSON/CoNLL-like | English | Open (HF) | No | ✅ |
| 11 | **opennyaiorg/InJudgements_dataset** | OpenNyAI | Curated representative judgment sample | Representative sample 1950–2017, 8 case-type categories (tax, criminal, civil, MV, land, labour, constitution, financial) | Text + IndianKanoon URL | English | Open (HF) | No | ✅ |
| 12 | **opennyaiorg/aalap_instruction_dataset** | OpenNyAI (AALAP project) | Legal SFT/instruction data | Instruction-tuning set: argument generation, issue generation, event-timeline creation, FIR-based tasks | JSON instruction format | English | Mixed licenses per sub-task (check dataset card) | No | ✅ |
| 13 | **opennyaiorg/aibe_dataset** | OpenNyAI | Legal QA (bar exam) | All India Bar Exam Qs, AIBE 4–16 (12 years), MCQ w/ answers | JSON | English | Open, eval-only (no modification per dataset card) | No | ✅ |
| 14 | **IndicLegalQA** | Veningston & Mishra, NIT Srinagar (Mendeley Data) | Legal QA | 10,000 QA pairs from 1,256 SC judgments (538 criminal / 718 civil) | CSV/JSON | English | CC BY 4.0 | No | ✅ |
| 15 | **CS-781-Capstone (Exploration-Lab)** | IIT Kanpur course dataset | Multi-task legal NLP (rhetorical roles, judgment prediction, statute ID, summarization, precedent/case retrieval) | Multiple phases, each with train/dev/test | JSON | English | Research/course use — verify before production use | HF | ✅ |
| 16 | **India Code (indiacode.nic.in)** | Ministry of Law & Justice, GoI | Legislation (Central + State Acts, rules, notifications, ordinances) | ~15,000+ Acts, ~4 lakh+ sections (per secondary aggregators) | HTML pages (no bulk API from GoI itself) | English, Hindi (partial) | Government/public domain | No, but no official bulk-download API | ✅ (site exists; no native bulk export) |
| 17 | **civictech-India/Indian-Law-Penal-Code-Json** | GitHub (community) | Legislation (structured) | 8 major bare acts (IPC, CrPC, CPC, etc.) as JSON + single SQLite DB | JSON, SQLite | English | Check repo license (often MIT/community) | No | ✅ |
| 18 | **Kaggle — "Laws and Acts of India"** | kausthubkannan (Kaggle) | Legislation | Collection of Acts (scope/records not fully specified on listing) | CSV (typical for Kaggle) | English | Kaggle dataset license (check page) | Kaggle login | ⚠️ |
| 19 | **eCourtsIndia "IndiaCode" mirror** | eCourtsIndia (private, blog-announced Aug 2026) | Legislation + linked case law | 10,000+ Acts, 269,000+ sections, each cross-linked to judgments construing them | Free JSON API (no key), Markdown, Akoma Ntoso XML, llms.txt | English | CC BY 4.0 (per blog) | No | ⚠️ (recent commercial project — verify longevity/ToS before relying on it) |
| 20 | **India Code API wrapper (Parse.bot marketplace)** | Third-party (Parse.bot) | Legislation API | 6 endpoints: search_acts, browse_central_acts, get_act_details, get_section_detail, scrape_act_full_structured, get_state_acts | REST/JSON | English | Paid, per-call credits | API key | ⚠️ |
| 21 | **NALSA Statistics / Legal Service Beneficiaries Report** | National Legal Services Authority (nalsa.gov.in) | Legal aid | State/district-wise beneficiary counts, Lok Adalat stats (published reports, not bulk CSV) | HTML/PDF reports | English | Government/public | No | ✅ |
| 22 | **data.gov.in — Consumer Complaints by Commission (2019-20 to 2021-22)** | Dept. of Consumer Affairs via OGD Platform India | Legal aid/consumer disputes | Year-wise complaint counts across consumer commissions | CSV/API (OGD standard) | English | Government Open Data License – India | No | ✅ |
| 23 | **National Judicial Data Grid (NJDG)** | eCommittee, Supreme Court of India | Case pendency / status dashboards | All-India pendency stats, near real-time; not a bulk downloadable corpus | Dashboard (HTML); some data feeds via eCourts APIs | English | Government | Dashboard: no; underlying API: restricted | ✅ (dashboard); ❌ (no public bulk export) |
| 24 | **Indian Kanoon (public search engine)** | Indian Kanoon (Sushant Sinha) | Judgments — largest single index | 30M+ orders/judgments across SC, 24 HCs, tribunals | Web search UI; **paid API** for structured/bulk access | English (mostly) | Site: free to browse, no scraping per ToS; **API: commercial, paid, ToS-bound** | Paid API key for bulk/structured use | ✅ |
| 25 | **MTEB / lighteval "legal_summarization"** | HF community (derived from tldrlegal.com / tosdr.org) | Summarization (contract, NOT India-specific) | 439 contract–summary pairs | HF Parquet | English | Check HF card (derivative of two sites' ToS text) | No | ✅ |
| 26 | **AIBE / Indian Penal Code PDF (harshitv804/Indian_Penal_Code)** | HF community | Legislation (single Act) | Full IPC text as PDF | PDF | English | Unspecified on card | No | ✅ |
| 27 | **Kaggle — "Legal Dataset: SC Judgments India (1950–2024)"** | adarshsingh0903 (Kaggle) | Judgments | ~26,000 PDF judgment files, ~98% of SC judgments on Indian Kanoon as of early 2025 | PDF | English | Kaggle license (verify — scraped from Indian Kanoon, so redistribution rights are unclear) | Kaggle login | ⚠️ — re-scrape of Indian Kanoon; check IK's ToS before use |
| 28 | **Kaggle — "District and Taluka Court Cases in India"** | saurabhshahane (Kaggle) | Case records | Unknown / Not specified (page-gated) | CSV (typical) | English | Kaggle license | Kaggle login | ⚠️ |
| 29 | **Kaggle — "Indian Kanoon cases"** | regressingaddict (Kaggle) | Judgments | Unknown / Not specified | CSV/JSON | English | Kaggle license — same IK re-scrape concern as #27 | Kaggle login | ⚠️ |
| 30 | **therajasekhar/sc-judgments-indic-v1** | HF community | Multilingual judgments (MT pairs) | 2023 coverage: 856 total docs; Telugu 318 (37%), Hindi 796 (93%), sourced from eSCR/SUVAS official translations | Parquet | English, Hindi, Telugu | CC-BY-4.0 (packaging); translations carry eSCR "no legal effect" disclaimer | No | ✅ |
| 31 | **HuggingFace generic "Legal-Dataset-for-india" (ravisingh369)** | HF community | RAG-ready chunked text | Chunked from 2 books (financial-markets law guide + litigation guide) — small, secondary source | Text chunks | English | Check card | No | ✅ (small, low authority — Tier 3/4) |
| 32 | **aadityaJagdale/cleaned_legal_dataset** | HF community | Judgments, cleaned/vectorized | Petitioner/respondent/date/bench/citation/judgment fields; FAISS/ChromaDB-ready | JSON | English | Check card; "research/educational" disclaimer, verify legal status of cited cases yourself | No | ⚠️ — description reads AI-generated/marketing-heavy; verify actual record count and provenance before relying on it |
| 33 | **Open Justice India (openjustice-in.github.io)** — aggregator/index | Community (CivicDataLab-adjacent) | Meta-index of the above + High Court case/hearing records (23/25 HCs) | Points to #1–#3 plus its own scrape of hearing records | Mixed | English | Mixed (CC-BY where stated) | No | ✅ (good starting hub, not itself a single dataset) |

**Datasets described in literature but not independently re-verified as currently downloadable in this session** (flagged so you don't waste time chasing dead links):
- **MILPaC** — parallel legal corpus, English + 9 Indic languages. Referenced in a 2026 survey paper; exact repo/host not located in this session. → `Historical/currently unavailable — verify before relying on it.`
- **INLegalLlama** — this is a *model*, not a raw dataset; its training data is NyayaAnumana (#4).
- **PredEx** — referenced as a prior LJP dataset that NyayaAnumana surpasses; not independently located/verified here.

This gives **33 verified/partially-verified sources** rather than a padded 50 — every one above is either a live page I found this session or a named academic resource with a traceable citation. I did not invent any download URL.

---

## PART 2 — TOP DATASETS FOR LEGAL SAATHI (MVP FOCUS)

Given your MVP is Q&A + legal-aid/lawyer referral, freemium, for a hackathon judge round — here's what actually matters, ranked:

1. **India Code + civictech-India JSON / eCourtsIndia mirror (#16, #17, #19)** — this is your **authoritative statutory backbone**. Bare Acts (IPC/BNS, CrPC/BNSS, CPC, Evidence Act/BSA, Consumer Protection Act, RTI Act, etc.) are what a "which law applies to me" chatbot needs first, and they're small enough (thousands of sections, not millions of judgments) to fully ingest for a hackathon MVP. **Limitation:** the *official* India Code site has no bulk API — you'd rely on the community JSON repo (small, ~8 Acts) or a third-party mirror (verify ToS/uptime since it's a young commercial project).

2. **Indian Supreme Court + High Court Judgments on AWS Open Data (#1, #2)** — Tier-1, genuinely bulk-downloadable via public S3 (no AWS account needed, `--no-sign-request`), CC-BY-4.0, with both raw PDF and structured Parquet metadata. This is your **RAG backbone for case law** — but at ~17.8M+ HC judgments (1.25 TiB) it is far more than an MVP needs; for a hackathon, filter to one or two High Courts + recent years, or use the Supreme Court subset only (~26K judgments, matches Kaggle #27's count almost exactly — confirming overlap).

3. **IndicLegalQA (#14) + opennyaiorg/aibe_dataset (#13) + CS-781-Capstone (#15)** — smallest-effort path to a **working Q&A demo**: pre-built question–answer pairs grounded in real SC judgments (10K pairs), plus bar-exam MCQs for evaluating the model's legal reasoning. These are exactly the kind of thing a judge will ask "did you build the QA layer yourself or borrow it" about — be ready to say which parts are borrowed (all of #13–15) vs authored.

4. **opennyaiorg suite (#9, #10, #11, #12)** — gives you rhetorical-role segmentation, NER, and a pre-curated "most-cited/representative" judgment sample instead of a random slice, which is exactly what a hackathon-scale RAG index needs (quality over 30M-document brute force).

5. **NALSA statistics + data.gov.in consumer-complaint data (#21, #22)** — not text corpora, but this is what lets your "where should I go / am I eligible for legal aid" referral layer cite real numbers/authorities instead of hallucinating them.

**Overlap note:** #1 (SC AWS dataset), #27 (Kaggle SC PDFs), and #11 (OpenNyAI representative sample) all draw from the *same underlying SC judgment population* (Indian Kanoon / eCourts). Do not treat these as three independent sources for corpus-size purposes — dedupe by case number/citation, not by dataset name.

---

## PART 3 — DOWNLOAD INFORMATION

```bash
# Indian Supreme Court judgments (AWS Open Data) — no AWS account needed
aws s3 sync s3://indian-supreme-court-judgments/ ./sc-judgments/ --no-sign-request

# Indian High Court judgments (AWS Open Data) — filter to one court/year for MVP scale
aws s3 sync s3://indian-high-court-judgments/data/tar/ ./hc-judgments/ \
  --exclude "*" --include "year=2024/court=27_1/*" --no-sign-request
```

```python
# Hugging Face datasets (OpenNyAI suite, IL-TUR, etc.)
from datasets import load_dataset

rhetorical_roles = load_dataset("opennyaiorg/InRhetoricalRoles")
ner              = load_dataset("opennyaiorg/InLegalNER")
judgment_sample  = load_dataset("opennyaiorg/InJudgements_dataset")
aibe_qa          = load_dataset("opennyaiorg/aibe_dataset")
il_tur           = load_dataset("Exploration-Lab/IL-TUR")
```

```text
# IndicLegalQA — download directly from Mendeley Data (no scraping/API needed)
https://data.mendeley.com/datasets/gf8n8cnmvc/2

# civictech-India bare acts (small, structured)
git clone https://github.com/civictech-India/Indian-Law-Penal-Code-Json

# India Code — no official bulk API; browse/scrape respectfully at
https://www.indiacode.nic.in (check robots.txt / ToS before scraping)

# NALSA statistics (published reports, not an API)
https://nalsa.gov.in/statistics/

# Consumer complaints — Open Government Data Platform India (has a documented API)
https://www.data.gov.in/resource/year-wise-details-consumer-complaints-received-consumer-commissions-across-country-2019-20
```

**Do NOT invent commands for:** MILPaC (location not confirmed), the eCourtsIndia mirror's exact API schema (confirm on their site before building against it), or Indian Kanoon's API (it is a **paid, ToS-gated commercial product** — apply at `api.indiankanoon.org`; do not bulk-scrape the free website, which explicitly prohibits it).

---

## PART 4 — MASTER CORPUS DESIGN

```text
LEGAL SAATHI CORPUS
│
├── legislation/            ← India Code / civictech JSON / eCourtsIndia mirror
│   ├── central_acts/
│   ├── state_acts/
│   └── constitution/
│
├── judgments/
│   ├── supreme_court/      ← AWS dataset #1 (canonical) + dedupe against Kaggle #27, OpenNyAI #11
│   ├── high_courts/        ← AWS dataset #2, filtered by state for MVP
│   └── district/           ← Dev Data Lab #3 (metadata only, not full text) + HLDC #7 (Hindi, full text)
│
├── qa_and_reasoning/       ← IndicLegalQA #14, aibe_dataset #13, CS-781 #15, aalap #12
├── nlp_annotations/        ← InRhetoricalRoles #9, InLegalNER #10, IL-TUR #6
├── legal_aid_and_referral/ ← NALSA #21, consumer-complaints #22, NJDG #23 (stats only)
└── multilingual/           ← HLDC #7 (Hindi), sc-judgments-indic-v1 #30 (Hindi/Telugu)
```

**Estimated scale (rough — treat as planning numbers, not measured facts):**

| Tier | Composition | Approx. size |
|---|---|---|
| **Small MVP (hackathon)** | All bare Acts + SC judgments only (~26–30K docs) + IndicLegalQA + OpenNyAI annotations | Low single-digit GB, fits in a laptop-buildable vector index (~50–150K chunks) |
| **Medium production** | + 3–5 High Courts, recent 5 years | Tens of GB, several million chunks |
| **Large research corpus** | Full AWS HC dataset (17.8M judgments, 1.25 TiB) + district metadata (81M records) | Multi-TB; needs cloud storage + distributed embedding pipeline, well beyond hackathon scope |

---

## PART 5 — DEDUPLICATION STRATEGY

- **Exact duplicates:** SHA-256 of normalized (whitespace-stripped, lowercased) full text.
- **Near-duplicates / same judgment from multiple sources:** the AWS SC dataset, Kaggle #27, and OpenNyAI #11 all ultimately trace to Indian Kanoon/eCourts — match on **case number + citation + decision date** (not filename), since PDF-to-text extraction differs slightly across scrapers (confirmed by the High-Court repo's own note about `cnr`/`decision_date`/`order_number` being the true cross-source identity, not filenames).
- **Amended legislation / repeated sections:** version by `act_number + section + effective_date`; keep repealed versions tagged `repealed: true` rather than deleting them.
- **Translated copies:** flag via `sc-judgments-indic-v1`'s own approach — mark translation as official (eSCR/SUVAS) vs. unofficial, and never merge a machine translation into the same record as the authoritative English text.
- **MinHash/LSH** across the corpus after exact-hash pass, for OCR variants of the same PDF.

---

## PART 6 — DATA PIPELINE

```text
DOWNLOAD (S3 sync / HF load_dataset / Mendeley direct)
   ↓
RAW STORAGE (partition by source_dataset + year)
   ↓
VALIDATION (non-empty text, valid encoding, matches expected schema)
   ↓
NORMALIZATION (canonical schema below)
   ↓
DEDUPLICATION (hash + citation/case-number matching)
   ↓
METADATA EXTRACTION (InLegalNER for entities, InRhetoricalRoles for structure)
   ↓
JURISDICTION / DATE FILTER (drop pre-Constitution or superseded law unless flagged historical)
   ↓
CHUNKING (respect rhetorical-role/section boundaries, not fixed token windows)
   ↓
EMBEDDINGS → VECTOR DB + BM25 INDEX → HYBRID RETRIEVAL → RERANKER → LEGAL SAATHI
```

**Canonical schema** (trim per source; not every field applies to every record):

```json
{
  "document_id": "",
  "document_type": "act_section | judgment | qa_pair | ner_annotation",
  "title": "",
  "jurisdiction": "India",
  "state": "",
  "court": "",
  "language": "",
  "date": "",
  "act": "",
  "section": "",
  "case_number": "",
  "citation": "",
  "text": "",
  "summary": "",
  "source_url": "",
  "source_dataset": "",
  "license": "",
  "status": "current | repealed | superseded",
  "quality_score": null
}
```

---

## PART 7 — LEGAL SAFETY NOTES

- **Repealed/replaced codes:** IPC → Bharatiya Nyaya Sanhita (BNS), CrPC → Bharatiya Nagarik Suraksha Sanhita (BNSS), Evidence Act → Bharatiya Sakshya Adhiniyam (BSA) all changed in 2023–24. Any corpus built from pre-2023 sources (ILDC, HLDC, most Kaggle judgment scrapes) will cite the **old codes** — Legal Saathi must map old-code citations to new-code equivalents rather than presenting either as exclusively current.
- **Unofficial translations:** the eSCR/SUVAS-derived Hindi/Telugu judgment translations carry an explicit "general information, no legal effect" disclaimer from the source — surface that disclaimer to end users, don't silently drop it.
- **Jurisdiction differences:** State Acts and district-court data are state-specific; don't let a Delhi-district-court answer masquerade as pan-India law.
- **Hallucination risk from SFT sets:** treat opennyaiorg/aalap and any LLM-generated QA/instruction data as *behavior examples*, never as legal authority — the OpenNyAI dataset card itself warns against relying on LLMs "to generate legal precedents and statute definitions."
- **Scraped-judgment provenance:** #27, #28, #29 (Kaggle re-scrapes of Indian Kanoon) have unclear redistribution rights — Indian Kanoon's own site prohibits scraping in its ToS even though the underlying judgments are public domain. Prefer the AWS Open Data sources (#1, #2), which package directly from the eCourts government portal, not from Indian Kanoon.

---

## PART 8 — LICENSE AUDIT (selected)

| Dataset | License | Commercial use | Redistribution | Notes |
|---|---|---|---|---|
| AWS SC/HC judgments (#1, #2) | CC-BY-4.0 (packaging) | Yes | Yes, with attribution | Underlying text is public domain under Copyright Act §52(1)(q)(iv) |
| Dev Data Lab judicial data (#3) | CC BY-NC-SA 4.0 | **No** (needs separate commercial license) | Yes, non-commercial, share-alike | Contact Dev Data Lab for commercial use — relevant since your business model is freemium/commercial |
| IndicLegalQA (#14) | CC BY 4.0 | Yes | Yes, with attribution | Clean license, good for a commercial hackathon product |
| OpenNyAI suite (#9–13) | Open on HF, but verify each card individually | Mostly yes | Check per-dataset card | aibe_dataset explicitly says "evaluation only, do not alter" |
| Indian Kanoon API (#24) | Commercial/paid ToS | Only under paid agreement | No independent redistribution | Do not scrape the free site as a substitute |
| Kaggle re-scrapes (#27–29) | Kaggle dataset license (varies) | **Unclear** — flag for review | Unclear | Re-derived from Indian Kanoon; verify before commercial use |

---

## PART 9 — FINAL RECOMMENDATION

**A. DOWNLOAD NOW**
- AWS Open Data: Supreme Court + (filtered) High Court judgments (#1, #2)
- IndicLegalQA (#14) — Mendeley, clean CC-BY-4.0
- OpenNyAI suite: InRhetoricalRoles, InLegalNER, InJudgements_dataset, aibe_dataset (#9–13)
- civictech-India bare-acts JSON (#17)
- data.gov.in consumer-complaints dataset (#22)

**B. DOWNLOAD AFTER REVIEW**
- Development Data Lab judicial data (#3) — non-commercial license conflicts with a freemium business model; contact them
- eCourtsIndia commercial mirror (#19) and Parse.bot India Code API (#20) — young/commercial, confirm ToS and uptime
- Kaggle SC-judgment re-scrapes (#27–29) — redistribution rights unclear given Indian Kanoon's ToS

**C. DO NOT USE (as-is)**
- Indian Kanoon free website via scraping — explicitly against their ToS; use the paid API instead if you need their specific index
- MILPaC — could not verify a current, accessible host in this session

**D. BUILD OURSELVES**
- Old-code → new-code (IPC→BNS, CrPC→BNSS, Evidence Act→BSA) mapping table — nothing in the datasets above does this natively, and it's the single highest-value thing you can hand-build for a judge Q&A round
- A small hand-reviewed "golden set" of 30–50 everyday tenancy/consumer/RTI questions with verified correct answers, for demoing accuracy live
- Synthetic anonymized incident examples for tenancy/consumer/property scenarios (per your own project's Category 13 rule: no real PII, and explicitly synthetic where no public dataset exists)

---

*Everything above reflects sources actually located and cross-checked during this research session. Where a size, license, or access detail could not be confirmed, it's marked `Unknown / Not specified` or flagged ⚠️ rather than guessed.*
