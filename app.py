"""
Legal Saathi - AI Legal Assistant Test Interface
Streamlit application powered by Google GenAI (Gemini API) and Legal Saathi Knowledge.
"""

import os
import sys
from pathlib import Path
import streamlit as st

# Load environment variables from .env or .env.local if present
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent / ".env"
    env_local_path = Path(__file__).resolve().parent / ".env.local"
    if env_path.exists():
        load_dotenv(env_path)
    elif env_local_path.exists():
        load_dotenv(env_local_path)
except ImportError:
    pass

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Configure Streamlit Page
st.set_page_config(
    page_title="Legal Saathi — AI Legal Assistant",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling for polished legal aesthetic
st.markdown(
    """
    <style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.5rem;
    }
    .stChatMessage {
        border-radius: 0.5rem;
        padding: 0.5rem;
    }
    .legal-badge {
        display: inline-block;
        background-color: #EEF2FF;
        color: #3730A3;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        margin-right: 0.4rem;
        margin-bottom: 0.4rem;
    }
    .disclaimer-box {
        background-color: #FEF3C7;
        border-left: 4px solid #F59E0B;
        padding: 0.75rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.85rem;
        color: #92400E;
        margin-bottom: 1rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

DEFAULT_SYSTEM_INSTRUCTION = """You are Legal Saathi, an authoritative, empathetic, and highly knowledgeable Indian legal assistant.
Your goal is to provide accurate, citizen-centric legal awareness, procedural guidance, and statutory references.

Key guidelines:
1. Grounding in Indian Law: Refer to applicable statutes, including Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC), Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC, Bharatiya Sakshya Adhiniyam (BSA) / Evidence Act, Consumer Protection Act 2019, Negotiable Instruments Act 1881, and Legal Services Authorities Act 1987.
2. Legal Aid: Emphasize free legal aid rights under Section 12 of the Legal Services Authorities Act (NALSA / SLSA / DLSA) for women, children, SC/ST, persons in custody, and low-income citizens.
3. Clarity: Provide structured, step-by-step actionable procedures (e.g. how to lodge an FIR/e-FIR, issue legal notice, file RTI, or approach Lok Adalat).
4. Disclaimer: Clearly state that your assistance is for educational and informational purposes, and not a substitute for formal legal representation from an advocate.
"""

# ==============================================================================
# SIDEBAR CONFIGURATION
# ==============================================================================
with st.sidebar:
    st.title("⚖️ Legal Saathi")
    st.caption("AI-Powered Indian Legal Assistant")

    st.markdown("---")
    st.subheader("🔑 Gemini API Setup")

    env_api_key = os.getenv("GEMINI_API_KEY", "")
    api_key_input = st.text_input(
        "Gemini API Key",
        value=env_api_key,
        type="password",
        help="Get a free Gemini API key at https://aistudio.google.com/app/apikey",
    )

    if not api_key_input:
        st.info("💡 Enter your API key above or set `GEMINI_API_KEY` in `.env` to start.")
        st.markdown("[Get Free Gemini API Key ↗](https://aistudio.google.com/app/apikey)")

    st.markdown("---")
    st.subheader("⚙️ Model Settings")

    model_options = [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
    ]
    selected_model = st.selectbox(
        "Model Version",
        options=model_options,
        index=0,
        help="gemini-2.5-flash is optimized for high speed and legal reasoning.",
    )

    temperature = st.slider(
        "Temperature (Creativity vs Strictness)",
        min_value=0.0,
        max_value=1.0,
        value=0.2,
        step=0.05,
        help="Lower values (0.1 - 0.3) provide more factual and deterministic legal citations.",
    )

    with st.expander("📝 System Instructions", expanded=False):
        system_instruction = st.text_area(
            "System Prompt",
            value=DEFAULT_SYSTEM_INSTRUCTION,
            height=200,
        )

    st.markdown("---")
    st.subheader("📊 Dataset Knowledge Base")
    st.markdown(
        """
        <div style="font-size: 0.85rem; color: #4B5563;">
            <div class="legal-badge">175k Case Laws & Acts</div>
            <div class="legal-badge">10-Yr NALSA Legal Aid</div>
            <div class="legal-badge">Supreme Court 2023-17</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if st.button("🗑️ Clear Chat History", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

# ==============================================================================
# MAIN VIEW
# ==============================================================================
st.markdown('<div class="main-header">⚖️ Legal Saathi — Legal Assistant</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-header">Instant legal guidance on Indian statutory law, legal rights, and government legal aid.</div>',
    unsafe_allow_html=True,
)

st.markdown(
    """
    <div class="disclaimer-box">
        <strong>⚠️ Legal Disclaimer:</strong> Legal Saathi provides automated informational assistance based on statutory provisions and public legal data. It does not constitute attorney-client privilege or licensed legal counsel.
    </div>
    """,
    unsafe_allow_html=True,
)

# Initialize Session Messages
if "messages" not in st.session_state:
    st.session_state.messages = []

# Preset Example Queries (if chat is empty)
if not st.session_state.messages:
    st.markdown("##### 📌 Try a sample legal inquiry:")
    col1, col2 = st.columns(2)

    sample_prompts = [
        ("🛡️ Free Legal Aid Eligibility", "Who is eligible for free legal aid under Section 12 of the Legal Services Authorities Act, 1987, and how do I apply?"),
        ("📝 Filing an e-FIR for Cyber Fraud", "What are the exact steps to report financial cyber fraud and file a complaint on the National Cyber Crime Reporting Portal?"),
        ("💳 Cheque Bounce (Sec 138 NI Act)", "What is the procedure and timeline to send a statutory demand notice when a cheque bounces under Section 138 of the NI Act?"),
        ("🏠 Tenant Rights under Tenancy Law", "What are my rights as a residential tenant against wrongful eviction or sudden deposit forfeiture?"),
    ]

    for idx, (label, query) in enumerate(sample_prompts):
        target_col = col1 if idx % 2 == 0 else col2
        with target_col:
            if st.button(label, key=f"sample_{idx}", use_container_width=True):
                st.session_state.messages.append({"role": "user", "content": query})
                st.rerun()

# Render Chat History
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# User Chat Input
user_input = st.chat_input("Ask a legal question (e.g. consumer court filing, bail guidelines, domestic violence rights)...")

if user_input:
    # Append User Message
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Validate API Key
    active_key = api_key_input.strip()
    if not active_key:
        with st.chat_message("assistant"):
            st.error("⚠️ Please provide a Gemini API Key in the left sidebar to generate responses.")
    else:
        with st.chat_message("assistant"):
            try:
                from google import genai
                from google.genai import types

                # Initialize Gemini Client
                client = genai.Client(api_key=active_key)

                # Format conversation history
                contents = []
                for msg in st.session_state.messages:
                    contents.append(
                        types.Content(
                            role="user" if msg["role"] == "user" else "model",
                            parts=[types.Part.from_text(text=msg["content"])],
                        )
                    )

                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=temperature,
                )

                # Stream response from Gemini
                response_placeholder = st.empty()
                full_response = ""

                stream = client.models.generate_content_stream(
                    model=selected_model,
                    contents=contents,
                    config=config,
                )

                for chunk in stream:
                    if chunk.text:
                        full_response += chunk.text
                        response_placeholder.markdown(full_response + "▌")

                response_placeholder.markdown(full_response)
                st.session_state.messages.append({"role": "assistant", "content": full_response})

            except Exception as e:
                error_msg = str(e)
                if "API_KEY_INVALID" in error_msg or "403" in error_msg:
                    st.error("❌ Invalid Gemini API key. Please check the key in the sidebar.")
                elif "RESOURCE_EXHAUSTED" in error_msg or "429" in error_msg:
                    st.warning("⏳ Gemini rate limit reached. Please wait a moment before sending another query.")
                else:
                    st.error(f"⚠️ Error contacting Gemini API: {error_msg}")
