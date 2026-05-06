const { runBiasAnalysisBatch } = require("../services/biasAnalysisService");
const { getProviderStatus, setActiveProvider } = require("../services/llmProviderService");

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

async function getProvider(req, res) {
  res.json(getProviderStatus());
}

async function setProvider(req, res) {
  const { provider } = req.body;
  if (!provider) {
    return res.status(400).json({ error: "Provider is required" });
  }
  const status = setActiveProvider(provider);
  res.json(status);
}

module.exports = { runBiasAnalysis, getProvider, setProvider };
