const Article = require("../models/Article");

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ publishedAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getScrapedArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      processingStatus: "scraped"
    }).sort({ publishedAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllArticles,
  getScrapedArticles
};