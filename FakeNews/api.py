"""
TruthTracer — FastAPI Backend
Run: uvicorn api:app --reload --port 8000
"""

import os
import re
import numpy as np
import joblib
import requests
from bs4 import BeautifulSoup

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ──────────────────────────────────────────────────────────────
# Startup — Load model + vectorizer once
# ──────────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "final_model", "linear_svm_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "final_model", "tfidf_vectorizer.pkl")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Fixed metrics from training (hard-coded since they don't change after training)
# Confusion matrix layout: [[TN, FP], [FN, TP]] → [[4661, 35], [29, 4255]]
MODEL_ACCURACY = 0.9929
CONFUSION_MATRIX = {"tn": 4661, "fp": 35, "fn": 29, "tp": 4255}

# ──────────────────────────────────────────────────────────────
# FastAPI App
# ──────────────────────────────────────────────────────────────

app = FastAPI(title="TruthTracer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────
# Request / Response schemas
# ──────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    url: str

class ConfusionMatrixOut(BaseModel):
    tp: int
    fp: int
    fn: int
    tn: int

class AnalyzeResponse(BaseModel):
    verdict: str               # "REAL" or "FAKE"
    confidence: float          # 0.0 – 1.0
    highlightedText: str       # Raw article text (frontend highlights via suspiciousWords)
    suspiciousWords: list[str] # Top fake-indicator words found in the article
    accuracy: float            # Model accuracy on test set
    confusionMatrix: ConfusionMatrixOut

# ──────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────

def scrape_article(url: str) -> str:
    """Download and extract paragraph text from a news URL."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        )
    }
    try:
        response = requests.get(url, headers=headers, timeout=12)
    except requests.exceptions.RequestException as exc:
        raise HTTPException(status_code=422, detail=f"Failed to fetch URL: {exc}")

    if response.status_code != 200:
        raise HTTPException(
            status_code=422,
            detail=f"URL returned HTTP {response.status_code}. Try another article URL."
        )

    soup = BeautifulSoup(response.text, "lxml")

    # Remove non-content tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    paragraphs = soup.find_all("p")
    article_text = " ".join(
        p.get_text(separator=" ").strip()
        for p in paragraphs
        if len(p.get_text().split()) > 5
    )

    if not article_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract article content from this URL. Try another one."
        )

    return article_text.strip()


def preprocess_text(text: str) -> str:
    """Lowercase → remove digits → remove punctuation (matches training pipeline)."""
    text = text.lower()
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text


def get_suspicious_words(article_text: str) -> list[str]:
    """Return top-15 fake-indicator words that actually appear in the article."""
    feature_names = vectorizer.get_feature_names_out()
    coefficients = model.coef_[0]  # lower coef → more "fake"

    # Words with the most negative SVM coefficients = strongest fake indicators
    top_fake_words = [
        word for _, word in sorted(zip(coefficients, feature_names))[:15]
    ]

    article_lower = article_text.lower()
    # Only return words that are present in the article
    found = [w for w in top_fake_words if re.search(rf"\b{re.escape(w)}\b", article_lower)]
    return found


def svm_confidence(decision_score: float) -> float:
    """Convert raw SVM decision_function output to a [0, 1] confidence value."""
    # Sigmoid-like mapping: score far from 0 → high confidence
    return float(1 / (1 + np.exp(-abs(decision_score))))


# ──────────────────────────────────────────────────────────────
# Endpoint
# ──────────────────────────────────────────────────────────────

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    # 1. Scrape
    article_text = scrape_article(request.url)

    # 2. Preprocess
    cleaned = preprocess_text(article_text)

    # 3. Vectorize
    vectorized = vectorizer.transform([cleaned])

    # 4. Predict   (1 = REAL, 0 = FAKE — per training in final.py)
    prediction = model.predict(vectorized)[0]
    verdict = "REAL" if prediction == 1 else "FAKE"

    # 5. Confidence via decision_function distance
    decision_score = model.decision_function(vectorized)[0]
    confidence = svm_confidence(decision_score)

    # 6. Suspicious words
    suspicious_words = get_suspicious_words(article_text)

    return AnalyzeResponse(
        verdict=verdict,
        confidence=round(confidence, 4),
        highlightedText=article_text,
        suspiciousWords=suspicious_words,
        accuracy=MODEL_ACCURACY,
        confusionMatrix=ConfusionMatrixOut(**CONFUSION_MATRIX),
    )


@app.get("/health")
def health():
    return {"status": "ok", "model": "LinearSVC", "vectorizer": "TF-IDF"}
