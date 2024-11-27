"use client";
import React, { useState, useEffect, useContext } from "react";
import { getNews, getSummary } from "../lib/actions";
import { NewsContext, NewsType, useArticles } from "../state/news-provider";

export default function Summariser() {
  const { news } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState<NewsType | null>(null);

  useEffect(() => {
    const getTextSummary = async () => {
      const text: string = news.articles[0].text;
      const summary = await getSummary(text);
      setSelectedArticle(summary);
    };
    getTextSummary();
  }, []);

  useEffect(() => {
    console.log("selectedArticle", selectedArticle);
  }, [selectedArticle]);

  return (
    <div>
      <p>{news.articles[0].text}</p>
      <p>{selectedArticle?.summary}</p>
    </div>
  );
}
