"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getNews, getNewsLinks, getSummary } from "../lib/actions";

export type NewsType = {
  
  headline: string;
  standfirst: string;
  text: string;
  mainImg: string;
  summary: string;
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
  const [newsLinks, setNewsLinks] = useState<any[]>([]);
  useEffect(() => {
    const getNewsData = async () => {
      const links = await getNews();
      const linksArticles = await getNewsLinks();
      setNews(links);
      setNewsLinks(linksArticles);
    };

    getNewsData();
    console.log("newsLinks", newsLinks);
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
