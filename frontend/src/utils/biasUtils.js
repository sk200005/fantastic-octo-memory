export const getLeanColor = (lean) => {
  switch (lean) {
    case "Left":
      return "bg-blue-100 text-blue-700";
    case "Right":
      return "bg-red-100 text-red-700";
    case "Center":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case "Positive":
      return "bg-green-100 text-green-700";
    case "Negative":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export const getBiasLevel = (score) => {
  if (!score) return "Low";
  if (score < 0.3) return "Low";
  if (score < 0.6) return "Moderate";
  return "High";
};

const clampBiasScore = (score) => {
  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, numericScore));
};

const normalizeDistribution = (distribution) => {
  const entries = Object.entries(distribution);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (total <= 0) {
    return { left: 33, center: 34, right: 33 };
  }

  const normalizedEntries = entries.map(([key, value]) => ({
    key,
    raw: (value / total) * 100,
  }));

  const rounded = normalizedEntries.map((entry) => ({
    key: entry.key,
    value: Math.floor(entry.raw),
    remainder: entry.raw - Math.floor(entry.raw),
  }));

  let remaining = 100 - rounded.reduce((sum, entry) => sum + entry.value, 0);

  rounded
    .sort((firstEntry, secondEntry) => secondEntry.remainder - firstEntry.remainder)
    .forEach((entry) => {
      if (remaining > 0) {
        entry.value += 1;
        remaining -= 1;
      }
    });

  return rounded.reduce((result, entry) => {
    result[entry.key] = entry.value;
    return result;
  }, {});
};

export const calculateBiasDistribution = (bias = {}) => {
  const politicalLean = bias.politicalLean || "Neutral";
  const biasScore = clampBiasScore(bias.biasScore);

  if (politicalLean === "Left") {
    return normalizeDistribution({
      left: 50 + (0.5 - biasScore) * 100,
      center: 30,
      right: 20,
    });
  }

  if (politicalLean === "Right") {
    return normalizeDistribution({
      left: 20,
      center: 30,
      right: 50 + (biasScore - 0.5) * 100,
    });
  }

  return normalizeDistribution({
    left: (1 - biasScore) * 20,
    center: 60,
    right: biasScore * 20,
  });
};
