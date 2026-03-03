const fetchRSS = require("../services/rssService");

const fetchRSSController = async (req, res) => {
  const result = await fetchRSS();
  res.status(result.success ? 200 : 500).json(result);
};

module.exports = fetchRSSController;