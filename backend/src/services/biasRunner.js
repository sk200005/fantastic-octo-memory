const Article = require("../models/Article");
const { analyzeBias } = require("./biasService");

const runBiasAnalysis = async () => {
  try {
    const articles = await Article.find({
      processingStatus: "scraped"
    }).limit(5);

    if (articles.length === 0) {
      return {
        success: true,
        message: "No scraped articles to analyze",
        analyzed: 0
      };
    }

    let analyzed = 0;

    for (let article of articles) {
      try {
        const articleText = article.rawContent || article.content;

        if (!articleText) {
          article.processingStatus = "failed";
          await article.save();
          continue;
        }

        const bias = await analyzeBias(articleText);

        article.bias = {
          politicalLean: bias.politicalLean,
          sentiment: bias.sentiment,
          emotionalTone: bias.emotionalTone,
          biasScore: bias.biasScore,
          explanation: bias.explanation
        };
        article.processingStatus = "analyzed";

        await article.save();
        analyzed++;
      } catch (error) {
        article.processingStatus = "failed";
        await article.save();
      }
    }

    return {
      success: true,
      message: "Bias analysis completed",
      analyzed
    };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = runBiasAnalysis;
