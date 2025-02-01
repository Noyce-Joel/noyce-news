"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getNews } from "@/lib/actions";

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
  keyPoints: {
    id: string;
    articleId: string;
    createdAt: string;
    updatedAt: string;
    article: ArticleType;
    keyPoints: {
      key_points: {
        title: string;
        content: string[];
      }[];
    } | null;
  };
  newspaper: {
    id: string;
    name: string;
    url: string;
  };
};

export type NewsSourceType = {
  govUk: {
    environment: ArticleType[];
    businessAndIndustry: ArticleType[];
  };
};

export type NewsContextType = {
  news: NewsSourceType;
  setNews: React.Dispatch<React.SetStateAction<NewsSourceType>>;
};

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined
);

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [news, setNews] = useState<NewsSourceType>({
    govUk: {
      environment: [],
      businessAndIndustry: [],
    },
  });

  useEffect(() => {
    async function fetchArticles() {
      try {
        const [envData, busData] = await Promise.all([
          getNews("GOV.UK", "Environment"),
          getNews("GOV.UK", "Business and Industry"),
        ]);

        setNews((prev) => ({
          ...prev,
          govUk: {
            ...prev.govUk,
            environment: envData.articles ?? [],
            businessAndIndustry: busData.articles ?? [],
          },
        }));
      } catch (error) {
        console.error("Failed to fetch news in provider:", error);
      }
    }

    fetchArticles();
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
