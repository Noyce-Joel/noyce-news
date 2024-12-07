"use client";
import React from "react";
import { useArticles } from "@/app/state/news-provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

const fallbackImg = "https://via.placeholder.com/300x200";

export default function Summariser() {
  const { news } = useArticles();
  const articles = news.guardian || [];

  if (articles.length === 0) return <div>No articles available</div>;

  return <></>;
}
