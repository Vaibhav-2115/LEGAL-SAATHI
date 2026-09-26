# Legal Saathi — Backend Architecture & System Workflow

**Document Version:** 1.0  
**Stack:** FastAPI / Python 3.10+ / SQLite / Hybrid Retrieval (BM25 + ChromaDB) / Razorpay Gateway / Google Gemini 2.5 Flash  
**Compliance Standard:** Advocates Act 1961 | BCI Rules | GST SAC 998311 | ISO/IEC 27001 Security Headers  

---

## 1. High-Level System Architecture

The following diagram illustrates how incoming client requests flow through security middleware, session authentication, the AI evidence pipeline, action drafting modules, billing systems, and the underlying persistence layer:

```mermaid
flowchart TD
    Client(["Citizen Web / Mobile Client"]) -->|HTTPS REST / Voice Multipart| Gateway["FastAPI Gateway (backend/main.py)"]

    subgraph Security & Session Layer
        Gateway --> SecHeaders["Security Headers Middleware (CSP, HSTS, X-Frame)"]
        SecHeaders --> CORSMiddleware["CORS Gate (Explicit Origin Validation)"]
        CORSMiddleware --> SessionAuth["Session Auth & IDOR Guard (backend/core/auth.py)"]
    end

    SessionAuth --> RouterHub{"FastAPI Router Hub"}

    subgraph Core Routers
        RouterHub -->|/chat| ChatRouter["Chat Router (routers/chat.py)"]
        RouterHub -->|/actions/*| ActionRouters["Action Routers (notice, rti, efir, dlsa)"]
        RouterHub -->|/billing/*| BillingRouter["Billing Router (routers/billing.py)"]
        RouterHub -->|/voice/*| VoiceRouter["Voice STT / TTS (routers/voice.py)"]
        RouterHub -->|/cases, /incidents| CaseRouters["Case & Incident Management"]
        RouterHub -->|/retrieval/*| RetrievalRouter["Statutory Hybrid Search"]
    end

    subgraph Evidence-Grounded AI Engine
        ChatRouter --> Pipeline["LegalSaathiPipeline (services/pipeline.py)"]
        Pipeline --> Classifier["Taxonomy & Urgency Classifier (services/classifier.py)"]
        Classifier -->|Emergency| EmergencyHandler["Emergency 112 / 1930 Short-Circuit"]
        Classifier -->|Normal| Extractor["Entity Extraction & Normalization"]
        Extractor --> HybridSearch["Hybrid Legal Retrieval (services/retrieval_service.py)"]
        HybridSearch --> Corpus[("Indian Legal Corpus: 7,235 Chunks")]
        HybridSearch --> LLM["Grounded LLM Provider (Gemini / Local Fallback)"]
        LLM --> CitationScorer["Citation & Confidence Scorer (services/citation_service.py)"]
        CitationScorer --> EntitlementResolver["Revenue & Entitlement Resolver"]
    end

    subgraph Monetization & Gating Engine
        EntitlementResolver --> EntitlementCheck{"Entitlement Check (core/entitlements.py)"}
        EntitlementCheck -->|Civic Tier / Free| CivicAction["Free Checklists & DLSA Aid (15100)"]
        EntitlementCheck -->|Pro / Paid Draft| UnlockedDoc["Watermark-Free Legal Notice / RTI Draft"]
        EntitlementCheck -->|Cluster Detected| CollectiveDocket["Collective Action Docket (₹499 Escrow)"]
        BillingRouter --> RazorpayClient["Razorpay API / HMAC Verification"]
    end

    subgraph Persistence Layer
        CaseRouters --> DB[("SQLite Database (legal_saathi.db)")]
        BillingRouter --> DB
        ActionRouters --> DB
        Pipeline --> DB
    end
```

---

## 2. Evidence-Grounded AI Pipeline Workflow

The complete sequence diagram detailing how a citizen prompt is classified, cross-referenced against Indian Bare Acts, and synthesized with exact claim citations:

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Citizen / User
    participant Router as /api/v1/chat
    participant Pipeline as LegalSaathiPipeline
    participant Classifier as IssueClassifier
    participant DB as SQLite Database
    participant Retrieval as HybridRetrievalService
    participant LLM as LLMProvider (Gemini)
    participant Citation as CitationService

    Citizen->>Router: POST /chat {text, lang, session_id}
    Router->>Pipeline: process_chat(text, session_id, lang)
    
    Pipeline->>Classifier: classify(text, lang)
    alt Emergency Detected (Assault, Eviction in Progress, Cyber Fraud)
        Classifier-->>Pipeline: is_emergency=True, helpline="112"
        Pipeline-->>Router: Urgent Safety Notice (Short-Circuit)
        Router-->>Citizen: ⚠️ Immediate Police/Cyber Help Alert (112 / 1930)
    else Standard Legal Grievance
        Classifier-->>Pipeline: issue_type="consumer", urgency="medium"
        Pipeline->>DB: save_case(entities, case_title, issue_type)
        DB-->>Pipeline: active_case_id
        
        Pipeline->>Retrieval: search(query, corpus="acts", top_k=5)
        Retrieval->>Retrieval: BM25 Lexical + Vector Dense Retrieval + RRF
        Retrieval-->>Pipeline: Top 5 Relevant Chunks (CPA 2019, RERA, MTA)
        
        Pipeline->>LLM: generate_grounded_answer(query, context_chunks)
        alt Gemini API Available
            LLM->>LLM: Call Gemini 2.5 Flash with System Grounding Rules
        else API Offline / Timeout > 8s
            LLM->>LLM: Fallback to Local Grounded Synthesis Engine
        end
        LLM-->>Pipeline: answer_text
        
        Pipeline->>Citation: attach_citations(answer_text, chunks)
        Citation-->>Pipeline: citations[], confidence_badge ("strong")
        
        Pipeline->>Pipeline: _determine_suggested_action(issue_type, user_tier)
        Pipeline-->>Router: ChatResponse with Citations & Action
        Router-->>Citizen: Grounded Answer + Citations + Next Step Action
    end
```

---

## 3. Revenue, Billing & Entitlement Flowchart

The payment processing, cryptographic signature verification, entitlement provisioning, and automated GST invoicing sequence:

```mermaid
sequenceDiagram
    autonumber
    actor User as Citizen / Advocate
    participant App as Frontend Client
    participant BillingRouter as /api/v1/billing/*
    participant BillingSvc as BillingService
    participant Gateway as Razorpay Payment Gateway
    participant DB as SQLite Database
    participant Entitlements as EntitlementGatekeeper

    User->>App: Click "Draft 15-Day Legal Notice" (₹199) or "Subscribe Pro" (₹149/mo)
    App->>BillingRouter: POST /billing/checkout {item_type, plan_id, customer_name}
    BillingRouter->>BillingSvc: create_checkout_order(req, user_id)
    BillingSvc->>Gateway: order.create({amount_paise, currency: "INR"})
    Gateway-->>BillingSvc: {gateway_order_id: "order_Rzp123"}
    BillingSvc->>DB: INSERT INTO payment_orders (status='created')
    BillingSvc-->>BillingRouter: CheckoutResponse (order_id, key_id, amount)
    BillingRouter-->>App: Checkout Details

    App->>Gateway: Open Razorpay Checkout Modal
    User->>Gateway: Pay via UPI Intent / Card / NetBanking
    Gateway-->>App: {razorpay_payment_id, razorpay_signature}

    App->>BillingRouter: POST /billing/verify {order_id, payment_id, signature}
    BillingRouter->>BillingSvc: verify_payment_signature(req, user_id)
    BillingSvc->>BillingSvc: Compute HMAC-SHA256(order_id + "|" + payment_id)
    
    alt Signature Valid
        BillingSvc->>DB: UPDATE payment_orders SET status='paid'
        BillingSvc->>DB: Provision user_subscriptions OR unlock draft item
        BillingSvc->>DB: INSERT INTO invoices (18% GST Breakdown, SAC 998311)
        BillingSvc-->>BillingRouter: VerifyPaymentResponse (status="success", invoice_id)
        BillingRouter-->>App: Entitlements Unlocked + Invoice Ready
    else Signature Invalid
        BillingRouter-->>App: HTTP 400 Bad Request (Invalid Signature)
    end

    Note over User,Entitlements: Subsequent Call to Gated Feature (e.g. Clean PDF Export)
    App->>BillingRouter: POST /actions/notice/pdf
    BillingRouter->>Entitlements: require_entitlement("notice_draft")
    Entitlements->>DB: check_user_has_active_pro() OR check_user_has_unlocked_item()
    DB-->>Entitlements: True
    Entitlements-->>BillingRouter: Access Granted
    BillingRouter-->>App: Watermark-Free PDF Dossier
```

---

## 4. Relational Database Schema (Entity-Relationship Diagram)

The database schema persisted in [`backend/data/db.py`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/backend/data/db.py):

```mermaid
erDiagram
    SESSIONS ||--o{ CASES : owns
    CASES ||--o| INCIDENTS : generates
    CLUSTERS ||--o{ INCIDENTS : aggregates
    CASES ||--o{ DRAFTS : produces

    SUBSCRIPTION_PLANS ||--o{ USER_SUBSCRIPTIONS : defines
    USER_SUBSCRIPTIONS ||--o{ SESSIONS : links_to_user

    PAYMENT_ORDERS ||--o| INVOICES : generates
    PAYMENT_ORDERS ||--o| COLLECTIVE_POOL_CONTRIBUTIONS : funds

    SESSIONS {
        string session_id PK
        string user_id
        string language_pref
        string created_at
    }

    CASES {
        string case_id PK
        string session_id FK
        string issue_type
        string title
        string description
        string entities_json
        string evidence_json
        string consent_status
        string created_at
        string updated_at
    }

    INCIDENTS {
        string incident_id PK
        string case_id FK
        string cluster_id FK
        string issue_type
        string locality_bucket
        string amount_bucket
        string opposing_party_hash
        int consent_stage1
        int consent_stage2
        string created_at
    }

    CLUSTERS {
        string cluster_id PK
        string issue_type
        string locality_bucket
        string explanation_text
        int member_count
        string incident_ids_json
        string created_at
        string status
    }

    DRAFTS {
        string draft_id PK
        string case_id FK
        string action_type
        string title
        string content
        string metadata_json
        string created_at
    }

    SUBSCRIPTION_PLANS {
        string plan_id PK
        string name
        string tier
        int amount_inr
        string billing_period
        string features_json
        int is_active
        string created_at
    }

    USER_SUBSCRIPTIONS {
        string subscription_id PK
        string user_id
        string plan_id FK
        string status
        string current_period_start
        string current_period_end
        string gateway_subscription_id
        int cancel_at_period_end
        string created_at
        string updated_at
    }

    PAYMENT_ORDERS {
        string order_id PK
        string user_id
        string gateway_order_id
        string item_type
        string item_ref_id
        int amount_inr
        string currency
        string status
        string signature
        string metadata_json
        string created_at
        string paid_at
    }

    INVOICES {
        string invoice_id PK
        string order_id FK
        string user_id
        string customer_name
        string customer_state
        string sac_code
        int base_amount_inr
        int cgst_inr
        int sgst_inr
        int igst_inr
        int total_amount_inr
        string invoice_pdf_url
        string created_at
    }

    COLLECTIVE_POOL_CONTRIBUTIONS {
        string contribution_id PK
        string cluster_id
        string user_id
        string order_id FK
        int amount_inr
        string status
        string created_at
    }
```

---

## 5. Action Modules & Entitlement Gatekeeper Tree

How different citizen actions are partitioned into free public services versus paid professional tools:

```mermaid
graph TD
    Query([Citizen Grievance Action]) --> TypeCheck{Identify Legal Remedy}

    TypeCheck -->|Evidence Literacy| Checklist[Generate Evidence Checklist]
    TypeCheck -->|Govt Legal Aid| DLSA[Locate DLSA Office & Free Counsel]
    TypeCheck -->|Formal Notice| Notice[Draft 15-Day Statutory Legal Notice]
    TypeCheck -->|RTI Query| RTI[Draft Section 6-1 RTI Application]
    TypeCheck -->|Cyber Crime| EFIR[Generate Formal e-FIR Packet]
    TypeCheck -->|Cluster Pattern| ColPledge[Join Collective Action Docket]

    Checklist --> FreeCivic["100% Free Forever (Article 39A Indian Constitution)"]
    DLSA --> FreeCivic

    Notice --> EntitlementGate{User Entitlement Status}
    RTI --> EntitlementGate
    EFIR --> EntitlementGate

    EntitlementGate -->|Bharat Civic Tier| PreviewWatermarked["Free Text Preview with Watermark & Paywall Alert"]
    PreviewWatermarked --> MicroTxOption["Unlock Single Draft for ₹199 OR Upgrade to Saathi Pro for ₹149/mo"]
    
    EntitlementGate -->|Saathi Pro / Advocate Hub| UnlockedExport["Instant Watermark-Free Court-Ready Export & Dispatch Instructions"]

    ColPledge --> EscrowPledge["Pledge ₹499 to Collective Legal Fund (Dispute Conciliation Pool)"]
```

---

## 6. End-to-End API Route Directory

All routes are mounted at both root (`/`) and under `/api/v1/`:

| Path | Method | Description | Access Tier | Gated By |
| :--- | :--- | :--- | :--- | :--- |
| `/chat` | `POST` | Evidence-grounded AI legal advice with citations | Civic (Free) | None |
| `/voice/stt` | `POST` | Multilingual Whisper speech-to-text | Civic (Free) | Rate Limit |
| `/voice/tts` | `POST` | Natural audio voice generation | Civic (Free) | Rate Limit |
| `/retrieval/search` | `POST` | Hybrid search across Bare Acts and Judgments | Civic (Free) | None |
| `/cases` | `GET/POST` | Case dossier creation and ownership retrieval | Civic (Free) | Session Ownership |
| `/incidents` | `POST` | Anonymized grievance logging for cluster discovery | Civic (Free) | Consent Flag |
| `/clustering/run` | `POST` | Run density-based community grievance grouping | Public / Admin | None |
| `/actions/checklist` | `POST` | Procedural document checklists | Civic (Free) | **Free Forever** |
| `/actions/dlsa` | `POST` | NALSA / DLSA free legal aid locator | Civic (Free) | **Free Forever** |
| `/actions/notice` | `POST` | 15-day statutory legal notice generator | Freemium | Watermark if unpaid |
| `/actions/notice/pdf` | `POST` | Watermark-free court-ready PDF notice | Premium | `require_entitlement` (402) |
| `/actions/rti` | `POST` | Section 6(1) RTI application generator | Freemium | Watermark if unpaid |
| `/actions/efir` | `POST` | Formal cyber fraud / e-FIR complaint packet | Freemium | Watermark if unpaid |
| `/billing/plans` | `GET` | List active subscription plans and features | Public | None |
| `/billing/checkout` | `POST` | Create Razorpay order for subscription or single draft | Public | Session Auth |
| `/billing/verify` | `POST` | HMAC-SHA256 signature verification and unlock | Authenticated | Valid HMAC |
| `/billing/subscription` | `GET` | Current tier, expiry, and allowed draft status | Authenticated | Session Auth |
| `/billing/invoices` | `GET` | GST-compliant tax receipts (SAC 998311) | Authenticated | Session Auth |
| `/billing/collective/pledge` | `POST` | Group action escrow contribution (₹499) | Authenticated | Session Auth |
| `/billing/webhook` | `POST` | Asynchronous Razorpay gateway webhook | Gateway | Webhook HMAC |

---

## 7. Local Execution & Validation Guide

### Start Development Server
```powershell
.\backend\venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

* **Interactive Swagger UI:** Visit [`http://localhost:8000/docs`](http://localhost:8000/docs)
* **ReDoc Documentation:** Visit [`http://localhost:8000/redoc`](http://localhost:8000/redoc)

### Run Automated Tests
```powershell
.\backend\venv\Scripts\python.exe -m pytest -q
# Output: 39 passed in 1.89s
```

### Run Dataset Acquisition Pipeline & Golden Retrieval Benchmark
```powershell
.\backend\venv\Scripts\python.exe scripts/run_dataset_pipeline.py
# Output: 100% recall (15/15 golden eval queries) across 7,144 master legal records.
```
