//Scrapping of news Articles

const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("../models/Article");

const SCRAPE_BATCH_SIZE = 3;

const scrapeArticles = async (articleIds = []) => {
  try {
    const query = {
      processingStatus: "pending",
    };

    if (Array.isArray(articleIds) && articleIds.length > 0) {
      query._id = { $in: articleIds };
    }

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .limit(SCRAPE_BATCH_SIZE);
    const scrapedArticleIds = [];
    const failedArticleIds = [];

    for (let article of articles) {
      try {
        const response = await axios.get(article.link, {
          timeout: 10000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
          }
        });

        const $ = cheerio.load(response.data);

        const rawContent = $("p")
          .map((i, el) => $(el).text().trim())
          .get()
          .join(" ")
          .slice(0, 10000);

        const image =
          $('meta[property="og:image"]').attr("content") || "";

        if (!rawContent || rawContent.length < 200) {
          article.processingStatus = "failed";
          await article.save();
          failedArticleIds.push(String(article._id));
          continue;
        }

        article.rawContent = rawContent;
        article.image = image;
        article.processingStatus = "scraped";

        await article.save();
        scrapedArticleIds.push(String(article._id));

      } catch (err) {
        article.processingStatus = "failed";
        await article.save();
        failedArticleIds.push(String(article._id));
      }
    }

    return {
      success: true,
      message: "Scraping completed",
      attempted: articles.length,
      scraped: scrapedArticleIds.length,
      articleIds: scrapedArticleIds,
      failedArticleIds,
      batchSize: SCRAPE_BATCH_SIZE,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = scrapeArticles;
