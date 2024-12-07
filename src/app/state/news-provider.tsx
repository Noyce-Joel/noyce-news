"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getNews, getSummary } from "../lib/actions";

export type NewsType = {
  id: string;
  headline: string;
  standFirst: string;
  text: string;
  mainImg: string;
  summary: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
  sourceUrl: string;
  source: string; // Added source field to track which newspaper
};

export type NewsSourceType = {
  guardian: NewsType[];

  bbc: NewsType[];
  // Add more news sources as needed
};

export type NewsContextType = {
  news: NewsSourceType;
  setNews: (source: keyof NewsSourceType, articles: NewsType[]) => void;
};

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined
);

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [news, setNewsState] = useState<NewsSourceType>({
    guardian: [],

    bbc: [],
  });

  const setNews = (source: keyof NewsSourceType, articles: NewsType[]) => {
    setNewsState((prev) => ({
      ...prev,
      [source]: articles,
    }));
  };

  useEffect(() => {
    const getGuardianData = async () => {
      const articles = await getNews();

      setNews(
        "guardian",
        articles.articles.map((article: any) => ({
          ...article,
          source: "guardian",
        }))
      );
    };

    getGuardianData();
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
