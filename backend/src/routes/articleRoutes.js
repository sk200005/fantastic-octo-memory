const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getScrapedArticles
} = require("../controllers/articleController");

router.get("/", getAllArticles);
router.get("/scraped", getScrapedArticles);

module.exports = router;