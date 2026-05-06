import React, { useRef, useState } from "react";
import api from "../api/axios";
import ArticleCard from "./ArticleCard";

const MAX_FILE_SIZE_MB = 8;

function getUploadErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.code === "ERR_NETWORK") {
    return "Could not connect to the backend at http://localhost:8000.";
  }

  return error.message || "Could not process the PDF.";
}

function PdfArticleUpload({ onArticleUploaded }) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedArticle, setUploadedArticle] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setError("");
    setStatus("");
    setUploadedArticle(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedFile(null);
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setSelectedFile(null);
      setError(`Please select a PDF smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("articlePdf", selectedFile);

    try {
      setIsUploading(true);
      setError("");
      setStatus("Extracting, summarizing, and analyzing the article...");

      const response = await api.post("/uploads/article-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const article = response.data?.article;

      if (!article) {
        throw new Error("The backend did not return an analyzed article.");
      }

      setUploadedArticle(article);
      setStatus("Analysis complete. The article has been added to the news list.");
      onArticleUploaded?.(article);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setSelectedFile(null);
    } catch (uploadError) {
      console.error("PDF upload failed:", uploadError);
      setError(getUploadErrorMessage(uploadError));
      setStatus("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-[linear-gradient(180deg,#eef4fb_0%,#f8fafc_100%)] pb-16 pt-14 sm:pb-18 sm:pt-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-700">
              PDF Analysis
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-slate-950 sm:text-4xl">
              Upload Article
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Add a news PDF and get the same summary, bias score, framing insight, and perspective analysis used across the news feed.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-6"
          >
            <div className="flex flex-col gap-4">
              <label className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center transition hover:border-sky-300 hover:bg-sky-50/40">
                <span className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
                  Select PDF
                </span>
                <span className="mt-3 max-w-full truncate text-base font-semibold text-slate-950">
                  {selectedFile?.name || "No file selected"}
                </span>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={isUploading}
                />
              </label>

              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="inline-flex w-full justify-center rounded-full border border-slate-950 bg-slate-950 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_28px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                {isUploading ? "Analyzing..." : "Analyze PDF"}
              </button>

              {(status || error) && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    error
                      ? "bg-red-50 text-red-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {error || status}
                </p>
              )}
            </div>
          </form>
        </div>

        {uploadedArticle && (
          <div className="mt-10">
            <ArticleCard article={uploadedArticle} />
          </div>
        )}
      </div>
    </section>
  );
}

export default PdfArticleUpload;
