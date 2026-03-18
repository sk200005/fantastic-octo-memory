const express = require("express");
const { runBiasAnalysis } = require("../controllers/biasController");

const router = express.Router();

router.post("/run", runBiasAnalysis);

module.exports = router;
