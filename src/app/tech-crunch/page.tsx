/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useArticles } from "@/state/news-provider";

import { NewsLoadingStates } from "@/components/loading/news-loading-states";
import NewsStories from "@/components/stories/news-stories";

export default function Home() {
  const { news } = useArticles();

  if (news.techCrunch.length > 0) {
    return <NewsStories news={news.techCrunch} />;
  }
  return <NewsLoadingStates />;
}
