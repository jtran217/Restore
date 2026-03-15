"""
Site classifier using Hugging Face Transformers (zero-shot).
Classifies website context (domain + title) as productive or distracting.
Model is lazy-loaded on first use; first run downloads from Hugging Face.
"""
from urllib.parse import urlparse

# Lazy-loaded pipeline
_pipeline = None

# Small, CPU-friendly zero-shot model (~250MB on first download)
ZERO_SHOT_MODEL = "typeform/distilbert-base-uncased-mnli"
LABELS = ["productive", "distracting"]


def _get_pipeline():
    global _pipeline
    if _pipeline is None:
        from transformers import pipeline
        _pipeline = pipeline(
            "zero-shot-classification",
            model=ZERO_SHOT_MODEL,
            device=-1,  # CPU
        )
    return _pipeline


def _extract_domain(url: str) -> str:
    """Extract hostname from URL, strip www."""
    try:
        parsed = urlparse(url if url.startswith("http") else f"https://{url}")
        host = (parsed.netloc or parsed.path or "").strip()
        if host.startswith("www."):
            host = host[4:]
        return host or "unknown"
    except Exception:
        return "unknown"


def classify(url: str, title: str) -> tuple[str, bool]:
    """
    Classify a visited site as productive or distracting.
    Returns (domain, is_distracting).
    """
    domain = _extract_domain(url)
    text = f"{domain} — {title}" if title else domain
    text = (text or "unknown")[:512]  # cap length for model

    try:
        pipe = _get_pipeline()
        out = pipe(text, LABELS, multi_label=False)
        # out["labels"] is ordered by score descending
        is_distracting = out["labels"][0] == "distracting"
        return domain, is_distracting
    except Exception:
        # If model fails, treat as neutral (not distracting) so we don't over-notify
        return domain, False


def ensure_loaded() -> bool:
    """Load the model (triggering download if needed). Returns True when ready."""
    try:
        _get_pipeline()
        return True
    except Exception:
        return False
