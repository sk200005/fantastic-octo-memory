require("dotenv").config();

const mongoose = require("mongoose");
const Article = require("../models/Article");

async function tagPdfUploadedArticles() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/insight-ai";

  await mongoose.connect(mongoUri);

  const result = await Article.updateMany(
    {
      $or: [
        { isUserUploaded: true },
        { source: "User Upload" },
        { link: /^user-upload:\/\/pdf\// },
      ],
    },
    {
      $set: {
        isUserUploaded: true,
        articleOrigin: "pdf_upload",
      },
    }
  );

  console.log(`Matched ${result.matchedCount} PDF uploaded article(s).`);
  console.log(`Updated ${result.modifiedCount} PDF uploaded article(s).`);

  await mongoose.disconnect();
}

tagPdfUploadedArticles().catch(async (error) => {
  console.error("Failed to tag PDF uploaded articles:", error);
  await mongoose.disconnect();
  process.exit(1);
});
