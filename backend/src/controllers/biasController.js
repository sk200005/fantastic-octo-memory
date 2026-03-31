const { runBiasAnalysisBatch } = require("../services/biasAnalysisService");

async function runBiasAnalysis(req, res) {
  try {
    const articleIds = Array.isArray(req.body?.articleIds) ? req.body.articleIds : [];
    const result = await runBiasAnalysisBatch(undefined, articleIds);
    res.json(result);
  } catch (error) {
    console.error("Bias Controller Error:", error);
    res.status(500).json({ success: false, error: "Server error during bias analysis" });
  }
}

module.exports = { runBiasAnalysis };
