const { createArticleFromPdf } = require("../services/pdfArticleService");

function getPublicBaseUrl(req) {
  return process.env.PUBLIC_BACKEND_URL || `${req.protocol}://${req.get("host")}`;
}

async function uploadPdfArticle(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file.",
      });
    }

    const article = await createArticleFromPdf({
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      llmProvider: req.body?.llmProvider,
      publicBaseUrl: getPublicBaseUrl(req),
    });

    res.status(201).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("PDF article upload failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Could not process the uploaded PDF.",
    });
  }
}

module.exports = {
  uploadPdfArticle,
};
