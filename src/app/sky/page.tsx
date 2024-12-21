/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { NewsLoadingStates } from "@/components/loading/news-loading-states";
import NewsStories from "@/components/stories/news-stories";
import { getSkyHeadlines } from "@/lib/actions";

import { useEffect } from "react";
import { useArticles } from "@/state/news-provider";

export default function Home() {
  const { news } = useArticles();
  useEffect(() => {
    const fetchSkyHeadlines = async () => {
      const skyHeadlines  = await getSkyHeadlines();
      console.log(skyHeadlines);
    };
    fetchSkyHeadlines();
  }, []);
  if (news.sky.length > 0) {
    return <NewsStories news={news.sky} />;
  }
  return <NewsLoadingStates />;
}
