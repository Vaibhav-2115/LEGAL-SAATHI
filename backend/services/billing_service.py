"""
Legal Saathi - Payment Gateway & Billing Service (billing_service.py)
Implements Razorpay payment integration, HMAC-SHA256 signature verification,
GST invoice generation (SAC 998311), and automated subscription provisioning.
Per Section 1 & Section 4 of LEGAL_SAATHI_REVENUE_BACKEND_SPEC.md.
"""

from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import uuid
from typing import Any, Dict, Optional, Tuple

from backend.core.config import settings
from backend.core.logging import logger
from backend.data.db import db
from backend.schemas.billing import (
    CheckoutResponse,
    CreateCheckoutRequest,
    VerifyPaymentRequest,
    VerifyPaymentResponse
)


class BillingService:
    def __init__(self):
        self.key_id = settings.RAZORPAY_KEY_ID
        self.key_secret = settings.RAZORPAY_KEY_SECRET
        self.webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
        self.razorpay_client = None

        if self.key_id and not self.key_id.startswith("rzp_test_mock"):
            try:
                import razorpay
                self.razorpay_client = razorpay.Client(auth=(self.key_id, self.key_secret))
                logger.info("Initialized Razorpay client with merchant credentials.")
            except Exception as e:
                logger.warning(f"Could not initialize official Razorpay client: {e}. Falling back to standard mode.")

    def calculate_item_price_paise(self, item_type: str, plan_id: Optional[str] = None, custom_inr: Optional[int] = None) -> Tuple[int, str]:
        """
        Determines exact pricing in paise (1 INR = 100 Paise).
        Returns: (amount_paise, item_title)
        """
        if item_type == "subscription":
            target_plan_id = plan_id or "plan_pro_monthly"
            plan = db.get_plan(target_plan_id)
            if not plan:
                raise ValueError(f"Unknown subscription plan '{target_plan_id}'")
            return plan["amount_inr"], plan["name"]
        
        elif item_type == "notice_draft":
            return 19900, "Statutory Legal Notice (15-Day Demand Draft)"
        
        elif item_type == "rti_draft":
            return 19900, "Section 6(1) Right to Information (RTI) Application"
        
        elif item_type == "efir_draft":
            return 19900, "Formal Cyber Incident / e-FIR Filing Packet"
        
        elif item_type == "collective_docket":
            amount = (custom_inr * 100) if custom_inr else 49900
            return amount, "Collective Action Docket Escrow Contribution"
        
        else:
            raise ValueError(f"Unsupported billing item_type: {item_type}")

    def create_checkout_order(self, req: CreateCheckoutRequest, user_id: str) -> CheckoutResponse:
        """
        Creates an internal payment_orders record and initializes order in Razorpay.
        """
        amount_paise, item_title = self.calculate_item_price_paise(
            req.item_type,
            req.plan_id,
            req.amount_inr
        )
        amount_rupees = amount_paise // 100
        internal_order_id = f"ord_{uuid.uuid4().hex[:12]}"
        gateway_order_id = f"order_{uuid.uuid4().hex[:14]}"

        # Attempt to create real Razorpay Order if client is configured
        if self.razorpay_client:
            try:
                rzp_order = self.razorpay_client.order.create({
                    "amount": amount_paise,
                    "currency": "INR",
                    "receipt": internal_order_id,
                    "notes": {
                        "user_id": user_id,
                        "item_type": req.item_type,
                        "item_ref_id": req.item_ref_id or "",
                        "plan_id": req.plan_id or ""
                    }
                })
                gateway_order_id = rzp_order.get("id", gateway_order_id)
            except Exception as e:
                logger.warning(f"Razorpay order creation returned: {e}. Using resilient local order ID.")

        # Persist internal order
        metadata = {
            "item_title": item_title,
            "plan_id": req.plan_id,
            "customer_name": req.customer_name,
            "customer_email": req.customer_email,
            "customer_phone": req.customer_phone
        }
        db.create_payment_order(
            order_id=internal_order_id,
            user_id=user_id,
            gateway_order_id=gateway_order_id,
            item_type=req.item_type,
            amount_inr=amount_paise,
            item_ref_id=req.item_ref_id,
            metadata=metadata
        )

        return CheckoutResponse(
            order_id=internal_order_id,
            gateway_order_id=gateway_order_id,
            amount_inr=amount_rupees,
            amount_paise=amount_paise,
            currency="INR",
            key_id=self.key_id,
            item_type=req.item_type,
            customer_name=req.customer_name,
            customer_phone=req.customer_phone,
            notes=metadata
        )

    def verify_payment_signature(self, req: VerifyPaymentRequest, user_id: str) -> VerifyPaymentResponse:
        """
        Cryptographically verifies payment HMAC-SHA256 signature, unlocks entitlements,
        and generates GST-compliant tax invoice.
        """
        order = db.get_payment_order(req.order_id)
        if not order:
            # Fallback check by gateway_order_id
            order = db.get_payment_order_by_gateway_id(req.razorpay_order_id)
            if not order:
                raise ValueError("Payment order not found")

        # Signature verification algorithm
        payload = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
        expected_sig = hmac.new(
            self.key_secret.encode("utf-8"),
            payload.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        is_valid = (
            hmac.compare_digest(expected_sig, req.razorpay_signature)
            or (settings.ENABLE_MOCK_PAYMENTS and req.razorpay_signature in ("mock_signature", "test_signature", expected_sig))
        )

        if not is_valid:
            logger.warning(f"Invalid payment signature for order {req.order_id}")
            raise ValueError("Invalid Payment Signature")

        # 1. Update order as paid
        db.update_payment_order_status(
            order_id=order["order_id"],
            status="paid",
            signature=req.razorpay_signature
        )

        # 2. Provision Entitlements
        item_type = order["item_type"]
        meta = order.get("metadata") or {}
        now_dt = datetime.now(timezone.utc)

        if item_type == "subscription":
            plan_id = meta.get("plan_id") or "plan_pro_monthly"
            is_annual = "annual" in plan_id
            days = 365 if is_annual else 30
            end_dt = now_dt + timedelta(days=days)
            sub_id = f"sub_{uuid.uuid4().hex[:10]}"

            db.create_or_update_subscription(
                subscription_id=sub_id,
                user_id=user_id,
                plan_id=plan_id,
                status="active",
                current_period_start=now_dt.isoformat(),
                current_period_end=end_dt.isoformat(),
                gateway_subscription_id=req.razorpay_payment_id
            )
            unlocked = f"Subscription {plan_id} activated until {end_dt.strftime('%d-%b-%Y')}"

        elif item_type == "collective_docket":
            cluster_id = order.get("item_ref_id") or "cluster_general"
            contrib_id = f"contrib_{uuid.uuid4().hex[:10]}"
            db.add_collective_contribution(
                contribution_id=contrib_id,
                cluster_id=cluster_id,
                user_id=user_id,
                order_id=order["order_id"],
                amount_inr=order["amount_inr"],
                status="funded"
            )
            unlocked = f"Collective Action Docket pledge confirmed for cluster {cluster_id}"

        else:
            unlocked = f"Single draft unlock active for {item_type}"

        # 3. Generate Automated GST Tax Invoice (SAC 998311)
        invoice = self._generate_gst_invoice(order, meta, user_id)

        return VerifyPaymentResponse(
            status="success",
            order_id=order["order_id"],
            item_type=item_type,
            unlocked_entitlement=unlocked,
            message="Payment verified successfully. Entitlements unlocked.",
            invoice_id=invoice["invoice_id"]
        )

    def _generate_gst_invoice(self, order: Dict[str, Any], meta: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Calculates 18% GST breakdown (SAC Code 998311) and persists invoice."""
        total_paise = order["amount_inr"]
        customer_name = meta.get("customer_name") or "Citizen Client"
        customer_state = meta.get("customer_state") or "Delhi"

        # 18% GST calculation (Base = Total / 1.18)
        base_paise = int(round(total_paise / 1.18))
        gst_paise = total_paise - base_paise

        # If Delhi (Intra-state): CGST 9% + SGST 9%, otherwise IGST 18%
        if customer_state.lower() in ("delhi", "nct of delhi", "dl"):
            cgst = gst_paise // 2
            sgst = gst_paise - cgst
            igst = 0
        else:
            cgst = 0
            sgst = 0
            igst = gst_paise

        invoice_id = f"INV-2026-{uuid.uuid4().hex[:6].upper()}"

        return db.create_invoice(
            invoice_id=invoice_id,
            order_id=order["order_id"],
            user_id=user_id,
            customer_name=customer_name,
            customer_state=customer_state,
            base_amount_inr=base_paise,
            cgst_inr=cgst,
            sgst_inr=sgst,
            igst_inr=igst,
            total_amount_inr=total_paise,
            invoice_pdf_url=f"/api/v1/billing/invoices/{invoice_id}/download"
        )


billing_service = BillingService()
