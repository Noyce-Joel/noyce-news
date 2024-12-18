"use client";

import React from "react";
import { NewsSourceType } from "@/app/state/news-provider";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

import { formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";

const fallbackImg = "https://via.placeholder.com/300x200";

export default function TechCrunchStories({ news }: { news: NewsSourceType }) {
  const articles = news.techCrunch || [];
  if (articles.length === 0) return <div>No articles available</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <header className="pb-4 mb-6 border-b border-gray-400 flex justify-between items-center">
        <h1 className="text-2xl font-bold">The Guardian</h1>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString()}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, idx) => (
          <Dialog key={idx}>
            <Card className="relative mb-2 p-4">
              <Badge className="absolute -top-1.5 -right-1.5">
                {article.tag.toUpperCase()}
              </Badge>
              <CardHeader className="p-4">
                <DialogTrigger asChild>
                  <CardTitle className="text-4xl font-semibold leading-tight cursor-pointer">
                    {article.headline}
                  </CardTitle>
                </DialogTrigger>
                <CardDescription className="text-sm text-gray-500">
                  {formatDate(article.createdAt)}
                </CardDescription>
              </CardHeader>
            </Card>
            <DialogContent className="max-w-screen-lg h-4/5 overflow-y-auto p-12 border-gray-400">
              <DialogHeader>
                <DialogTitle className="text-4xl font-semibold leading-tight">
                  {article.standFirst}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 flex gap-4">
                  <span>{formatDate(article.createdAt)}</span> |
                  <span>{article.tag.toUpperCase()}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6">
                <div className="float-right w-1/2 ml-6 mb-4">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={article.mainImg || fallbackImg}
                      alt={article.headline}
                      className="rounded-lg object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </AspectRatio>
                </div>
                <div className="prose max-w-none">
                  <DialogDescription className=" text-base text-white">
                    {article.summary?.split("\n\n").map((paragraph, i) => (
                      <span key={i} className="mb-4">
                        {paragraph}
                      </span>
                    ))}
                  </DialogDescription>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
