/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Summarise from "@/components/summarise";
import { useArticles } from "../state/news-provider";
export default function Home() {
  const { news } = useArticles();
  
  if (news.guardian.length > 0) {
    return <Summarise />;
  }
  return <div>Loading...</div>;
}
