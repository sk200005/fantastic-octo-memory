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
