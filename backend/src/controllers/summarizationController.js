const Article = require("../models/Article");
const { summarizeArticle } = require("../services/summarizationService");

const BATCH_SIZE = 3;

async function summarizePendingArticles(req, res) {
  try {
    const articleIds = Array.isArray(req.body?.articleIds) ? req.body.articleIds : [];
    const query = {
      rawContent: { $exists: true, $ne: "" },
      summary: "",
      processingStatus: "scraped",
    };

    if (articleIds.length > 0) {
      query._id = { $in: articleIds };
    }

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .limit(BATCH_SIZE);

    if (articles.length === 0) {
      return res.json({
        success: true,
        message: "No articles need summarization.",
        summarized: 0,
      });
    }

    let summarized = 0;
    const summarizedArticleIds = [];

    for (const article of articles) {
      try {
        const summary = await summarizeArticle(article.rawContent);

        if (!summary) {
          continue;
        }

        article.summary = summary;
        article.processingStatus = "analyzed";
        await article.save();
        summarized++;
        summarizedArticleIds.push(String(article._id));
      } catch (error) {
        console.error("Summarization failed for article:", article._id, error.message);
      }
    }

    return res.json({
      success: true,
      message: "Summarization completed.",
      summarized,
      attempted: articles.length,
      batchSize: BATCH_SIZE,
      articleIds: summarizedArticleIds,
    });
  } catch (error) {
    console.error("Summarization controller error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error during summarization.",
    });
  }
}

module.exports = { summarizePendingArticles };
