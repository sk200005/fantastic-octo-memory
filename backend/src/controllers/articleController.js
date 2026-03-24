const Article = require("../models/Article");

const getAllArticles = async (req, res) => {
  try {
    const category =
      req.query.category && req.query.category !== "all"
        ? req.query.category
        : undefined;

    const query = category ? { category } : {};

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getScrapedArticles = async (req, res) => {
  try {
    const category =
      req.query.category && req.query.category !== "all"
        ? req.query.category
        : undefined;

    const query = {
      processingStatus: { $in: ["scraped", "analyzed", "bias_analyzed"] },
    };

    if (category) {
      query.category = category;
    }

    const articles = await Article.find(query).sort({ publishedAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNewsArticles = async (req, res) => {
  try {
    const category =
      req.query.category && req.query.category !== "all"
        ? req.query.category
        : undefined;

    const query = {
      processingStatus: { $in: ["bias_analyzed", "analyzed"] },
    };

    if (category) {
      query.category = category;
    }

    const articles = await Article.find(query).sort({ publishedAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryBiasAnalytics = async (req, res) => {
  try {
    const analytics = await Article.aggregate([
      {
        $match: {
          processingStatus: "bias_analyzed",
        },
      },
      {
        $addFields: {
          analyticsBiasScore: {
            $cond: [
              { $ne: ["$bias.biasScore", null] },
              "$bias.biasScore",
              "$biasScore",
            ],
          },
        },
      },
      {
        $match: {
          analyticsBiasScore: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          avgBias: { $avg: "$analyticsBiasScore" },
          totalArticles: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          avgBias: { $round: ["$avgBias", 3] },
          totalArticles: 1,
        },
      },
      {
        $sort: {
          totalArticles: -1,
          category: 1,
        },
      },
    ]);

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecommendedArticles = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const recommendations = await Article.find({
      category: article.category,
      sentiment: article.sentiment,
      _id: { $ne: article._id },
    })
      .sort({ publishedAt: -1 })
      .limit(5);

    if (recommendations.length > 0) {
      return res.status(200).json(recommendations);
    }

    const fallbackRecommendations = await Article.find({
      category: article.category,
      _id: { $ne: article._id },
    })
      .sort({ publishedAt: -1 })
      .limit(5);

    return res.status(200).json(fallbackRecommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllArticles,
  getScrapedArticles,
  getNewsArticles,
  getCategoryBiasAnalytics,
  getRecommendedArticles,
};
