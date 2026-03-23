const { ingestArticles } = require("./rssIngestionService");

async function fetchRSS() {
  try {
    const result = await ingestArticles();

    return {
      success: true,
      message: `${result.count} articles fetched`,
      ...result,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = fetchRSS;
