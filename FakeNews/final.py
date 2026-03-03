import streamlit as st
import requests
from bs4 import BeautifulSoup
import re
import joblib
import numpy as np
import os


# ============================================================
# -------------------- LOAD MODEL ----------------------------
# ============================================================

MODEL_PATH = "final_model/linear_svm_model.pkl"
VECTORIZER_PATH = "final_model/tfidf_vectorizer.pkl"
ACCURACY_PATH = "final_model/accuracy.pkl"
CONF_MATRIX_PATH = "final_model/conf_matrix.pkl"

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Optional (if saved during training)
if os.path.exists(ACCURACY_PATH):
    model_accuracy = joblib.load(ACCURACY_PATH)
else:
    model_accuracy = None

if os.path.exists(CONF_MATRIX_PATH):
    conf_matrix = joblib.load(CONF_MATRIX_PATH)
else:
    conf_matrix = None


# ============================================================
# -------------------- SCRAPING FUNCTION ---------------------
# ============================================================

def scrape_article(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    response = requests.get(url, headers=headers, timeout=10)

    if response.status_code != 200:
        return None

    soup = BeautifulSoup(response.text, "lxml")

    # Remove script and style tags
    for script in soup(["script", "style", "nav", "footer", "header", "aside"]):
        script.decompose()

    paragraphs = soup.find_all("p")

    article_text = ""
    for p in paragraphs:
        text = p.get_text()
        if len(text.split()) > 5:  # filter small junk lines
            article_text += text + " "

    return article_text.strip()


# ============================================================
# -------------------- PREPROCESSING -------------------------
# ============================================================

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text


# ============================================================
# -------------------- HIGHLIGHT WORDS -----------------------
# ============================================================

def highlight_keywords(text):
    feature_names = vectorizer.get_feature_names_out()
    coefficients = model.coef_[0]

    top_fake_words = [
        word for coef, word in sorted(zip(coefficients, feature_names))[:15]
    ]

    highlighted_text = text
    for word in top_fake_words:
        highlighted_text = re.sub(
            rf"\b{word}\b",
            f"<span style='background-color: #ffcccc'>{word}</span>",
            highlighted_text,
            flags=re.IGNORECASE
        )

    return highlighted_text


# ============================================================
# -------------------- STREAMLIT UI --------------------------
# ============================================================

st.set_page_config(page_title="AI Fake News Detector", layout="wide")

st.title("📰 AI Browser-Based Fake News Checker")

url = st.text_input("Enter News Article URL")

if st.button("Analyze Article"):

    if not url:
        st.warning("Please enter a valid URL.")
    else:
        with st.spinner("Scraping article..."):

            article = scrape_article(url)

        if not article:
            st.error("Failed to extract article content.")
        else:
            cleaned = preprocess_text(article)
            vectorized = vectorizer.transform([cleaned])

            prediction = model.predict(vectorized)[0]

            # Probability (if calibrated)
            if hasattr(model, "predict_proba"):
                prob = model.predict_proba(vectorized)[0]
                confidence = np.max(prob)
            else:
                confidence = None

            label = "REAL NEWS ✅" if prediction == 1 else "FAKE NEWS ❌"

            st.subheader("Prediction Result")
            st.success(label)

            if confidence:
                st.progress(float(confidence))
                st.write(f"Confidence Score: {confidence:.2%}")

            st.subheader("Highlighted Suspicious Words")
            highlighted = highlight_keywords(article)
            st.markdown(highlighted, unsafe_allow_html=True)

            if model_accuracy:
                st.subheader("Model Accuracy")
                st.write(f"Accuracy on Test Set: {model_accuracy:.2%}")

            if conf_matrix is not None:
                st.subheader("Confusion Matrix")
                st.write(conf_matrix)