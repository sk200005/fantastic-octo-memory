//Fetching of News Articles [5 only]

const Parser = require("rss-parser");
const Article = require("../models/Article");

const parser = new Parser();

const fetchRSS = async () => {
  try {
    const feed = await parser.parseURL(
      "https://feeds.bbci.co.uk/news/rss.xml"
    );

    const items = feed.items.slice(0, 5);

    for (let item of items) {
      await Article.updateOne(
        { link: item.link },
        {
          $setOnInsert: {
            title: item.title,
            link: item.link,
            source: "BBC News",
            publishedAt: item.pubDate,
            processingStatus: "pending"
          }
        },
        { upsert: true }
      );
    }

    return { success: true, message: "5 RSS articles fetched" };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = fetchRSS;