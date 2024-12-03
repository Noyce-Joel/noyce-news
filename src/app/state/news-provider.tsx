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
};

export type NewsContextType = {

  news: {
    articles: NewsType[];
  };
  setNews: (news: { articles: NewsType[] }) => void;
};

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined
);

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [news, setNews] = useState<{ articles: NewsType[] }>({ articles: [] });
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
