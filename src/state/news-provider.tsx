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
    // keyPoints: string | null;  // remove this line
    keyPoints: {
      key_points: {
        title: string;
        content: string[];
      }[];
    } | null; // or 'any' if you prefer
  };
};

export type NewsSourceType = {
  guardian: ArticleType[];
  techCrunch: ArticleType[];
  bbc: ArticleType[];
  arsTechnica: ArticleType[];
  govUk: ArticleType[];
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
    techCrunch: [],
    bbc: [],
    arsTechnica: [],
    govUk: [],
  });

  const setNews = (source: keyof NewsSourceType, articles: ArticleType[]) => {
    setNewsState((prev) => ({
      ...prev,
      [source]: articles,
    }));
  };

  useEffect(() => {
    const sources = [
      { name: "The Guardian", key: "guardian" },
      { name: "TechCrunch", key: "techCrunch" },
      { name: "BBC UK", key: "bbc" },
      { name: "Ars Technica", key: "arsTechnica" },
      { name: "GOV.UK", key: "govUk" },
    ] as const;

    const fetchArticles = async (source: (typeof sources)[number]) => {
      try {
        const data = await getNews(source.name);

        setNews(
          source.key,
          data.articles
            .filter((article: any) => article.keyPoints !== null)
            .slice(0, 12)
            .map((article: any) => ({
              ...article,
              source: article.newspaper?.name ?? "Unknown",
              keyPoints: article.keyPoints
                ? {
                    ...article.keyPoints,
                    keyPoints:
                      typeof article.keyPoints.keyPoints === "string"
                        ? JSON.parse(article.keyPoints.keyPoints)
                        : article.keyPoints.keyPoints,
                  }
                : null,
            }))
        );
      } catch (error) {
        console.error(`Error fetching ${source.name} articles:`, error);
      }
    };

    // Fetch all sources in parallel
    Promise.all(sources.map(fetchArticles)).catch((error) => {
      console.error("Error fetching articles:", error);
    });
  }, []);

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
