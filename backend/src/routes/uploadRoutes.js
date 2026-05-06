const express = require("express");
const multer = require("multer");
const { uploadPdfArticle } = require("../controllers/uploadController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype === "application/pdf" || /\.pdf$/i.test(file.originalname)) {
      callback(null, true);
      return;
    }

    callback(new Error("Only PDF files are supported."));
  },
});

function handlePdfUpload(req, res, next) {
  upload.single("articlePdf")(req, res, (error) => {
    if (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Could not read the uploaded PDF.",
      });
      return;
    }

    next();
  });
}

router.post("/article-pdf", handlePdfUpload, uploadPdfArticle);

module.exports = router;
