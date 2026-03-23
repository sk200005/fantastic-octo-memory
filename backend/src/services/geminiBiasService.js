const { GoogleGenAI } = require("@google/genai");

let ai;

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
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

function buildBatchPrompt(articles) {
  const formattedArticles = articles
    .map(
      (article, index) => `${index + 1}.
Title: ${article.title || ""}
Summary: ${article.summary || ""}`
    )
    .join("\n\n");

  return `Analyze the political bias of each news article.

Return JSON array with:
- politicalLean (Left / Right / Center / Neutral)
- biasScore (0-1)

Articles:

${formattedArticles}

Return output as JSON:
[
 { "politicalLean": "...", "biasScore": ... },
 { "politicalLean": "...", "biasScore": ... }
]`;
}

async function analyzePoliticalBiasWithGemini(biasText) {
  try {
    const client = getGeminiClient();
    const prompt = `Analyze the political bias of the following news article.

Return JSON:
{
"politicalLean": "Left | Right | Neutral",
"biasScore": number between 0 and 1
}

Article:
${biasText}`;

    const response = await client.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    return parseGeminiJson(response.text);
  } catch (error) {
    throw new Error(`Gemini bias analysis failed: ${error.message}`);
  }
}

async function analyzePoliticalBiasBatch(articles) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return [];
  }

  try {
    const client = getGeminiClient();
    const prompt = buildBatchPrompt(articles);

    const response = await client.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    const parsed = parseGeminiJson(response.text);

    if (!Array.isArray(parsed)) {
      throw new Error("Gemini response was not a JSON array");
    }

    if (parsed.length !== articles.length) {
      throw new Error(
        `Gemini response count mismatch: expected ${articles.length}, received ${parsed.length}`
      );
    }

    return parsed.map((result, index) => ({
      politicalLean: result?.politicalLean || "Neutral",
      biasScore:
        typeof result?.biasScore === "number"
          ? result.biasScore
          : Number(result?.biasScore) || 0,
      articleIndex: index,
    }));
  } catch (error) {
    throw new Error(`Gemini batch bias analysis failed: ${error.message}`);
  }
}

module.exports = {
  analyzePoliticalBiasWithGemini,
  analyzePoliticalBiasBatch,
};
