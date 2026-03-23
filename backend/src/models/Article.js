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

  content: {
    type: String,
    default: ""
  },
  rawContent: {
    type: String,
    default: ""
  },
  summary: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },

  processingStatus: {
  type: String,
  enum: ["pending", "scraped", "analyzed", "bias_analyzed", "failed"]
  },
  
  bias: {
    politicalLean: String,
    sentiment: String,
    biasScore: Number,
    emotionalTone: String,
    explanation: String
  }


}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);
