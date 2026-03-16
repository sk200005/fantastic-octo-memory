from fastapi import FastAPI
from pydantic import BaseModel
import spacy
from transformers import pipeline
from sentence_transformers import SentenceTransformer

app = FastAPI()

# Load models once
nlp = spacy.load("en_core_web_sm")

sentiment_model = pipeline("sentiment-analysis")

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


class Article(BaseModel):
    text: str


@app.post("/analyze-bias")
def analyze_bias(article: Article):

    text = article.text

    doc = nlp(text)

    entities = []

    # 1️⃣ NER
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PERSON", "GPE"]:
            entities.append(ent.text)

    entity_sentiments = {}

    # 2️⃣ Dependency parsing + sentiment
    for sentence in doc.sents:

        sent = sentence.text

        sentiment = sentiment_model(sent)[0]

        for ent in entities:
            if ent in sent:

                if ent not in entity_sentiments:
                    entity_sentiments[ent] = []

                entity_sentiments[ent].append(sentiment["label"])

    # 3️⃣ Calculate bias score
    bias_scores = {}

    for ent, sentiments in entity_sentiments.items():

        pos = sentiments.count("POSITIVE")
        neg = sentiments.count("NEGATIVE")

        total = len(sentiments)

        score = (pos - neg) / total if total > 0 else 0

        bias_scores[ent] = score

    # 4️⃣ Embeddings (semantic representation)
    embedding = embedding_model.encode(text).tolist()

    return {
        "entities": entities,
        "entity_bias": bias_scores,
        "embedding": embedding[:10]  # trimmed for response
    }



# uvicorn bias_pipeline:app --reload --port 9000