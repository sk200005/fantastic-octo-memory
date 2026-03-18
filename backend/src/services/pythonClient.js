const axios = require("axios");

async function analyzeLocalBiasSignals(text) {
  try {
    const response = await axios.post(
      "http://localhost:9000/analyze-bias",
      { text }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Local bias analysis failed: ${error.message}`);
  }
}

module.exports = { analyzeLocalBiasSignals };
