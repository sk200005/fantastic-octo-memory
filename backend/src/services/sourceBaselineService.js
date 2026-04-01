const SOURCE_BASELINE = {
  Reuters: "center",
  BBC: "center",
  "Fox News": "right",
  Jacobin: "left",
};

function getSourceLean(sourceName) {
  const normalizedSource = String(sourceName || "").trim();

  if (!normalizedSource) {
    return "unknown";
  }

  return SOURCE_BASELINE[normalizedSource] || "unknown";
}

module.exports = {
  SOURCE_BASELINE,
  getSourceLean,
};
