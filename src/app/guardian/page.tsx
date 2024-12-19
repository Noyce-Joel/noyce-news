/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { NewsLoadingStates } from "@/components/loading/news-loading-states";
import NewsStories from "@/components/stories/news-stories";

import { useArticles } from "@/state/news-provider";

export default function Home() {
  const { news } = useArticles();

  if (news.guardian.length > 0) {
    return <NewsStories news={news.guardian} />;
  }
  return <NewsLoadingStates />;
}
