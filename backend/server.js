const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const rssRoutes = require("./src/routes/rssRoutes");
const scraperRoutes = require("./src/routes/scraperRoutes");
const articleRoutes = require("./src/routes/articleRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/insight-ai")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/rss", rssRoutes);
app.use("/api/scraper", scraperRoutes);
app.use("/api/articles", articleRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});