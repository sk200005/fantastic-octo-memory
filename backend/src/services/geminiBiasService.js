const { GoogleGenAI } = require("@google/genai");

let ai;

const GEMINI_MODEL = "models/gemini-2.5-flash";
const GEMINI_TEMPERATURE = 0.1;
const GEMINI_DELAY_MS = 2000;
const MAX_CONTEXT_LENGTH = 1800;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return ai;
}

function parseGeminiJson(text) {
  const cleaned = String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleaned);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clampScore(score) {
  return Math.max(0, Math.min(1, score));
}

function normalizeArticleContext(article) {
  return String(article?.biasText || article?.content || article?.summary || "")
    .trim()
    .slice(0, MAX_CONTEXT_LENGTH);
}

function buildBatchPrompt(articles) {
  const formattedArticles = articles
    .map(
      (article) => `{
  "id": "${String(article._id || article.id || "")}",
  "context": ${JSON.stringify(normalizeArticleContext(article))}
}`
    )
    .join(",\n");

  return `You are a media bias detection system.
Analyze the article context and identify political bias signals.

Look specifically for:

* loaded or emotionally charged words
* imbalance in viewpoints
* framing language
* emotional tone used to influence opinion.

Return JSON only.

Required JSON schema:
[
  {
    "id": "article_id",
    "politicalLean": "left | center | right",
    "biasScore": 0.0,
    "loadedWords": ["list", "of", "words"],
    "emotionalLanguage": ["phrases"],
    "opposingViewsPresent": true
  }
]

Important:
biasScore must reflect overall bias intensity.

Articles:
[
${formattedArticles}
]`;
}

function isRateLimitError(error) {
  return (
    error?.status === 429 ||
    error?.code === 429 ||
    error?.response?.status === 429 ||
    String(error?.message || "").includes("429")
  );
}

async function executeGeminiPrompt(prompt) {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      temperature: GEMINI_TEMPERATURE,
      responseMimeType: "application/json",
    },
  });

  console.log("Gemini response received");
  await sleep(GEMINI_DELAY_MS);

  return response.text;
}

async function callGeminiWithRetry(prompt, retries = 3) {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await executeGeminiPrompt(prompt);
    } catch (error) {
      if (!isRateLimitError(error) || attempt === retries) {
        throw error;
      }

      const delay = GEMINI_DELAY_MS * 2 ** attempt;
      console.log("Retrying Gemini call due to rate limit");
      await sleep(delay);
      attempt += 1;
    }
  }

  throw new Error("Gemini call failed after retries");
}

async function analyzePoliticalBiasWithGemini(biasText) {
  try {
    const prompt = `You are a media bias detection system.
Analyze the article context and identify political bias signals.

Look specifically for:

* loaded or emotionally charged words
* imbalance in viewpoints
* framing language
* emotional tone used to influence opinion.

Return JSON only.

{
  "id": "article_id",
  "politicalLean": "left | center | right",
  "biasScore": 0.0,
  "loadedWords": ["list", "of", "words"],
  "emotionalLanguage": ["phrases"],
  "opposingViewsPresent": true
}

Article:
${String(biasText || "").slice(0, MAX_CONTEXT_LENGTH)}`;

    const responseText = await callGeminiWithRetry(prompt);
    return parseGeminiJson(responseText);
  } catch (error) {
    throw new Error(`Gemini bias analysis failed: ${error.message}`);
  }
}

async function analyzePoliticalBiasBatch(articles) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return [];
  }

  try {
    const prompt = buildBatchPrompt(articles);
    const responseText = await callGeminiWithRetry(prompt);
    const parsed = parseGeminiJson(responseText);

    if (!Array.isArray(parsed)) {
      throw new Error("Gemini response was not a JSON array");
    }

    if (parsed.length !== articles.length) {
      throw new Error(
        `Gemini response count mismatch: expected ${articles.length}, received ${parsed.length}`
      );
    }

    return parsed.map((result, index) => ({
      id: String(result?.id || articles[index]?._id || articles[index]?.id || ""),
      politicalLean: String(result?.politicalLean || "center").toLowerCase(),
      biasScore: clampScore(
        typeof result?.biasScore === "number"
          ? result.biasScore
          : Number(result?.biasScore) || 0
      ),
      loadedWords: Array.isArray(result?.loadedWords) ? result.loadedWords : [],
      emotionalLanguage: Array.isArray(result?.emotionalLanguage)
        ? result.emotionalLanguage
        : [],
      opposingViewsPresent: Boolean(result?.opposingViewsPresent),
      articleIndex: index,
    }));
  } catch (error) {
    throw new Error(`Gemini batch bias analysis failed: ${error.message}`);
  }
}

module.exports = {
  analyzePoliticalBiasWithGemini,
  analyzePoliticalBiasBatch,
  buildBatchPrompt,
  callGeminiWithRetry,
};
