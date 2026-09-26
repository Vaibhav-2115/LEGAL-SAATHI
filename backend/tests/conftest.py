"""
conftest.py — Test environment setup for Legal Saathi backend tests.

Loads .env from project root before any test collection/import.
This ensures DATABASE_URL and all backend settings are available
for both unit and integration tests.
"""
import os

def pytest_configure(config):
    """Load .env before test collection so db.py singleton can initialize."""
    env_file = os.path.normpath(
        os.path.join(os.path.dirname(__file__), '..', '..', '.env')
    )
    if os.path.exists(env_file):
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line and not line.startswith('`'):
                    k, v = line.split('=', 1)
                    os.environ.setdefault(k.strip(), v.strip())
    # Fallback: prevent RuntimeError during collection if .env not found
    if not os.environ.get('DATABASE_URL'):
        os.environ.setdefault(
            'DATABASE_URL',
            'postgresql://postgres.thqoqnxhqluivesfsntl:PLACEHOLDER'
            '@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres'
        )
