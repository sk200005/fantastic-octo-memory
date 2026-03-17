const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "also", "am",
  "an", "and", "any", "are", "as", "at", "be", "because", "been", "before",
  "being", "below", "between", "both", "but", "by", "can", "could", "did",
  "do", "does", "doing", "down", "during", "each", "few", "for", "from",
  "further", "had", "has", "have", "having", "he", "her", "here", "hers",
  "herself", "him", "himself", "his", "how", "i", "if", "in", "into", "is",
  "it", "its", "itself", "just", "me", "more", "most", "my", "myself", "no",
  "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other",
  "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should",
  "so", "some", "such", "than", "that", "the", "their", "theirs", "them",
  "themselves", "then", "there", "these", "they", "this", "those", "through",
  "to", "too", "under", "until", "up", "very", "was", "we", "were", "what",
  "when", "where", "which", "while", "who", "whom", "why", "will", "with",
  "you", "your", "yours", "yourself", "yourselves"
]);

function splitIntoSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40) || [];
}

function tokenize(text) {
  return text
    .toLowerCase()
    .match(/[a-z0-9']+/g)
    ?.filter((word) => word.length > 2 && !STOP_WORDS.has(word)) || [];
}

function buildWordFrequencies(sentences) {
  const frequencies = new Map();

  for (const sentence of sentences) {
    for (const word of tokenize(sentence)) {
      frequencies.set(word, (frequencies.get(word) || 0) + 1);
    }
  }

  return frequencies;
}

function scoreSentence(sentence, index, sentenceCount, frequencies) {
  const words = tokenize(sentence);

  if (words.length === 0) {
    return 0;
  }

  const keywordScore = words.reduce(
    (total, word) => total + (frequencies.get(word) || 0),
    0
  ) / words.length;

  const uniqueWordBoost = new Set(words).size / words.length;
  const positionBoost = index === 0 ? 1.35 : index < 3 ? 1.15 : 1;
  const lengthPenalty = words.length > 45 ? 0.9 : words.length < 8 ? 0.75 : 1;
  const endingBoost = index === sentenceCount - 1 ? 1.05 : 1;

  return keywordScore * uniqueWordBoost * positionBoost * lengthPenalty * endingBoost;
}

function selectSummarySentences(sentences, maxSentences = 3) {
  const frequencies = buildWordFrequencies(sentences);
  const ranked = sentences.map((sentence, index) => ({
    sentence,
    index,
    score: scoreSentence(sentence, index, sentences.length, frequencies),
  }));

  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
}

async function summarizeArticle(rawContent) {
  if (!rawContent || !rawContent.trim()) {
    return "";
  }

  const cleanedText = rawContent.trim().slice(0, 4000);
  const sentences = splitIntoSentences(cleanedText);

  if (sentences.length === 0) {
    return cleanedText.slice(0, 240);
  }

  if (sentences.length <= 3) {
    return sentences.join(" ");
  }

  const summarySentences = selectSummarySentences(sentences, 3);
  let summary = summarySentences.join(" ").trim();

  if (summary.length < 120) {
    summary = sentences.slice(0, Math.min(3, sentences.length)).join(" ").trim();
  }

  return summary.slice(0, 500).trim();
}

module.exports = { summarizeArticle };
