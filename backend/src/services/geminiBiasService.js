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

module.exports = { analyzePoliticalBiasWithGemini };
