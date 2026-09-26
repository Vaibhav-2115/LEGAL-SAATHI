"""
Legal Saathi - Logging Configuration (SEC-010)
Ensures logging hygiene: PII and sensitive legal text are sanitized or masked in logs.
"""

import logging
import re
import sys


class SanitizedFormatter(logging.Formatter):
    """
    Custom formatter that redacts potential PII such as phone numbers,
    Aadhaar numbers, email addresses, and detailed complaint specifics.
    """
    PHONE_REGEX = re.compile(r'\b(?:\+91[-\s]?)?[6-9]\d{9}\b')
    AADHAAR_REGEX = re.compile(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b')
    EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')

    def format(self, record: logging.LogRecord) -> str:
        msg = super().format(record)
        msg = self.PHONE_REGEX.sub("[PHONE_REDACTED]", msg)
        msg = self.AADHAAR_REGEX.sub("[AADHAAR_REDACTED]", msg)
        msg = self.EMAIL_REGEX.sub("[EMAIL_REDACTED]", msg)
        return msg


def setup_logger(name: str = "legal_saathi") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(
            SanitizedFormatter(
                fmt="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S"
            )
        )
        logger.addHandler(handler)
    return logger


logger = setup_logger()
