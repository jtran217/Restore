"""
Reusable LLM service for intervention grounding/refocus and future features.
Uses Hugging Face transformers with lazy-loaded model; falls back to static
responses on parse failure or errors.
"""
import os
import re
from typing import Any

SENTINEL_FILENAME = ".flow_llm_ready"


def _sentinel_path() -> str:
    """Path to file that marks model as already downloaded (first boot done)."""
    base = os.environ.get("FLOW_USER_DATA")
    if not base or not os.path.isdir(base):
        base = os.getcwd()
    return os.path.join(base, SENTINEL_FILENAME)


def is_ready() -> bool:
    """True if the model has been downloaded and is ready (first boot already done)."""
    return os.path.isfile(_sentinel_path())


def ensure_ready() -> None:
    """Download and load the model if needed; write sentinel so we skip next time."""
    if is_ready():
        return
    _get_model()
    path = _sentinel_path()
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(path, "w") as f:
        f.write("1")

# Emotion keys must match frontend EmotionKey in interventionAI.ts
VALID_EMOTIONS = frozenset(
    {"anxious", "distracted", "overwhelmed", "frustrated", "exhausted", "other"}
)


def _fallback_grounding(emotion: str) -> dict[str, Any]:
    """Static fallback for grounding phase; matches frontend GROUNDING_MAP."""
    fallbacks: dict[str, dict[str, Any]] = {
        "anxious": {
            "message": "Anxiety often lives in the body before the mind catches up. Let's bring you back to the present.",
            "suggestions": [
                "Press your feet flat on the floor and notice the pressure.",
                "Name 5 things you can see from where you're sitting.",
                "Place one hand on your chest — feel it rise and fall for 3 breaths.",
                "Take a slow sip of water and focus only on the sensation.",
            ],
        },
        "distracted": {
            "message": "Your attention is scattered — that's normal. Let's collect it gently.",
            "suggestions": [
                "Close all non-essential tabs and windows.",
                "Write the single most important thing you need to do on a sticky note.",
                "Set your phone face-down out of reach for the next 25 minutes.",
                "Take 3 slow breaths while looking at one fixed point.",
            ],
        },
        "overwhelmed": {
            "message": "Too much at once — let's shrink the world down to just this moment.",
            "suggestions": [
                "Write out everything on your mind in bullet points, then close the list.",
                "Pick just ONE thing from that list. Everything else waits.",
                "Stand up, roll your shoulders back, and take two deep breaths.",
                "Remind yourself: you only have to do the next small step.",
            ],
        },
        "frustrated": {
            "message": "Frustration is energy — let's redirect it instead of suppressing it.",
            "suggestions": [
                "Step away from the screen for 2 minutes — even just to stretch.",
                "Write down what's frustrating you in one sentence. Externalizing helps.",
                "Splash cold water on your face or wrists.",
                "Remind yourself of the last time you solved a hard problem.",
            ],
        },
        "exhausted": {
            "message": "Your tank is low. Let's do the minimum to restore a little fuel.",
            "suggestions": [
                "Rest your eyes — close them for 60 seconds.",
                "Drink a full glass of water right now.",
                "Do 10 gentle neck rolls, 5 each direction.",
                "Consider whether a 10-minute break would make the next hour better.",
            ],
        },
        "other": {
            "message": "Whatever you're feeling, it's valid. Let's find a moment of stillness.",
            "suggestions": [
                "Sit quietly for 60 seconds without doing anything.",
                "Take 3 deep, slow breaths.",
                "Notice one thing that's going well today, however small.",
                "Put a name to what you're feeling — even just to yourself.",
            ],
        },
    }
    return fallbacks.get(emotion, fallbacks["other"])


def _fallback_refocus(emotion: str) -> dict[str, Any]:
    """Static fallback for refocus phase; matches frontend REFOCUS_MAP."""
    fallbacks: dict[str, dict[str, Any]] = {
        "anxious": {
            "message": "You've taken a breath. Now let's ease back in — no rushing.",
            "tips": [
                "Start with the smallest, most concrete task on your list.",
                "Keep your workspace visible — one window, one task.",
                "Give yourself permission to work for just 10 minutes, then reassess.",
            ],
        },
        "distracted": {
            "message": "Fresh start. One task, one window, one you.",
            "tips": [
                'Write your focus intention at the top of a blank doc: "Right now I am working on ___."',
                "Use a timer — even 15 minutes of protected focus is a win.",
                'If a new thought appears, park it in a "later" list and keep going.',
            ],
        },
        "overwhelmed": {
            "message": "You don't have to do everything. You just have to do the next thing.",
            "tips": [
                "Open only the file or tool you need for the single task you chose.",
                "Set a 20-minute timer — you're only committing to that.",
                "If you get stuck, note where you are and move to an easier sub-task.",
            ],
        },
        "frustrated": {
            "message": "Channel it. Frustration often means you care — use that.",
            "tips": [
                "Restate the problem in plain words before diving back in.",
                "Try a different approach than the one that frustrated you.",
                "Celebrate the next small progress, no matter how minor.",
            ],
        },
        "exhausted": {
            "message": "Gentle re-entry. Low stakes, low pressure.",
            "tips": [
                "Choose the easiest item on your list to rebuild momentum.",
                "Work for 15 minutes then check in with yourself honestly.",
                "Consider whether this work could wait until after a proper break.",
            ],
        },
        "other": {
            "message": "You showed up. That counts. Let's take it one step at a time.",
            "tips": [
                "Pick one task and commit to it for the next 20 minutes.",
                "Keep your environment calm — minimize noise and visual clutter.",
                "Be kind to yourself if the first few minutes feel slow.",
            ],
        },
    }
    return fallbacks.get(emotion, fallbacks["other"])


_model = None
_tokenizer = None


def _get_model():
    """Lazy-load model and tokenizer (distilgpt-2) on first use."""
    global _model, _tokenizer
    if _model is None:
        from transformers import AutoModelForCausalLM, AutoTokenizer

        _tokenizer = AutoTokenizer.from_pretrained("distilgpt2")
        _model = AutoModelForCausalLM.from_pretrained("distilgpt2")
        _model.eval()
    return _model, _tokenizer


def _generate(prompt: str, max_new_tokens: int = 120) -> str:
    """Run model and return decoded text (no prompt included in output)."""
    import torch

    model, tokenizer = _get_model()
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=256)
    with torch.no_grad():
        out = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=0.8,
            pad_token_id=tokenizer.eos_token_id,
        )
    # Decode only the new tokens
    full = tokenizer.decode(out[0], skip_special_tokens=True)
    if full.startswith(prompt):
        return full[len(prompt) :].lstrip()
    return full


def _parse_message_and_bullets(text: str, list_key: str) -> dict[str, Any] | None:
    """
    Parse model output into message (first line) and list of bullet items.
    list_key is 'suggestions' or 'tips'. Returns None if parsing fails.
    """
    if not text or not text.strip():
        return None
    lines = [ln.strip() for ln in text.strip().split("\n") if ln.strip()]
    if not lines:
        return None
    message = lines[0]
    # Strip leading bullet chars for readability
    bullet_re = re.compile(r"^[\-\*•]\s*")
    items = []
    for ln in lines[1:]:
        item = bullet_re.sub("", ln).strip()
        if item and len(item) < 500:
            items.append(item)
    if len(items) < 1:
        return None
    return {"message": message[: 500], list_key: items[: 6]}


def get_grounding_suggestions(emotion: str, free_text: str | None) -> dict[str, Any]:
    """
    Return grounding phase response: { "message": str, "suggestions": list[str] }.
    Uses LLM when available; falls back to static content on error or parse failure.
    """
    if emotion not in VALID_EMOTIONS:
        emotion = "other"
    prompt = (
        "The user feels "
        + emotion
        + "."
    )
    if free_text and free_text.strip():
        prompt += " They said: " + free_text.strip()[: 200] + "."
    prompt += (
        "\n\nReply with one short empathetic sentence, then on new lines 3 bullet points "
        "starting with - for grounding activities to try right now. Be calm and supportive.\n\n"
    )
    try:
        raw = _generate(prompt, max_new_tokens=100)
        parsed = _parse_message_and_bullets(raw, "suggestions")
        if parsed:
            return parsed
    except Exception:
        pass
    return _fallback_grounding(emotion)


def get_refocus_suggestions(emotion: str, free_text: str | None) -> dict[str, Any]:
    """
    Return refocus phase response: { "message": str, "tips": list[str] }.
    Uses LLM when available; falls back to static content on error or parse failure.
    """
    if emotion not in VALID_EMOTIONS:
        emotion = "other"
    prompt = (
        "The user feels "
        + emotion
        + " and is ready to return to work."
    )
    if free_text and free_text.strip():
        prompt += " They said: " + free_text.strip()[: 200] + "."
    prompt += (
        "\n\nReply with one short motivating sentence, then on new lines 3 bullet points "
        "starting with - for actionable tips to ease back into focus.\n\n"
    )
    try:
        raw = _generate(prompt, max_new_tokens=100)
        parsed = _parse_message_and_bullets(raw, "tips")
        if parsed:
            return parsed
    except Exception:
        pass
    return _fallback_refocus(emotion)
