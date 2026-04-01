const { splitIntoSentences } = require("./sentenceUtils");

function generateBulletSummary(summary) {
  return splitIntoSentences(summary)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40)
    .slice(0, 3);
}

module.exports = {
  generateBulletSummary,
};
