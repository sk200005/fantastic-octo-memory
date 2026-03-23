const express = require("express");
const { ingestArticles } = require("../services/rssIngestionService");

const router = express.Router();

router.get("/reload-news", async (req, res) => {
  try {
    const result = await ingestArticles();

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
