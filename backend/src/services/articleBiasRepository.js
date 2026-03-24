const Article = require("../models/Article");

const DEFAULT_BATCH_SIZE = 5;

async function fetchArticlesForBiasAnalysis(batchSize = DEFAULT_BATCH_SIZE) {
  return Article.find({
    summary: { $exists: true, $ne: "" },
    processingStatus: { $in: ["scraped", "analyzed"] },
  })
    .sort({ publishedAt: -1 })
    .limit(batchSize);
}

async function updateArticleBias(articleId, bias) {
  return Article.findByIdAndUpdate(
    articleId,
    {
      $set: {
        bias,
        biasScore: bias.biasScore ?? 0,
        sentiment: bias.sentiment || "neutral",
        processingStatus: "bias_analyzed",
      },
    },
    { returnDocument: "after" }
  );
}

async function markArticleBiasFailed(articleId, errorMessage) {
  return Article.findByIdAndUpdate(
    articleId,
    {
      $set: {
        processingStatus: "analyzed",
        sentiment: "neutral",
        "bias.explanation": errorMessage,
      },
    },
    { returnDocument: "after" }
  );
}

module.exports = {
  DEFAULT_BATCH_SIZE,
  fetchArticlesForBiasAnalysis,
  updateArticleBias,
  markArticleBiasFailed,
};
