const Article = require("../models/Article");

const DEFAULT_BATCH_SIZE = 5;

async function fetchArticlesForBiasAnalysis(batchSize = DEFAULT_BATCH_SIZE) {
  return Article.find({
    summary: { $exists: true, $ne: "" },
    processingStatus: "scraped",
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
        processingStatus: "bias_analyzed",
      },
    },
    { new: true }
  );
}

async function markArticleBiasFailed(articleId, errorMessage) {
  return Article.findByIdAndUpdate(
    articleId,
    {
      $set: {
        processingStatus: "failed",
        "bias.explanation": errorMessage,
      },
    },
    { new: true }
  );
}

module.exports = {
  DEFAULT_BATCH_SIZE,
  fetchArticlesForBiasAnalysis,
  updateArticleBias,
  markArticleBiasFailed,
};
