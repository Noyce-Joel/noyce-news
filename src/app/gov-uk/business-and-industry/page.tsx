"use client";

import { Loading } from "@/components/loading/loading";
import Stories from "@/components/stories/stories";

import { useArticles } from "@/state/news-provider";
import { useEffect } from "react";

export default function Home() {
  const { news } = useArticles();
  useEffect(() => {
    console.log("news", news);
  }, [news]);
  if (news.govUk.businessAndIndustry.length > 0) {
    return <Stories news={news.govUk.businessAndIndustry} />;
  }
  return <Loading />;
}
