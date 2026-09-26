# Legal Saathi — Evidence-Grounded Legal Assistant

> An evidence-grounded, multilingual, voice-capable legal assistance platform for Indian citizens with automated legal pattern detection and collective action clustering.

---

## 🚀 Quick Start (Backend)

### 1. Requirements
- Python 3.10+
- Installed virtual environment in `backend/venv`

### 2. Activate Virtual Environment & Run Backend
```powershell
# In PowerShell:
.\backend\venv\Scripts\Activate.ps1

# Run the backend server:
python scripts/run_backend.py
```
Or directly with uvicorn:
```powershell
backend\venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative API Documentation (Redoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Running Automated Tests

Run the complete test suite (17 automated tests covering all pipelines, routers, and services):
```powershell
backend\venv\Scripts\python.exe -m pytest backend/tests -v
```

---

## 🏛️ System Architecture

```
User Query (Text/Voice)
  │
  ▼
API & Safety Layer (Rate Limit, PII Logging Hygiene, Prompt Injection Guard)
  │
  ▼
Intent & Urgency Classification (Emergency short-circuiting to 112/181/1930/15100)
  │
  ▼
Entity Extraction & Normalization (Amount bucketing, locality bucketing, SHA-256 hash)
  │
  ▼
Dual Hybrid Legal Retrieval (BM25 Lexical + Vector Semantic + Reciprocal Rank Fusion)
  │
  ▼
Context Assembly (Indian Legal Acts, Judgments & Statutory Sections)
  │
  ▼
LLM Generation (Gemini Primary + Local Grounded Rule Synthesis Fallback)
  │
  ▼
Citation & Trust Layer (Claim-to-source mapping + Confidence Badges: Strong / Partial / Insufficient)
  │
  ▼
Action Layer (Notice Drafting, RTI Application, DLSA Legal Aid, e-FIR, Evidence Checklist)
  │
  ▼
Legal Saathi Engine (Pairwise Similarity ➔ Locality Clustering ➔ 2-Stage Consent ➔ Collective Action)
```

---

## 📡 API Endpoints Summary

| Endpoint | Method | Description |
|---|---|---|
| `/chat` | POST | Main grounded chat pipeline with citations, confidence badge, and action suggestion |
| `/classify` | POST | Classifies legal grievance taxonomy and urgency |
| `/retrieval/search` | POST | Direct hybrid search over Indian legal acts & judgments |
| `/sources/{id}` | GET | Detailed statutory text and official links for a citation |
| `/cases` | POST, GET | Create, list, or retrieve structured Case objects |
| `/cases/{id}` | GET, PATCH | Fetch single case or update evidence/consent status |
| `/incidents` | POST | Submit case to anonymized incident corpus (Stage 1 Consent) |
| `/incidents/{id}/similar`| GET | Query similar incidents near user with human-readable explanation |
| `/clustering/run` | POST | Batch cluster detection across consented incidents |
| `/actions/notice` | POST | Draft formal 15/30-day Indian Legal Notice |
| `/actions/rti` | POST | Generate Section 6(1) RTI Application |
| `/actions/dlsa` | GET | Locate District Legal Services Authority free legal counsel |
| `/actions/efir` | POST | e-FIR eligibility, cyber financial fraud 1930 guidance |
| `/actions/checklist` | POST | Issue-tailored evidence gathering checklist |
| `/voice/stt` | POST | Speech-to-text with Indian language detection |
| `/voice/tts` | POST | Text-to-speech audio synthesis |
| `/analytics/summary` | GET | Aggregate usage metrics and cluster analytics |
| `/health` | GET | Health, database connectivity, and corpus index size |

---

## 🔒 Security & Privacy (The 6 Laws)
1. **No PII in Cross-User Queries**: Opposing party names are salted & hashed with SHA-256 (`opposing_party_hash`), amounts are bucketed, and locations are coarsened to district level.
2. **Two-Stage Consent**:
   - Stage 1: Consent to anonymized pattern detection.
   - Stage 2: Consent to connect with others for collective legal action.
3. **Audit Trail**: Every consent change and critical action is recorded in an append-only `audit_events` table.
4. **Emergency Short-Circuit**: Imminent violence, active criminal threats, or live OTP phishing are intercepted immediately to direct citizens to emergency numbers.
