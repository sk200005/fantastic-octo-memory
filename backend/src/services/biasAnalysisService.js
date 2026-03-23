const {
  DEFAULT_BATCH_SIZE,
  fetchArticlesForBiasAnalysis,
  updateArticleBias,
  markArticleBiasFailed,
} = require("./articleBiasRepository");
const { analyzeLocalBiasSignals } = require("./pythonClient");
const { analyzePoliticalBiasBatch } = require("./geminiBiasService");

function buildBiasText(article) {
  const rawContent = article.rawContent || article.content || "";

  return `Title: ${article.title || ""}

Summary: ${article.summary || ""}

Article Excerpt:
${rawContent.slice(0, 1500)}`;
}

async function analyzeSingleArticleBias(article) {
  const biasText = buildBiasText(article);
  const localSignals = await analyzeLocalBiasSignals(biasText);
  const [politicalBias] = await analyzePoliticalBiasBatch([
    {
      title: article.title,
      summary: article.summary,
    },
  ]);

  return {
    politicalLean: politicalBias.politicalLean,
    sentiment: localSignals.sentiment,
    emotionalTone: localSignals.emotionalTone,
    biasScore: politicalBias.biasScore,
  };
}

async function runBiasAnalysisBatch(batchSize = DEFAULT_BATCH_SIZE) {
  try {
    const articles = await fetchArticlesForBiasAnalysis(batchSize);

    if (articles.length === 0) {
      return {
        success: true,
        message: "No summarized scraped articles to analyze.",
        analyzed: 0,
      };
    }

    let analyzed = 0;
    const failures = [];
    const localResults = new Array(articles.length);
    const geminiEligibleArticles = [];
    const geminiEligibleIndexes = [];

    for (const [index, article] of articles.entries()) {
      try {
        const biasText = buildBiasText(article);
        const localSignals = await analyzeLocalBiasSignals(biasText);

        localResults[index] = localSignals;
        geminiEligibleArticles.push(article);
        geminiEligibleIndexes.push(index);
      } catch (error) {
        const reason = error.message || "Unknown bias analysis error";
        console.error("Bias analysis failed for article:", article._id, reason);
        await markArticleBiasFailed(article._id, reason);
        failures.push({
          articleId: article._id,
          error: reason,
        });
      }
    }

    if (geminiEligibleArticles.length > 0) {
      try {
        const politicalBiasResults = await analyzePoliticalBiasBatch(
          geminiEligibleArticles
        );

        for (const [resultIndex, politicalBias] of politicalBiasResults.entries()) {
          const articleIndex = geminiEligibleIndexes[resultIndex];
          const article = articles[articleIndex];
          const localSignals = localResults[articleIndex];

          const bias = {
            politicalLean: politicalBias.politicalLean,
            sentiment: localSignals.sentiment,
            emotionalTone: localSignals.emotionalTone,
            biasScore: politicalBias.biasScore,
          };

          await updateArticleBias(article._id, bias);
          analyzed++;
        }
      } catch (error) {
        const reason = error.message || "Unknown Gemini batch analysis error";

        for (const article of geminiEligibleArticles) {
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
      batchSize,
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
