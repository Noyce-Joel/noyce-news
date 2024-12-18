/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useArticles } from "../state/news-provider";
import TechCrunchStories from "@/components/stories/TechCrunchStories";

export default function Home() {
  const { news } = useArticles();

  if (news.techCrunch.length > 0) {
    return <TechCrunchStories news={news} />;
  }
  return <div>Loading...</div>;
}
