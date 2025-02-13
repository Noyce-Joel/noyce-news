import {
  ExternalLink,
  Calendar,
  ChevronRight,
  Newspaper,
  BarChart,
  Scale,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Article {
  articleId: number;
  createdAt: string;
  id: number;
  leaning: string;
  sentiment: string;
  url: string;
  title: string;
}

export default function RelevantReading({ articles }: { articles: any[] }) {
  const majorKeywords = [
    "nytimes",
    "washingtonpost",
    "latimes",
    "usatoday",
    "wsj",
    "chicagotribune",
    "bostonglobe",
    "guardian",
    "telegraph",
    "dailymail",
    "independent",
    "ft",
    "thetimes",
    "mirror",
    "thesun",
    "express",
    "bbc",
    "standard",
    "metro",
    "sky",
    "gov",
  ];

  const extractDomain = (url: string) =>
    new URL(url).hostname.replace("www.", "");

  const isMajorNewspaper = (url: string) => {
    const hostname = new URL(url).hostname.toLowerCase();
    return majorKeywords.some((keyword) => hostname.includes(keyword));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "negative":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const getLeaningColor = (leaning: string) => {
    switch (leaning.toLowerCase()) {
      case "left":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "right":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    const aIsMajor = isMajorNewspaper(a.url);
    const bIsMajor = isMajorNewspaper(b.url);

    if (aIsMajor && !bIsMajor) return -1;
    if (!aIsMajor && bIsMajor) return 1;
    return 0;
  });

  return (
    <div className="mt-8 space-y-12">
      <div className="flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-gray-400" />
        <h2 className="text-xl font-semibold text-white">Relevant Reading</h2>
      </div>
      <div className="divide-y divide-gray-800/80 border-l border-gray-700 px-4">
        {sortedArticles.map((article) => (
          <div
            key={article.id}
            className="group relative md:px-4 transition-colors hover:bg-gray-900"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 md:pr-12 flex md:flex-row flex-col h-full md:gap-8 gap-4"
            >
              <div className="flex flex-col gap-2 w-full md:w-2/5">
                <div className="flex items-center gap-2">
                  <p className="text-white">{extractDomain(article.url)}</p>
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Scale className="h-4 w-4 text-gray-400" />
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-medium",
                          getLeaningColor(article.leaning)
                        )}
                      >
                        {article.leaning}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-medium",
                          getSentimentColor(article.sentiment)
                        )}
                      >
                        {article.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-3/5 h-full">
                <h1 className="text-white text-lg font-bold">
                  {article.title}
                </h1>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
