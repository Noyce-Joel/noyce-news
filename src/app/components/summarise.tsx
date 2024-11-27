"use client";
import React, { useState, useEffect, useContext } from "react";
import { getNews, getSummary } from "../lib/actions";
import { NewsContext, NewsType, useArticles } from "../state/news-provider";

export default function Summariser() {
  const { news } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState<NewsType | null>(null);

  useEffect(() => {
    const getArticles = async () => {
      const articles = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cron`);
      const data = await articles.json();
      console.log("data", data);
    };
    getArticles();
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
