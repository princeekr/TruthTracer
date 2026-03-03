# TruthTracer AI

AI-Powered Fake News Detection System built using Natural Language Processing, Linear SVM, and a modern full-stack architecture.

TruthTracer AI analyzes news articles directly from URLs, extracts content, processes it through a trained NLP model, and provides a real-time authenticity verdict with transparent metrics.

---

## Overview

TruthTracer AI is a full-stack AI application designed to detect fake news articles using:

- TF-IDF Vectorization (3000 features)
- Linear Support Vector Machine (SVM)
- FastAPI backend
- React + Vite + Tailwind frontend
- Real-time scraping using requests + BeautifulSoup

The system performs:

1. URL scraping
2. Text preprocessing
3. Feature extraction
4. Model inference
5. Dashboard visualization

---

## Application Preview

### Landing Page

![Landing Page](public/trutht-home.png)

---

### Analysis Dashboard

![Dashboard](./trutht-result.png)

---

### System Architecture

![Architecture](./trutht-dataflow.png)

---

## Architecture Overview

The system follows a layered architecture:

User  
→ Frontend UI (React + Tailwind)  
→ FastAPI Backend  
→ Scraping Module  
→ NLP Processing Pipeline  
→ TF-IDF Vectorizer  
→ Linear SVM Model  
→ JSON Response  
→ Dashboard Rendering  

### Core Components

**Frontend Layer**
- URL input field
- Analysis trigger
- Verdict visualization
- Confidence bar
- Confusion matrix display
- Model accuracy panel

**Backend Layer**
- FastAPI REST API
- CORS enabled
- Article scraping
- Text preprocessing
- Model inference

**NLP Layer**
- Lowercasing
- Number removal
- Punctuation removal
- Tokenization
- Stopword removal
- Lemmatization
- TF-IDF transformation
- Linear SVM classification

---

## Model Performance

| Metric | Value |
|--------|--------|
| Model | Linear SVM |
| Feature Size | 3000 |
| Test Accuracy | 99.29% |
| F1 Score | 0.9929 |

Confusion Matrix:

|              | Predicted Real | Predicted Fake |
|--------------|---------------|----------------|
| Actual Real  | 4661          | 29             |
| Actual Fake  | 35            | 4255           |

The model demonstrates high precision and strong generalization with minimal overfitting.

---

## Author 

**Name**: [Prince]

