"use client";
import React, { useState, useEffect, useContext } from "react";
import { getNews, getSummary } from "../lib/actions";
import { NewsContext, NewsType, useArticles } from "../state/news-provider";

export default function Summariser() {
  const { news } = useArticles();

  return (
    <div>
      {news.articles.map((article, idx) => (
        <div key={idx}>{article.headline}</div>
      ))}
    </div>
  );
}
