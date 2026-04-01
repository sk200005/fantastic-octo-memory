function splitIntoSentences(text) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();

  if (!normalized) {
    return [];
  }

  const segmenter = new Intl.Segmenter("en", {
    granularity: "sentence",
  });

  return Array.from(segmenter.segment(normalized), (segment) => segment.segment.trim())
    .filter(Boolean);
}

function buildSummaryInput(text, limit = 1800) {
  const sentences = splitIntoSentences(text);
  let result = "";

  for (const sentence of sentences) {
    const nextChunk = result ? `${result} ${sentence}` : sentence;

    if (nextChunk.length > limit) {
      break;
    }

    result = nextChunk;
  }

  if (result) {
    return result.trim();
  }

  return String(text || "").slice(0, limit).trim();
}

module.exports = {
  buildSummaryInput,
  splitIntoSentences,
};
