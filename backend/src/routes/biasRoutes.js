const express = require("express");
const { runBiasAnalysis, getProvider, setProvider } = require("../controllers/biasController");

const router = express.Router();

router.post("/run", runBiasAnalysis);
router.get("/provider", getProvider);
router.put("/provider", setProvider);

module.exports = router;
