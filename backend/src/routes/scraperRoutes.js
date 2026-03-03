const express = require("express");
const router = express.Router();
const scrapeController = require("../controllers/scrapperController");

router.get("/run", scrapeController);

module.exports = router;