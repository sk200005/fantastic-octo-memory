const express = require("express");
const router = express.Router();
const { runBiasAnalysis } = require("../controllers/biasController");

router.post("/run", runBiasAnalysis);

module.exports = router;
