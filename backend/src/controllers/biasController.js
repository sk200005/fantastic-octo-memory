const Article = require("../models/Article");
const { analyzeBias } = require("../services/biasService");

async function runBiasAnalysis(req, res) {
  try {
    // 1️⃣ Get scraped articles only
    const articles = await Article.find({
      processingStatus: "scraped"
    }).limit(5); // limit for testing

    if (articles.length === 0) {
      return res.json({ message: "No scraped articles to analyze." });
    }

    let processedCount = 0;

    for (const article of articles) {
      try {
        const articleText = article.rawContent || article.content;

        if (!articleText) {
          article.processingStatus = "failed";
          await article.save();
          continue;
        }

        // 2️⃣ Call Gemini
        const biasResult = await analyzeBias(articleText);

        // 3️⃣ Save bias data
        article.bias = {
          politicalLean: biasResult.politicalLean,
          sentiment: biasResult.sentiment,
          emotionalTone: biasResult.emotionalTone,
          biasScore: biasResult.biasScore,
          explanation: biasResult.explanation
        };

        // 4️⃣ Update status
        article.processingStatus = "analyzed";

        await article.save();
        processedCount++;

      } catch (error) {
        console.error(
          "Bias failed for:",
          article._id,
          "\nError:",
          error.message,
          "\nFull error:",
          error
        );

        article.processingStatus = "failed";
        await article.save();
      }
    }

    res.json({
      message: "Bias analysis completed",
      analyzed: processedCount
    });

  } catch (error) {
    console.error("Bias Controller Error:", error);
    res.status(500).json({ error: "Server error during bias analysis" });
  }
}

module.exports = { runBiasAnalysis };
