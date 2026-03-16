const axios = require("axios");

async function analyzeBias(text) {

  try {

    const response = await axios.post(
      "http://localhost:9000/analyze-bias",
      { text }
    );

    return response.data;

  } catch (error) {

    console.error("Bias analysis error:", error.message);
    return null;
  }
}

module.exports = { analyzeBias };