const express = require("express");
const router = express.Router();
const fetchRSSController = require("../controllers/rssController");

router.get("/fetch", fetchRSSController);

module.exports = router;