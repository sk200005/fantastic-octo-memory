const Parser = require("rss-parser");
const Article = require("../models/Article");

const parser = new Parser();

const fetchRSS = async () => {
  try {
    const feed = await parser.parseURL(
      "https://feeds.bbci.co.uk/news/rss.xml"
    );

    for (let item of feed.items) {
      await Article.updateOne(
        { link: item.link },
        {
          $setOnInsert: {
            title: item.title,
            link: item.link,
            source: "BBC News",
            publishedAt: item.pubDate
          }
        },
        { upsert: true }
      );
    }

    return { success: true, message: "RSS fetched successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = fetchRSS;