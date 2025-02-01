/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { NewsLoadingStates } from "@/components/loading/news-loading-states";
import NewsStories from "@/components/stories/news-stories";
import { getNews } from "@/lib/actions";

import { useArticles } from "@/state/news-provider";
import { useEffect } from "react";

export default function Home() {
  const { news } = useArticles();
  
  if (news.govUk.businessAndIndustry.length > 0) {
    return <NewsStories news={news.govUk.businessAndIndustry} />;
  }
  return <NewsLoadingStates />;
}
