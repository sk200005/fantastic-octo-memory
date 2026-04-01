const express = require("express");
const {
  getCategoryBiasAnalytics,
  getBiasSummaryAnalytics,
} = require("../controllers/articleController");

const router = express.Router();

router.get("/category-bias", getCategoryBiasAnalytics);
router.get("/bias-summary", getBiasSummaryAnalytics);

module.exports = router;
