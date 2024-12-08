/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import GuardianStories from "@/components/GuardianStories";
import { useArticles } from "../state/news-provider";
export default function Home() {
  const { news } = useArticles();
  
  if (news.guardian.length > 0) {
    return <GuardianStories news={news} />;
  }
  return <div>Loading...</div>;
}
