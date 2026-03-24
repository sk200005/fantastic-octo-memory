const express = require("express");
const { getCategoryBiasAnalytics } = require("../controllers/articleController");

const router = express.Router();

router.get("/category-bias", getCategoryBiasAnalytics);

module.exports = router;
