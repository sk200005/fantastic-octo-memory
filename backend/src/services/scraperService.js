const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("../models/Article");

const scrapeArticles = async () => {
  try {
    const articles = await Article.find({
      processingStatus: "pending"
    });

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

        const content = $("p")
          .map((i, el) => $(el).text().trim())
          .get()
          .join(" ")
          .slice(0, 10000);

        const image =
          $('meta[property="og:image"]').attr("content") || "";

        if (!content || content.length < 200) {
          article.processingStatus = "failed";
          await article.save();
          continue;
        }

        article.content = content;
        article.image = image;
        article.processingStatus = "scraped";

        await article.save();

      } catch (err) {
        article.processingStatus = "failed";
        await article.save();
      }
    }

    return { success: true, message: "Scraping completed" };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = scrapeArticles;