"""
Legal Saathi — LLM Fine-Tuning Pipeline (train_lora_model.py)
Supervised Fine-Tuning (SFT) with QLoRA / PEFT for Indian Legal AI.
Trains or fine-tunes Llama-3, Gemma-2, or Mistral on Legal Saathi's custom dataset.

Usage:
  python scripts/train_lora_model.py --model unsloth/llama-3-8b-Instruct --epochs 3
  (Can be run locally with CUDA or uploaded directly to Google Colab / Kaggle / RunPod)
"""

import argparse
import os
from pathlib import Path
import sys

# Configure UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT_DIR / "data" / "training" / "legal_saathi_sft_train.jsonl"
OUTPUT_DIR = ROOT_DIR / "models" / "legal_saathi_lora_adapter"


def train(
    base_model_name: str = "google/gemma-2-2b-it",
    epochs: int = 3,
    batch_size: int = 4,
    learning_rate: float = 2e-4,
    max_seq_length: int = 2048,
):
    print("=" * 65)
    print(">> Legal Saathi: Training Custom Legal AI Model (QLoRA / SFT)")
    print(f">> Base Model: {base_model_name}")
    print(f">> Training Data: {DATA_PATH}")
    print(f">> Target Output: {OUTPUT_DIR}")
    print("=" * 65)

    if not DATA_PATH.exists():
        print(f"[ERROR] Training dataset not found at {DATA_PATH}.")
        print("Please run first: python scripts/build_training_dataset.py")
        return

    try:
        import torch
        from datasets import load_dataset
        from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
        from transformers import (
            AutoModelForCausalLM,
            AutoTokenizer,
            BitsAndBytesConfig,
            TrainingArguments,
        )
        from trl import SFTTrainer
    except ImportError as e:
        print("\n[DEPENDENCY NOTICE] Deep learning training libraries not fully installed.")
        print(f"Missing dependency: {e}")
        print("\nTo train locally or on Google Colab / RunPod GPU, install:")
        print("  pip install torch transformers peft trl bitsandbytes datasets accelerate")
        print("\nTip: For fast free training on Google Colab (T4 GPU), you can also run:")
        print("  pip install unsloth")
        return

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"\n[DEVICE] Training on: {device.upper()}")
    if device == "cpu":
        print("[WARNING] No GPU detected. Local CPU training will be slow.")
        print("[RECOMMENDATION] Use Google Colab (Free T4 GPU) or cloud GPU instance.\n")

    # 1. 4-bit Quantization Config (QLoRA)
    bnb_config = None
    if device == "cuda":
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16,
            bnb_4bit_use_double_quant=True,
        )

    # 2. Load Tokenizer & Model
    print(f"[LOADING] Loading tokenizer & weights for {base_model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(base_model_name, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        quantization_config=bnb_config if device == "cuda" else None,
        device_map="auto" if device == "cuda" else None,
        trust_remote_code=True,
    )

    if device == "cuda":
        model = prepare_model_for_kbit_training(model)

    # 3. LoRA Configuration
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # 4. Load Dataset
    print(f"[DATASET] Loading JSONL from {DATA_PATH}...")
    dataset = load_dataset("json", data_files=str(DATA_PATH), split="train")

    def format_chat_prompt(batch):
        formatted_texts = []
        for msgs in batch["messages"]:
            text = tokenizer.apply_chat_template(msgs, tokenize=False, add_generation_prompt=False)
            formatted_texts.append(text)
        return {"text": formatted_texts}

    dataset = dataset.map(format_chat_prompt, batched=True)

    # 5. Training Arguments
    training_args = TrainingArguments(
        output_dir=str(OUTPUT_DIR),
        per_device_train_batch_size=batch_size,
        gradient_accumulation_steps=4,
        warmup_ratio=0.05,
        num_train_epochs=epochs,
        learning_rate=learning_rate,
        fp16=not torch.cuda.is_bf16_supported() if device == "cuda" else False,
        bf16=torch.cuda.is_bf16_supported() if device == "cuda" else False,
        logging_steps=10,
        save_strategy="epoch",
        optim="paged_adamw_8bit" if device == "cuda" else "adamw_torch",
        report_to="none",
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=max_seq_length,
        tokenizer=tokenizer,
        args=training_args,
    )

    # 6. Execute Training Loop
    print("\n[TRAINING] Starting SFT LoRA Training Loop...")
    trainer.train()

    # 7. Save Adapter
    print(f"\n[SAVING] Saving fine-tuned LoRA adapter to {OUTPUT_DIR}...")
    model.save_pretrained(str(OUTPUT_DIR))
    tokenizer.save_pretrained(str(OUTPUT_DIR))
    print("[SUCCESS] Legal Saathi AI Model Training Complete!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Legal Saathi Model Fine-Tuning")
    parser.add_argument("--model", type=str, default="google/gemma-2-2b-it", help="Base model Hugging Face ID")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=2, help="Per-device batch size")
    parser.add_argument("--lr", type=float, default=2e-4, help="Learning rate")
    args = parser.parse_args()

    train(
        base_model_name=args.model,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.lr,
    )
