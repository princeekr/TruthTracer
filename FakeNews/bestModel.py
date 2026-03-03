import pandas as pd
from sklearn.model_selection import train_test_split
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import os
import joblib


# ============================================================
# -------------------- DATA LOADING --------------------------
# ============================================================

fake_df = pd.read_csv("Fake.csv")
true_df = pd.read_csv("True.csv")

fake_df["label"] = 0
true_df["label"] = 1

df = pd.concat([fake_df, true_df], axis=0)

df["content"] = df["title"] + " " + df["text"]
df = df.drop(columns=["subject", "date", "title", "text"])

X = df["content"]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)


# ============================================================
# -------------------- PREPROCESSING -------------------------
# ============================================================

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)

    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    return " ".join(tokens)


print("Preprocessing text...")
X_train = X_train.apply(preprocess_text)
X_test = X_test.apply(preprocess_text)


# ============================================================
# -------------------- VECTORIZATION -------------------------
# ============================================================

print("Vectorizing using TF-IDF...")

vectorizer = TfidfVectorizer(
    max_features=3000,
    ngram_range=(1,1)
)

X_train = vectorizer.fit_transform(X_train)
X_test = vectorizer.transform(X_test)


# ============================================================
# -------------------- MODEL TRAINING ------------------------
# ============================================================

print("Training Linear SVM model...")

model = LinearSVC()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

train_acc = model.score(X_train, y_train)
test_acc = model.score(X_test, y_test)

print("\n========= MODEL PERFORMANCE =========")
print(f"Train Accuracy : {train_acc:.4f}")
print(f"Test Accuracy  : {test_acc:.4f}")

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

print("Confusion Matrix:\n")
print(confusion_matrix(y_test, y_pred))


# ============================================================
# -------------------- SAVE MODEL ----------------------------
# ============================================================

save_dir = "final_model"

if not os.path.exists(save_dir):
    os.makedirs(save_dir)

joblib.dump(model, os.path.join(save_dir, "linear_svm_model.pkl"))
joblib.dump(vectorizer, os.path.join(save_dir, "tfidf_vectorizer.pkl"))

print("\nModel and vectorizer saved successfully in 'final_model/' folder.")