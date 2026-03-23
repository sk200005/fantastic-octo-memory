const Parser = require("rss-parser");
const Article = require("../models/Article");
const { rssFeeds } = require("../config/rssFeeds");
const { selectFeedsForCycle } = require("./feedSelector");

const parser = new Parser();

function shuffleFeeds(feeds) {
  const shuffled = [...feeds];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

async function updateExistingArticleCategory(link, category, source) {
  const existingArticle = await Article.findOne({ link });

  if (!existingArticle) {
    return false;
  }

  let shouldSave = false;

  if (!existingArticle.category) {
    existingArticle.category = category;
    shouldSave = true;
  }

  if (!existingArticle.source && source) {
    existingArticle.source = source;
    shouldSave = true;
  }

  if (shouldSave) {
    await existingArticle.save();
  }

  return true;
}

async function fetchArticleForCategory(selectedFeed) {
  const categoryFeeds = rssFeeds[selectedFeed.category] || [];
  const alternateFeeds = shuffleFeeds(
    categoryFeeds.filter((feed) => feed.url !== selectedFeed.url)
  );
  const feedsToTry = [selectedFeed, ...alternateFeeds];

  for (const feed of feedsToTry) {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      const items = parsedFeed.items || [];

      for (const item of items) {
        if (!item?.link) {
          continue;
        }

        const alreadyExists = await updateExistingArticleCategory(
          item.link,
          selectedFeed.category,
          feed.name
        );

        if (alreadyExists) {
          continue;
        }

        const article = new Article({
          title: item.title || "Untitled Article",
          link: item.link,
          source: feed.name,
          category: selectedFeed.category,
          publishedAt: item.pubDate || item.isoDate || new Date(),
          content: item.contentSnippet || item.content || "",
          image: item.enclosure?.url || "",
          processingStatus: "pending",
        });

        await article.save();
        return article;
      }
    } catch (error) {
      console.error(`RSS fetch error for ${feed.name}:`, error.message);
    }
  }

  return null;
}

async function ingestArticles() {
  const selectedFeeds = selectFeedsForCycle(rssFeeds);
  const savedArticles = [];

  for (const feed of selectedFeeds) {
    const article = await fetchArticleForCategory(feed);

    if (article) {
      savedArticles.push(article);
    }
  }

  return {
    count: savedArticles.length,
    articles: savedArticles,
    selectedFeeds: selectedFeeds.map(({ name, category }) => ({ name, category })),
  };
}

module.exports = { ingestArticles };
