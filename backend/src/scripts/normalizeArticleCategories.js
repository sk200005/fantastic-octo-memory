const mongoose = require("mongoose");
const Article = require("../models/Article");
const {
  categorizeArticle,
} = require("../services/categoryClassifier");

async function normalizeArticleCategories() {
  await mongoose.connect("mongodb://127.0.0.1:27017/insight-ai");

  await Article.updateMany(
    {
      $or: [
        { category: null },
        { category: "" },
        { category: { $exists: false } },
      ],
    },
    {
      $set: { category: "general" },
    }
  );

  const articles = await Article.find(
    {},
    {
      _id: 1,
      title: 1,
      summary: 1,
      content: 1,
      rawContent: 1,
      source: 1,
      sourceGroup: 1,
      category: 1,
      subCategory: 1,
    }
  );
  let updated = 0;

  for (const article of articles) {
    const categorized = categorizeArticle({
      title: article.title,
      summary: article.summary || article.content || "",
      rawContent: article.rawContent || "",
      source: article.source || "",
      sourceGroup: article.sourceGroup || "",
      category: article.category || "",
      subCategory: article.subCategory || "",
    });

    if (
      article.category !== categorized.category ||
      (article.subCategory || "") !== categorized.subCategory ||
      (article.sourceGroup || "") !== categorized.sourceGroup
    ) {
      await Article.updateOne(
        { _id: article._id },
        {
          $set: {
            category: categorized.category,
            subCategory: categorized.subCategory,
            sourceGroup: categorized.sourceGroup,
          },
        }
      );
      updated += 1;
    }
  }

  const categories = await Article.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
        _id: 1,
      },
    },
  ]);

  console.log(JSON.stringify({ updated, categories }, null, 2));
  await mongoose.disconnect();
}

normalizeArticleCategories().catch(async (error) => {
  console.error(error);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});
