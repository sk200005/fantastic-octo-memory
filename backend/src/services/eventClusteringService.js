const crypto = require("crypto");
const Article = require("../models/Article");

const MAX_COMPARISON_ARTICLES = 200;
const CLUSTER_MATCH_THRESHOLD = 0.45;
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "was",
  "will",
  "with",
]);

function normalizeTitle(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(article) {
  const combinedText = [
    article?.title,
    article?.summary,
    article?.bias?.topic,
    article?.category,
  ]
    .filter(Boolean)
    .join(" ");

  return Array.from(
    new Set(
      normalizeTitle(combinedText)
        .split(" ")
        .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
        .slice(0, 20)
    )
  );
}

function jaccardSimilarity(leftValues, rightValues) {
  const leftSet = new Set(leftValues);
  const rightSet = new Set(rightValues);

  if (leftSet.size === 0 && rightSet.size === 0) {
    return 0;
  }

  const intersectionSize = [...leftSet].filter((value) => rightSet.has(value)).length;
  const unionSize = new Set([...leftSet, ...rightSet]).size || 1;

  return intersectionSize / unionSize;
}

function computeSimilarityScore(firstArticle, secondArticle) {
  const titleSimilarity = jaccardSimilarity(
    normalizeTitle(firstArticle?.title).split(" ").filter(Boolean),
    normalizeTitle(secondArticle?.title).split(" ").filter(Boolean)
  );
  const keywordSimilarity = jaccardSimilarity(
    extractKeywords(firstArticle),
    extractKeywords(secondArticle)
  );
  const firstTopic = String(firstArticle?.bias?.topic || firstArticle?.category || "")
    .trim()
    .toLowerCase();
  const secondTopic = String(secondArticle?.bias?.topic || secondArticle?.category || "")
    .trim()
    .toLowerCase();
  const topicSimilarity = firstTopic && secondTopic && firstTopic === secondTopic ? 1 : 0;

  return (
    0.5 * titleSimilarity +
    0.3 * keywordSimilarity +
    0.2 * topicSimilarity
  );
}

function createEventClusterId(article) {
  const seed = [
    normalizeTitle(article?.title),
    String(article?.bias?.topic || article?.category || "general").toLowerCase(),
  ].join("|");

  return `event-${crypto.createHash("md5").update(seed).digest("hex").slice(0, 12)}`;
}

async function assignEventClusters(articles) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return [];
  }

  const comparisonArticles = await Article.find({
    eventClusterId: { $exists: true, $ne: "" },
  })
    .sort({ createdAt: -1 })
    .limit(MAX_COMPARISON_ARTICLES)
    .lean();

  const workingSet = [...comparisonArticles];
  const assignments = [];

  for (const article of articles) {
    let bestMatch = null;
    let bestScore = 0;

    for (const candidate of workingSet) {
      const score = computeSimilarityScore(article, candidate);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidate;
      }
    }

    const eventClusterId =
      bestMatch && bestScore >= CLUSTER_MATCH_THRESHOLD
        ? bestMatch.eventClusterId
        : createEventClusterId(article);

    assignments.push({
      articleId: String(article._id),
      eventClusterId,
      similarityScore: bestScore,
    });

    workingSet.push({
      ...article,
      eventClusterId,
    });
  }

  await Promise.all(
    assignments.map(({ articleId, eventClusterId }) =>
      Article.findByIdAndUpdate(articleId, {
        $set: {
          eventClusterId,
        },
      })
    )
  );

  return assignments;
}

async function compareNarratives(clusterId) {
  const articles = await Article.find({ eventClusterId: clusterId })
    .sort({ createdAt: -1 })
    .lean();

  if (articles.length === 0) {
    return {
      clusterId,
      articleCount: 0,
      summary: "No articles found for this event cluster.",
      comparisons: [],
    };
  }

  const comparisons = articles.map((article) => ({
    articleId: String(article._id),
    source: article.source,
    title: article.title,
    politicalLean: article.bias?.politicalLean || "unknown",
    framingType: article.bias?.framingType || "neutral",
  }));

  const summary = comparisons
    .map(
      (comparison) =>
        `${comparison.source} presents a ${comparison.politicalLean} lean with ${comparison.framingType} framing.`
    )
    .join(" ");

  return {
    clusterId,
    articleCount: articles.length,
    summary,
    comparisons,
  };
}

module.exports = {
  assignEventClusters,
  compareNarratives,
  computeSimilarityScore,
  createEventClusterId,
  extractKeywords,
  normalizeTitle,
};
