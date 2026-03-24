require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const rssRoutes = require("./src/routes/rssRoutes");
const newsRoutes = require("./src/routes/newsRoutes");
const scraperRoutes = require("./src/routes/scraperRoutes");
const articleRoutes = require("./src/routes/articleRoutes");
const biasRoutes = require("./src/routes/biasRoutes");
const summarizationRoutes = require("./src/routes/summarizationRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const recommendRoutes = require("./src/routes/recommendRoutes");


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/insight-ai")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/rss", rssRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/scraper", scraperRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/bias", biasRoutes);
app.use("/api/summarize", summarizationRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
