require("dotenv").config();

const mongoose = require("mongoose");
const Article = require("../src/models/Article");
const { removeNoise } = require("../utils/articleCleaner");
const { buildSummaryInput } = require("../utils/sentenceUtils");
const { generateBulletSummary } = require("../utils/summaryFormatter");
const {
  cleanSummary,
  summarizeArticle,
} = require("../src/services/summarizationService");

const TARGET_SOURCES = new Set([
  "The Hindu",
  "The Hindu Business",
  "Economic Times",
]);

function buildCandidateMongoUris() {
  const candidates = new Set();
  const envUri = process.env.MONGO_URI;

  if (envUri) {
    candidates.add(envUri);

    if (envUri.includes("insightAI")) {
      candidates.add(envUri.replace("insightAI", "insight-ai"));
    }

    if (envUri.includes("localhost")) {
      candidates.add(envUri.replace("localhost", "127.0.0.1"));
    }
  }

  candidates.add("mongodb://127.0.0.1:27017/insight-ai");
  candidates.add("mongodb://127.0.0.1:27017/insightAI");
  candidates.add("mongodb://localhost:27017/insight-ai");
  candidates.add("mongodb://localhost:27017/insightAI");

  return Array.from(candidates);
}

async function resolveMongoUri() {
  const candidateUris = buildCandidateMongoUris();
  let fallbackUri = null;

  for (const uri of candidateUris) {
    try {
      const connection = await mongoose.createConnection(uri, {
        serverSelectionTimeoutMS: 3000,
      }).asPromise();
      const articleCount = await connection.db.collection("articles").countDocuments();

      console.log(`Checked DB: ${connection.db.databaseName} (${articleCount} articles)`);

      await connection.close();

      if (articleCount > 0) {
        return uri;
      }

      if (!fallbackUri) {
        fallbackUri = uri;
      }
    } catch (error) {
      console.warn(`Skipping Mongo URI ${uri}: ${error.message}`);
    }
  }

  if (fallbackUri) {
    return fallbackUri;
  }

  throw new Error("Unable to connect to any configured MongoDB database.");
}

function needsNormalization(summary) {
  if (!summary) {
    return true;
  }

  const badPatterns = [
    /First Day First Show/i,
    /Updated\s*-/i,
    /e-?Paper/i,
    /subscribe/i,
    /telegram/i,
    /Get our breaking news email/i,
    /weekly top picks/i,
    /what's moving sensex/i,
  ];

  return badPatterns.some((pattern) => pattern.test(summary));
}

function shouldNormalizeArticle(article) {
  const summary = String(article.summary || "").trim();
  const summaryText = String(article.summaryText || "").trim();
  const summaryPoints = Array.isArray(article.summaryPoints)
    ? article.summaryPoints.filter(Boolean)
    : [];
  const rawContent = String(article.rawContent || article.content || "").trim();
  const cleanedRawContent = removeNoise(rawContent);
  const cleanedExistingSummary = cleanSummary(summary || summaryText);

  if (!rawContent || !cleanedRawContent) {
    return false;
  }

  if (!summary || !summaryText || summaryPoints.length === 0) {
    return true;
  }

  if (needsNormalization(summary) || needsNormalization(summaryText)) {
    return true;
  }

  if (summary !== cleanedExistingSummary || summaryText !== cleanedExistingSummary) {
    return true;
  }

  if (TARGET_SOURCES.has(article.source)) {
    return true;
  }

  return false;
}

async function normalizeArticle(article) {
  const cleanedText = removeNoise(article.rawContent || article.content || "");
  const preparedText = buildSummaryInput(cleanedText, 1800);
  const { summaryText } = await summarizeArticle(preparedText);

  article.summary = summaryText.slice(0, 400);
  article.summaryText = article.summary;
  article.summaryPoints = generateBulletSummary(article.summary);

  return article;
}

async function runNormalization() {
  const BATCH_SIZE = 20;
  let lastId = null;
  let normalizedCount = 0;
  let scannedCount = 0;

  while (true) {
    const query = lastId ? { _id: { $gt: lastId } } : {};
    const articles = await Article.find(query)
      .sort({ _id: 1 })
      .limit(BATCH_SIZE);

    if (!articles.length) {
      break;
    }

    for (const article of articles) {
      scannedCount += 1;

      if (!shouldNormalizeArticle(article)) {
        continue;
      }

      const updatedArticle = await normalizeArticle(article);
      await updatedArticle.save();
      normalizedCount += 1;

      console.log("Normalized:", article.title);
    }

    lastId = articles[articles.length - 1]._id;
  }

  console.log("Normalization complete.");
  console.log("Total scanned articles:", scannedCount);
  console.log("Total normalized articles:", normalizedCount);
}

async function main() {
  const mongoUri = await resolveMongoUri();

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB for article normalization:", mongoUri);

  try {
    await runNormalization();
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(async (error) => {
  console.error("Article normalization failed:", error);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});
