const express = require("express");
const cors = require("cors");
const rssRoutes = require("./routes/rssRoutes");
const articleRoutes = require("./routes/articleRoutes");
const scraperRoutes = require("./routes/scraperRoutes");
const newsRoutes = require("./routes/newsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const recommendRoutes = require("./routes/recommendRoutes");

const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/rss", rssRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api", scraperRoutes);

module.exports = app;
