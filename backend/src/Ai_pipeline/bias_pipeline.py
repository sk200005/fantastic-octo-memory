from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

sentiment_model = None
emotion_model = None


class Article(BaseModel):
    text: str


@app.on_event("startup")
def load_models():
    global sentiment_model
    global emotion_model

    sentiment_model = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    emotion_model = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        top_k=1
    )


@app.post("/analyze-bias")
def analyze_bias(article: Article):
    if sentiment_model is None or emotion_model is None:
        raise HTTPException(status_code=503, detail="Models are still loading")

    text = article.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    sentiment_result = sentiment_model(text, truncation=True, max_length=512)[0]
    emotion_result = emotion_model(text, truncation=True, max_length=512)[0][0]

    return {
        "sentiment": sentiment_result["label"].capitalize(),
        "emotionalTone": emotion_result["label"].capitalize()
    }


# uvicorn bias_pipeline:app --reload --port 9000
