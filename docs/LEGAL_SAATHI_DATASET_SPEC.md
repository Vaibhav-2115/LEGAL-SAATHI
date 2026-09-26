# Legal Saathi — Dataset Specification v1.0

## 1. Objective

Build an auditable Indian legal-aid knowledge and evaluation system. The corpus is designed for RAG/search first and supervised fine-tuning second.

**Do not train a model to memorize current law.** Store primary legal sources separately, retrieve them at runtime, cite them, and attach temporal/jurisdiction metadata.

## 2. Source tiers

### Tier A — Primary/near-primary corpus
1. `vaquill/open-india-law`
   - `legislation`: individual statutory provisions
   - `judgments`: Supreme Court + 25 High Courts
   - `regulations`: regulator material
2. `KanoonGPT/indian-legal-documents`
   - Acts, Rules, Notifications, Circulars, Orders, Regulations, Guidelines, etc.
3. `KanoonGPT/indian-case-laws`
   - structured case-law metadata/text and provenance

### Tier B — Behavior / instruction data
Use legal QA/SFT datasets only after licensing and provenance review. They teach response style/reasoning behavior; they are NOT authoritative legal sources.

### Tier C — Evaluation
- AILA CaseDocs / Statutes
- IL-TUR
- Legal Saathi golden queries
- Legal Saathi adversarial/safety queries

## 3. Canonical document schema

Every source becomes a record with:

- `document_id`
- `document_type`
- `title`
- `jurisdiction`
- `state`
- `court`
- `authority`
- `decision_date`
- `effective_from`
- `effective_until`
- `language`
- `section`
- `chapter`
- `citation`
- `case_number`
- `case_id`
- `text`
- `source_url`
- `source_dataset`
- `source_license`
- `source_version`
- `retrieved_at`
- `legal_topics`
- `status`
- `quality_flags`

## 4. Retrieval unit

Do not embed an entire judgment or Act.

### Statutes
Chunk at section/subsection/clause boundaries.

### Judgments
Keep:
- case metadata
- headnote/summary when available
- issue/reasoning/holding paragraphs
- paragraph-level chunks

Every chunk must retain `document_id` and source metadata.

Recommended chunk target:
- 400–900 tokens
- 50–120 token overlap only when a legal reasoning unit crosses the boundary

## 5. MVP domain filter

Prioritize:

- landlord–tenant
- rent
- lease
- eviction
- possession
- security deposit
- maintenance/repairs
- consumer housing disputes
- property transfer
- contract disputes
- RTI
- basic civil procedure
- basic criminal-law awareness
- legal-aid/authority routing

Do NOT claim that this subset represents all Indian law.

## 6. Current-law safeguards

Every legal record should carry:

- enactment/decision date
- effective period when available
- jurisdiction
- source URL
- source dataset/version
- repealed/superseded flag where available

For an answer involving law:
1. identify jurisdiction;
2. identify date/time relevance;
3. retrieve current primary authority;
4. retrieve supporting case law if relevant;
5. cite each material proposition;
6. explicitly flag uncertainty or missing facts.

## 7. RAG architecture

Query
→ issue/jurisdiction/date extraction
→ hybrid retrieval (BM25 + embeddings)
→ metadata filter
→ cross-encoder reranking
→ evidence set
→ answer generator
→ citation verifier
→ safety/uncertainty check

Recommended metadata filters:
`jurisdiction`, `state`, `court`, `document_type`, `act_title`, `section`, `decision_date`, `effective_from`, `effective_until`, `status`.

## 8. Evaluation

Track:
- Recall@5 / Recall@10
- MRR
- nDCG@10
- citation precision
- citation completeness
- grounded-answer rate
- unsupported-claim rate
- temporal-law accuracy
- jurisdiction accuracy
- refusal/escalation accuracy
- answer helpfulness (human reviewed)

## 9. Safety

Legal Saathi must not:
- invent statutes/cases/citations
- present generated text as the law
- hide uncertainty
- treat old/repealed law as current
- give a definitive outcome prediction
- expose private incident data
- replace a lawyer/court/legal-aid authority

For high-stakes cases, route the user to an appropriate legal-aid or professional service.

## 10. Data governance

Keep raw and normalized data separate:

`raw/` → immutable source snapshot
`normalized/` → canonical JSON/Parquet
`chunks/` → retrieval chunks
`embeddings/` → vector index
`eval/` → never used for training
`audit/` → provenance and transformations

Never put evaluation queries and answers into the training corpus.

## 11. Licensing

Record the license per source and retain attribution. Verify source terms before commercial deployment and verify official sources for high-stakes legal claims.

## 12. Recommended MVP scale

Do NOT ingest everything initially.

Start with:
- 5–15 high-impact legal domains
- 1,000–10,000 statute provisions
- 10,000–100,000 relevant judgment chunks
- 1,000–5,000 legal documents/rules/notifications
- 200–500 human-reviewed golden queries
- 100–300 adversarial/safety queries
- 50–100 synthetic incident clusters

Expand after retrieval quality is measured.
