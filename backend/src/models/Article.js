const mongoose = require("mongoose");
const {
  categorizeArticle,
} = require("../services/categoryClassifier");

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
    default: "general"
  },
  subCategory: {
    type: String,
    default: ""
  },
  sourceGroup: {
    type: String,
    default: ""
  },
  biasScore: {
    type: Number,
    default: 0
  },
  sentiment: {
    type: String,
    default: "neutral"
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

articleSchema.pre("save", function setDerivedArticleFields() {
  const summaryOrContent = this.summary || this.content || "";
  const categorized = categorizeArticle({
    title: this.title,
    summary: summaryOrContent,
    rawContent: this.rawContent || "",
    source: this.source,
    sourceGroup: this.sourceGroup,
    category: this.category,
    subCategory: this.subCategory,
  });

  this.category = categorized.category;
  this.subCategory = categorized.subCategory;
  this.sourceGroup = categorized.sourceGroup;

  if (this.bias?.biasScore !== undefined && this.bias?.biasScore !== null) {
    this.biasScore = this.bias.biasScore;
  }

  if (this.bias?.sentiment) {
    this.sentiment = this.bias.sentiment;
  }
});

module.exports = mongoose.model("Article", articleSchema);
