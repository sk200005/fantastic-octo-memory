const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeBias(content) {
  const prompt = `
Analyze the following news article and return STRICT JSON only in this format:

{
  "politicalLean": "Left | Right | Center | Neutral",
  "sentiment": "Positive | Negative | Neutral",
  "emotionalTone": "Fear | Anger | Hope | Neutral",
  "biasScore": number between 0 and 1,
  "explanation": "short explanation"
}

Article:
${content.substring(0, 8000)}
`;

  const response = await ai.models.generateContent({
    model: "models/gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

module.exports = { analyzeBias };


