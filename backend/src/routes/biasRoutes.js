const express = require("express");
const router = express.Router();

const runBiasAnalysis = require("../services/biasRunner");

router.post("/run", async (req, res) => {

  const result = await runBiasAnalysis();

  res.json(result);

});

module.exports = router;