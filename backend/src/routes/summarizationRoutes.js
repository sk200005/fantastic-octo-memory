const express = require("express");
const { summarizePendingArticles } = require("../controllers/summarizationController");

const router = express.Router();

router.post("/", summarizePendingArticles);

module.exports = router;
