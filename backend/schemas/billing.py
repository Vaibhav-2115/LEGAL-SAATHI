"""
Legal Saathi - Revenue & Billing Schemas (billing.py)
Implements Pydantic schemas per Section 3 of LEGAL_SAATHI_REVENUE_BACKEND_SPEC.md.
Supports micro-transactions, subscriptions, collective action dockets, and GST invoices.
"""

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


class PlanResponse(BaseModel):
    plan_id: str
    name: str
    tier: Literal["civic", "pro", "advocate", "enterprise"]
    amount_inr: int  # In Rupees (e.g. 149 for ₹149)
    billing_period: Literal["one_time", "monthly", "annual"]
    features: List[str]
    is_active: bool


class CreateCheckoutRequest(BaseModel):
    item_type: Literal["subscription", "notice_draft", "rti_draft", "efir_draft", "collective_docket"]
    plan_id: Optional[str] = None
    item_ref_id: Optional[str] = None  # case_id or cluster_id
    customer_name: Optional[str] = "Citizen User"
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    amount_inr: Optional[int] = None  # Optional override (e.g. custom collective pool pledge)


class CheckoutResponse(BaseModel):
    order_id: str                   # Internal Order ID e.g. 'ord_12345'
    gateway_order_id: str           # Razorpay Order ID e.g. 'order_Rzp12345678'
    amount_inr: int                 # Amount in Rupees
    amount_paise: int               # Amount in Paise (e.g. 14900)
    currency: str = "INR"
    key_id: str                     # Razorpay Public Key ID
    item_type: str
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    notes: Optional[Dict[str, Any]] = None


class VerifyPaymentRequest(BaseModel):
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class VerifyPaymentResponse(BaseModel):
    status: Literal["success", "failed"]
    order_id: str
    item_type: str
    unlocked_entitlement: str
    message: str
    invoice_id: Optional[str] = None


class SubscriptionStatusResponse(BaseModel):
    tier: Literal["civic", "pro", "advocate", "enterprise"]
    plan_name: str
    is_active: bool
    current_period_end: Optional[str] = None
    allowed_drafts_remaining: Any = "unlimited"  # int or "unlimited"
    can_export_pdf_dossier: bool = False
    can_access_collective_dockets: bool = False


class InvoiceItemResponse(BaseModel):
    invoice_id: str
    order_id: str
    customer_name: Optional[str] = None
    customer_state: Optional[str] = "Delhi"
    sac_code: str = "998311"
    base_amount_inr: float
    cgst_inr: float
    sgst_inr: float
    igst_inr: float
    total_amount_inr: float
    created_at: str
    invoice_pdf_url: Optional[str] = None


class CollectiveContributionRequest(BaseModel):
    cluster_id: str
    pledge_amount_inr: int = 499
    claimant_name: Optional[str] = "Affected Claimant"
    claimant_email: Optional[str] = None
    claimant_phone: Optional[str] = None


class CollectiveContributionResponse(BaseModel):
    contribution_id: str
    cluster_id: str
    amount_inr: int
    status: str
    checkout_order: Optional[CheckoutResponse] = None
    message: str
