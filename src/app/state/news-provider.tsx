"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getNews } from "../lib/actions";

export type ArticleType = {
  id: string;
  headline: string;
  standFirst: string | null;
  text: string;
  mainImg: string | null;
  summary: string | null;
  tag: string;
  createdAt: string;
  updatedAt: string;
  sourceUrl: string;
  source: string;
};

export type NewsSourceType = {
  guardian: ArticleType[];
  bbc: ArticleType[];
};

export type NewsContextType = {
  news: NewsSourceType;
  setNews: (source: keyof NewsSourceType, articles: ArticleType[]) => void;
};

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined
);

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [news, setNewsState] = useState<NewsSourceType>({
    guardian: [],
    bbc: [],
  });

  const setNews = (source: keyof NewsSourceType, articles: ArticleType[]) => {
    setNewsState((prev) => ({
      ...prev,
      [source]: articles,
    }));
  };

  useEffect(() => {
    const fetchGuardianArticles = async () => {
      try {
        const data = await getNews("The Guardian");
        setNews(
          "guardian",
          data.articles.map((article: any) => ({
            ...article,
            source: article.newspaper?.name ?? "Unknown",
          }))
        );
      } catch (error) {
        console.error("Error fetching Guardian articles:", error);
      }
    };

    const fetchBBCArticles = async () => {
      try {
        // Fetch only BBC articles
        const data = await getNews("BBC");
        setNews(
          "bbc",
          data.articles.map((article: any) => ({
            ...article,
            source: article.newspaper?.name ?? "Unknown",
          }))
        );
      } catch (error) {
        console.error("Error fetching BBC articles:", error);
      }
    };

    // Fetch articles from multiple sources as needed
    fetchGuardianArticles();
    fetchBBCArticles();
  }, []);

  useEffect(() => {
    console.log("news", news);
  }, [news]);

  return (
    <NewsContext.Provider value={{ news, setNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within a NewsProvider");
  }
  return context;
};
