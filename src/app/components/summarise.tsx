/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { cleanText } from "../lib/utils";
import { getNews } from "../lib/actions";

export default function Summariser() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<any>();

  useEffect(() => {
    const getNewsData = async () => {
      const links = await getNews();

      setNews(links);
    };

    getNewsData();
  }, []);

  useEffect(() => {
    console.log("news", news);
  }, [news]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!inputText.trim()) {
      setError("Please enter some text to summarize");
      setLoading(false);
      return;
    }

    try {
      const cleanedText = cleanText(inputText);

      if (cleanedText.length < 10) {
        throw new Error(
          "Text is too short after cleaning. Please provide more content."
        );
      }

      const response = await fetch("/api/summarise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanedText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to summarize text");
      }

      const data = await response.json();

      setSummary(data.summary);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate summary"
      );
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-black">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium">
            Enter text to summarize
          </label>
          <textarea
            id="text"
            value={inputText}
            onChange={handleTextChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={6}
            disabled={loading}
            placeholder="Paste your text here..."
          />
        </div>
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${
              loading || !inputText.trim()
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {summary && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Summary</h3>
          <div className="mt-2 p-4 bg-gray-50 rounded-md">
            <p>{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
