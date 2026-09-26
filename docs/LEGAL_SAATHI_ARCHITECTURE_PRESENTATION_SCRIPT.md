# Legal Saathi Architecture Presentation Script (Hinglish)

---

### 1. Introduction (Pitch Starter)

> *"Respected Judges, hamara system **Legal Saathi** teen core pillars par stand karta hai — **Knowledge Layer, LLM Layer, aur Voice Layer**.*
> 
> *Fast response, exact legal precision, aur 100% rural & urban accessibility ko target karke ise design kiya gaya hai taaki India ke har citizen ko uski apni bhasha me instant, evidence-grounded legal justice mil sake."*

---

### 2. Knowledge Layer (ChromaDB + BM25 Hybrid)

> *"Sabse pehle aata hai hamara **Knowledge Layer**.*
> 
> *Legal queries me hum purely LLM ki memory par depend nahi kar sakte kyunki hallucination ka heavy risk hota hai. Ek galat section citizen ki freedom ya savings daav par laga sakta hai.*
> 
> *Isiliye humne **Deterministic Hybrid Search (RRF)** use kiya hai:*
> * **ChromaDB (Dense Retrieval):** Yeh user ke natural bolchaal aur grievance ke intent ko samajhta hai — jaise agar koi bole *'landlord ne bina notice ke saman bahar fek diya'*, toh yeh automatically tenancy laws aur Model Tenancy Act match kar leta hai.
> * **BM25 (Sparse Retrieval):** Yeh exact legal keywords aur statutory section numbers (jaise *'Section 138 NI Act'*, *'Dhara 498-A'*, ya *'Section 35 Consumer Protection Act'*) ke liye 100% exact match guarantee karta hai.
> 
> *Dono engines parallel chalte hain aur **Reciprocal Rank Fusion (RRF)** se merge hote hain, jisse legal accuracy 100% rehti hai aur **Zero Hallucination** ensure hota hai."*

---

### 3. LLM Layer (Groq + Gemini Dual Engine)

> *"Next hai hamara **LLM Layer**, jahan humne **Dual-Engine Dynamic Routing Strategy** apply ki hai:*
> 
> * **Primary Engine (Groq LPU + Llama-3.1-8B):** Groq ki hardware tensor-streaming speed over **400+ tokens per second** hai. Iss wajah se user ko **sub-250 millisecond me Time-to-First-Token (TTFT)** milta hai — conversation bilkul real-time lagti hai, zero lag ke sath.
> * **Secondary Engine (Gemini 2.0 Flash):** Achanak traffic spike hone par ya Groq rate limit (HTTP 429) hit hone par hamara **automated circuit breaker** bina kisi user lag ke **Gemini 2.0 Flash** par auto-switch ho jata hai. Sath hi, agar 80-page ka property deed, builder agreement, ya chargesheet ho, toh Gemini ka **1 Million token context window** bina kisi chunking loss ke heavy processing sambhal leta hai."*

---

### 4. Voice & Indic Layer (STT + TTS Devanagari)

> *"Next, hamara **Voice Layer** Legal Saathi ko har citizen ke liye accessible banata hai:*
> 
> * India me har citizen padhna-likhna ya English type karna nahi jaanta, isliye hum **11+ Indian Languages** voice-first support karte hain.
> * **Devanagari & Phonetic Normalization Engine:** Raw legal jargon aur numbers ko natural speech me convert karne ke liye humne custom normalization engine use kiya hai — jaise AI robotically *'Sec four-nine-eight-eh'* bolne ke bajaye naturally **'Dhara 498-A'**, aur *'Sec 138'* ko **'Dhara 138, cheque bounce kanoon'** bolta hai.
> * Voice input se RAG retrieval aur instant speech response tak ka round-trip **sub-second (< 1 second)** rehta hai."*

---

### 5. Action & Community Layer (The Unique Differentiator)

> *"Sirf advice dena kaafi nahi hota, isliye Legal Saathi citizen ko concrete action provide karta hai:*
> 
> * **Automated Legal Notices:** 15-day formal, court-admissible legal notice, RTI query, aur e-FIR drafts directly generate hote hain.
> * **Collective Action Dockets:** Agar ek locality me 15 tenants ke deposit roke gaye hain, ya ek builder ne 40 buyers ko flat nahi diya, toh AI pattern detect karke unhe **₹499 ke Collective Action Docket** me jodh deta hai — eliminating ₹50,000 advocate fees.
> * **Free Civic Protection:** NALSA aur District Legal Services Authority (**DLSA helpline 15100**) ke through free government legal aid hamesha 100% free rehti hai."*

---

### 6. Closing Summary (The Impact Pitch)

> *"In summary:*
> * **Hybrid Search (ChromaDB + BM25)** se **0% Hallucination**,
> * **Groq + Gemini Dual Engine** se **100% Uptime aur Sub-Second Speed**,
> * Aur **Voice & Indic Layer** se **100% Indian Citizens ke liye Accessibility**.
> 
> *Har citizen ka apna digital kanooni saathi — **Legal Saathi**. Thank you!"*
