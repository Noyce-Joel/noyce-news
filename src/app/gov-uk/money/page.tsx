"use client";

import { Loading } from "@/components/loading/loading";
import Stories from "@/components/stories/stories";

import { useArticles } from "@/state/news-provider";

export default function Home() {
  const { news } = useArticles();

  if (news.govUk.money.length > 0) {
    return <Stories news={news.govUk.money} />;
  }
  return <Loading />;
}
