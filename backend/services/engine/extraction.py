"""
Legal Saathi Engine - Entity Extraction (extraction.py)
Extracts structured entities: opposing party, location, amounts, dates, and grievance.
Matches Section 8.2 of the Technical Blueprint.
"""

import re
from typing import List, Optional, Tuple
from backend.schemas.case import CaseEntities


class EntityExtractor:
    # Regex patterns for amounts in INR (e.g. Rs 50,000, ₹ 2.5 Lakhs, 15000)
    AMOUNT_PATTERN = re.compile(
        r'(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)\s*(lakhs?|crores?|k)?|([\d,]+)\s*(?:rupees|rs)',
        re.IGNORECASE
    )

    # Patterns for locations in India (major cities, states, districts)
    LOCATION_PATTERNS = [
        r'\b(delhi|new delhi|noida|gurugram|gurgaon|faridabad|ghaziabad|mumbai|pune|bengaluru|bangalore|hyderabad|chennai|kolkata|ahmedabad|jaipur|lucknow|kanpur|nagpur|indore|bhopal|patna|chandigarh|kochi|thiruvananthapuram)\b',
        r'\bin\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b'
    ]

    # Patterns for dates (e.g. 15th August 2023, Jan 2024, last month, 3 months ago)
    DATE_PATTERNS = [
        re.compile(r'\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b'),
        re.compile(r'\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})\b', re.IGNORECASE),
        re.compile(r'\b(?:last\s+(?:month|week|year)|\d+\s+months?\s+ago)\b', re.IGNORECASE)
    ]

    # Patterns for opposing parties (e.g. builder ABC, landlord Sharma, Amazon, Samsung)
    OPPOSING_PARTY_PATTERNS = [
        re.compile(r'(?:landlord|owner|builder|developer|company|merchant|seller|dealer)\s+(?:named\s+|is\s+|called\s+)?([A-Z][A-Za-z0-9\s&]+?)(?:\s+(?:did|has|refused|is|was|took)|,|\.|$)', re.IGNORECASE),
        re.compile(r'(?:against|from)\s+([A-Z][A-Za-z0-9\s&]{2,30}?)(?:\s+(?:in|for|since|who|did)|,|\.|$)', re.IGNORECASE)
    ]

    def extract(self, text: str) -> CaseEntities:
        """Extracts structured legal entities from raw user narrative."""
        # 1. Extract Amount
        amount = None
        amount_match = self.AMOUNT_PATTERN.search(text)
        if amount_match:
            raw_val = amount_match.group(1) or amount_match.group(3)
            multiplier = (amount_match.group(2) or "").lower()
            if raw_val:
                try:
                    cleaned_num = float(raw_val.replace(",", ""))
                    if "lakh" in multiplier:
                        amount = cleaned_num * 100000
                    elif "crore" in multiplier:
                        amount = cleaned_num * 10000000
                    elif "k" in multiplier:
                        amount = cleaned_num * 1000
                    else:
                        amount = cleaned_num
                except ValueError:
                    amount = None

        # 2. Extract Location
        location = None
        for pattern in self.LOCATION_PATTERNS:
            loc_match = re.search(pattern, text, re.IGNORECASE)
            if loc_match:
                location = loc_match.group(1).title()
                break

        # 3. Extract Dates
        dates: List[str] = []
        for pattern in self.DATE_PATTERNS:
            for match in pattern.finditer(text):
                dates.append(match.group(0))

        # 4. Extract Opposing Party
        opposing_party = None
        for pattern in self.OPPOSING_PARTY_PATTERNS:
            party_match = pattern.search(text)
            if party_match:
                candidate = party_match.group(1).strip()
                if len(candidate) > 2 and candidate.lower() not in {"the", "a", "an", "my", "this", "that"}:
                    opposing_party = candidate
                    break

        return CaseEntities(
            opposing_party=opposing_party,
            location=location,
            amount=amount,
            dates=dates,
            key_facts=[text[:160] + ("..." if len(text) > 160 else "")],
            grievance=text
        )


extractor = EntityExtractor()
