const sourceBias = {
  "The Hindu": "Center",
  "ThePrint": "Right",
  "OpIndia": "Right",
  "Scroll": "Left",
  "The Hindu Business": "Center",
  "Economic Times": "Center",
  "The Hindu Sport": "Center",
  "NDTV Sports": "Center",
  "ESPN Cricinfo": "Center",
  "BBC World": "Center",
  "Guardian World": "Left",
  "BBC Business": "Center",
  "BBC Sport": "Center",
  "Reuters Sports": "Center",
};

function normalizeBiasLabel(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  if (["left", "center-left"].includes(normalized)) {
    return "Left";
  }

  if (["right", "center-right"].includes(normalized)) {
    return "Right";
  }

  if (["center", "neutral"].includes(normalized)) {
    return "Center";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getGroundTruthBias(sourceName) {
  return sourceBias[String(sourceName || "").trim()] || null;
}

function getPredictedBias(article) {
  return normalizeBiasLabel(article?.politicalLean || article?.bias?.politicalLean);
}

function createEmptyMetrics() {
  return {
    articlesTested: 0,
    correctPredictions: 0,
    accuracy: 0,
  };
}

function evaluateBiasAccuracy(articles = []) {
  const metrics = createEmptyMetrics();

  articles.forEach((article) => {
    const trueBias = getGroundTruthBias(article?.source);
    const predictedBias = getPredictedBias(article);

    if (!trueBias || !predictedBias) {
      return;
    }

    metrics.articlesTested += 1;

    if (predictedBias === trueBias) {
      metrics.correctPredictions += 1;
    }
  });

  metrics.accuracy = metrics.articlesTested > 0
    ? metrics.correctPredictions / metrics.articlesTested
    : 0;

  return metrics;
}

module.exports = {
  sourceBias,
  normalizeBiasLabel,
  getGroundTruthBias,
  evaluateBiasAccuracy,
};
