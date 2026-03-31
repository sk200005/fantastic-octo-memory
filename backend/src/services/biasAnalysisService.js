const {
  DEFAULT_BATCH_SIZE,
  fetchArticlesForBiasAnalysis,
  updateArticleBias,
  markArticleBiasFailed,
} = require("./articleBiasRepository");
const { analyzeLocalBiasSignals } = require("./pythonClient");
const { analyzePoliticalBiasBatch } = require("./geminiBiasService");

const MAX_BIAS_CONTEXT_LENGTH = 1800;
const BATCH_SIZE = 3;

function clampScore(score) {
  return Math.max(0, Math.min(1, score));
}

function splitParagraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function trimContext(text, maxLength = MAX_BIAS_CONTEXT_LENGTH) {
  const normalized = String(text || "").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function buildBiasText(article) {
  const rawContent = article.rawContent || article.content || "";
  const paragraphs = splitParagraphs(rawContent);
  const introParagraphs = paragraphs.slice(0, 2).join("\n\n");
  const conclusionParagraph = paragraphs.length > 0
    ? paragraphs[paragraphs.length - 1]
    : "";

  const context = `TITLE:
${article.title || ""}

SUMMARY:
${article.summary || ""}

INTRO:
${introParagraphs}

CONCLUSION:
${conclusionParagraph}`;

  return trimContext(context, MAX_BIAS_CONTEXT_LENGTH);
}

function buildFallbackLocalSignals(error) {
  return {
    sentiment: "Neutral",
    emotionalTone: "Neutral",
    explanation: error.message || "Local bias analysis unavailable",
  };
}

async function analyzeSingleArticleBias(article) {
  const biasText = buildBiasText(article);
  let localSignals;

  try {
    localSignals = await analyzeLocalBiasSignals(biasText);
  } catch (error) {
    localSignals = buildFallbackLocalSignals(error);
  }

  const [politicalBias] = await analyzePoliticalBiasBatch([
    {
      _id: article._id,
      biasText,
    },
  ]);

  const loadedWords = Array.isArray(politicalBias?.loadedWords)
    ? politicalBias.loadedWords.filter(Boolean)
    : [];
  const geminiBiasScore = clampScore(
    typeof politicalBias?.biasScore === "number"
      ? politicalBias.biasScore
      : Number(politicalBias?.biasScore) || 0
  );
  const loadedWordScore = clampScore(loadedWords.length / 10);
  const viewpointPenalty = politicalBias?.opposingViewsPresent ? 0 : 0.1;
  const finalBiasScore = clampScore(
    0.7 * geminiBiasScore +
    0.2 * loadedWordScore +
    0.1 * viewpointPenalty
  );

  return {
    politicalLean: politicalBias?.politicalLean || "center",
    sentiment: localSignals.sentiment,
    emotionalTone: localSignals.emotionalTone,
    biasScore: geminiBiasScore,
    biasScoreFinal: finalBiasScore,
    loadedWords,
    emotionalLanguage: Array.isArray(politicalBias?.emotionalLanguage)
      ? politicalBias.emotionalLanguage.filter(Boolean)
      : [],
    opposingViewsPresent: Boolean(politicalBias?.opposingViewsPresent),
  };
}

async function runBiasAnalysisBatch(batchSize = DEFAULT_BATCH_SIZE, articleIds = []) {
  try {
    const effectiveBatchSize = BATCH_SIZE;
    const articles = await fetchArticlesForBiasAnalysis(effectiveBatchSize, articleIds);

    if (articles.length === 0) {
      return {
        success: true,
        message: "No summarized scraped articles to analyze.",
        analyzed: 0,
      };
    }

    let analyzed = 0;
    const failures = [];
    const analyzedArticleIds = [];
    const articleBatches = [];

    for (let index = 0; index < articles.length; index += BATCH_SIZE) {
      articleBatches.push(articles.slice(index, index + BATCH_SIZE));
    }

    for (const [batchIndex, batchArticles] of articleBatches.entries()) {
      const batchNumber = batchIndex + 1;
      console.log("Processing bias batch:", batchNumber);

      const localResults = new Array(batchArticles.length);

      for (const [index, article] of batchArticles.entries()) {
        const biasText = buildBiasText(article);

        try {
          localResults[index] = await analyzeLocalBiasSignals(biasText);
        } catch (error) {
          const reason = error.message || "Unknown local bias analysis error";
          console.warn("Local bias analysis unavailable for article:", article._id, reason);
          localResults[index] = buildFallbackLocalSignals(error);
        }
      }

      try {
        const geminiBatchPayload = batchArticles.map((article) => ({
          _id: article._id,
          biasText: buildBiasText(article).slice(0, MAX_BIAS_CONTEXT_LENGTH),
        }));
        const politicalBiasResults = await analyzePoliticalBiasBatch(geminiBatchPayload);

        for (const [resultIndex, politicalBias] of politicalBiasResults.entries()) {
          const article = batchArticles[resultIndex];
          const localSignals = localResults[resultIndex];
          const loadedWords = Array.isArray(politicalBias.loadedWords)
            ? politicalBias.loadedWords.filter(Boolean)
            : [];
          const emotionalLanguage = Array.isArray(politicalBias.emotionalLanguage)
            ? politicalBias.emotionalLanguage.filter(Boolean)
            : [];
          const geminiBiasScore = clampScore(
            typeof politicalBias.biasScore === "number"
              ? politicalBias.biasScore
              : Number(politicalBias.biasScore) || 0
          );
          const loadedWordScore = clampScore(loadedWords.length / 10);
          const viewpointPenalty = politicalBias.opposingViewsPresent ? 0 : 0.1;
          const finalBiasScore = clampScore(
            0.7 * geminiBiasScore +
            0.2 * loadedWordScore +
            0.1 * viewpointPenalty
          );

          const bias = {
            politicalLean: politicalBias.politicalLean,
            sentiment: localSignals.sentiment,
            emotionalTone: localSignals.emotionalTone,
            biasScore: geminiBiasScore,
            biasScoreFinal: finalBiasScore,
            loadedWords,
            emotionalLanguage,
            opposingViewsPresent: Boolean(politicalBias.opposingViewsPresent),
          };

          await updateArticleBias(article._id, bias);
          analyzed++;
          analyzedArticleIds.push(String(article._id));
        }
      } catch (error) {
        const reason = error.message || "Unknown Gemini batch analysis error";

        for (const article of batchArticles) {
          console.error("Gemini batch bias analysis failed for article:", article._id, reason);
          await markArticleBiasFailed(article._id, reason);
          failures.push({
            articleId: article._id,
            error: reason,
          });
        }
      }
    }

    return {
      success: true,
      message: "Bias analysis completed.",
      analyzed,
      attempted: articles.length,
      batchSize: BATCH_SIZE,
      requestedBatchSize: batchSize,
      articleIds: analyzedArticleIds,
      failures,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  buildBiasText,
  analyzeSingleArticleBias,
  runBiasAnalysisBatch,
};
