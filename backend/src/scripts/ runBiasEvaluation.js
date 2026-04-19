require("dotenv").config();
const mongoose = require("mongoose");
const { runBiasAnalysisBatch } = require("../src/services/biasAnalysisService");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/insight-ai");
  console.log("MongoDB Connected");

  const result = await runBiasAnalysisBatch();

  if (!result.success) {
    console.error("Bias analysis failed:", result.error);
  } else {
    console.log("Evaluation:", result.evaluation);
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Script error:", error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
