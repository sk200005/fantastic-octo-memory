from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

try:
    from transformers import pipeline
except ModuleNotFoundError:
    pipeline = None

app = FastAPI()

sentiment_model = None
emotion_model = None


class Article(BaseModel):
    text: str


@app.on_event("startup")
def load_models():
    global sentiment_model
    global emotion_model

    if pipeline is None:
        return

    sentiment_model = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    emotion_model = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        top_k=1
    )


def analyze_with_fallback(text: str):
    normalized = text.lower()

    positive_words = ("gain", "growth", "improve", "success", "benefit", "win")
    negative_words = ("loss", "decline", "crisis", "fail", "violence", "concern")
    anger_words = ("angry", "rage", "furious", "outrage", "attack")
    fear_words = ("fear", "threat", "risk", "panic", "danger")
    joy_words = ("happy", "joy", "celebrate", "relief", "hope")
    sadness_words = ("sad", "grief", "mourning", "loss", "tragic")

    positive_score = sum(word in normalized for word in positive_words)
    negative_score = sum(word in normalized for word in negative_words)

    emotion_scores = {
        "Anger": sum(word in normalized for word in anger_words),
        "Fear": sum(word in normalized for word in fear_words),
        "Joy": sum(word in normalized for word in joy_words),
        "Sadness": sum(word in normalized for word in sadness_words),
    }

    sentiment = "Neutral"
    if positive_score > negative_score:
        sentiment = "Positive"
    elif negative_score > positive_score:
        sentiment = "Negative"

    emotional_tone = max(emotion_scores, key=emotion_scores.get)
    if emotion_scores[emotional_tone] == 0:
        emotional_tone = "Neutral"

    return {
        "sentiment": sentiment,
        "emotionalTone": emotional_tone,
        "fallback": True,
    }


@app.post("/analyze-bias")
def analyze_bias(article: Article):
    text = article.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    if sentiment_model is None or emotion_model is None:
        return analyze_with_fallback(text)

    sentiment_result = sentiment_model(text, truncation=True, max_length=512)[0]
    emotion_result = emotion_model(text, truncation=True, max_length=512)[0][0]

    return {
        "sentiment": sentiment_result["label"].capitalize(),
        "emotionalTone": emotion_result["label"].capitalize()
    }


# uvicorn bias_pipeline:app --reload --port 9000
