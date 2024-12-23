/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Headlines from "@/components/the-headlines/headlines";
import { useArticles } from "@/state/news-provider";
import { Newspaper, Radio, Sparkles } from "lucide-react";

export default function Home() {
  const { news } = useArticles();

  return (
    <div className="flex flex-col">
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via--zinc-700 to-zinc-900 mb-12">
            News Freed
          </h1>
          <h1 className="text-5xl  mb-8">
            A faster way to
            <br />
            consume news.
          </h1>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            News Freed is a work in progress, built for busy days when I don&apos;t want to read full-length news articles.
            It uses AI to summarise stories from trusted sources and generate audio headlines hourly that are read by a personal news anchor.
          </p>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Newspaper className="w-5 h-5" />
                <span>AI Summaries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5" />
                <span>Audio Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Latest News</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      
        <div className="text-sm text-gray-400 absolute bottom-12 right-12">
          Built with 🤔 by Joel Noyce
        </div>

    </div>
  );
}
