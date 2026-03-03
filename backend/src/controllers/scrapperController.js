const scrapeArticles = require("../services/scraperService");

const scrapeController = async (req, res) => {
  const result = await scrapeArticles();
  res.status(result.success ? 200 : 500).json(result);
};

module.exports = scrapeController;