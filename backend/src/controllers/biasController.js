const { runBiasAnalysisBatch } = require("../services/biasAnalysisService");

async function runBiasAnalysis(req, res) {
  try {
    const result = await runBiasAnalysisBatch();
    res.json(result);
  } catch (error) {
    console.error("Bias Controller Error:", error);
    res.status(500).json({ success: false, error: "Server error during bias analysis" });
  }
}

module.exports = { runBiasAnalysis };
