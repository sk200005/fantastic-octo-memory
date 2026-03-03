const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date
  },

  // 🔽 ADD THESE FIELDS
  content: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },

  processingStatus: {
    type: String,
    enum: ["pending", "scraped", "failed"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);