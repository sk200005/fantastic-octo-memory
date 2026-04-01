function removeDateMetadata(text) {
  if (!text) {
    return "";
  }

  return text
    .replace(/Updated\s*-\s*\w+\s+\d{1,2},\s+\d{4}.*?\n?/gi, "")
    .replace(/\b\d{1,2}:\d{2}\s*(am|pm)\s*IST\b/gi, "")
    .replace(/\b[A-Za-z]+\s+\d{1,2},\s+\d{4}\b/g, "")
    .replace(/e-?Paper/gi, "")
    .trim();
}

function removeBoilerplate(text) {
  if (!text) {
    return "";
  }

  const patterns = [
    /subscribe.*telegram/gi,
    /weekly top picks/gi,
    /stock reports plus/gi,
    /share market alerts/gi,
    /etmarkets/gi,
    /what's moving sensex and nifty/gi,
    /follow us on/gi,
    /click here/gi,
  ];

  patterns.forEach((pattern) => {
    text = text.replace(pattern, "");
  });

  return text;
}

function normalizeWhitespace(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function cleanArticleText(text) {
  let cleaned = text;

  cleaned = removeDateMetadata(cleaned);
  cleaned = removeBoilerplate(cleaned);
  cleaned = normalizeWhitespace(cleaned);

  return cleaned;
}

module.exports = {
  cleanArticleText,
};
