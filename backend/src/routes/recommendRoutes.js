const express = require("express");
const { getRecommendedArticles } = require("../controllers/articleController");

const router = express.Router();

router.get("/:articleId", getRecommendedArticles);

module.exports = router;
