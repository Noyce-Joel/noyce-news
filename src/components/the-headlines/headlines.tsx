"use client";

import { getLatestHeadlines } from "@/lib/actions";
import { HeadlinesType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import HeadlinesSourceUrls from "./headlines-sourceUrls";
import AudioVisualizer from "./audio-visualiser";

export default function Headlines() {
  const [headlines, setHeadlines] = useState<HeadlinesType | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchHeadlinesAndAudio = async () => {
      try {
        const headlines = await getLatestHeadlines();
        setHeadlines(headlines);
      } catch (err: any) {
        console.error("Error:", err);
        setError(`An error occurred: ${err.message}`);
      }
    };
    fetchHeadlinesAndAudio();
  }, []);

  return (
    <div className="relative">
      <div className="absolute flex justify-center -bottom-4 right-0 left-0 mx-auto z-50">
        <HeadlinesSourceUrls sourceUrls={headlines?.sourceUrls || []} />
      </div>
      <AudioVisualizer />
    </div>
  );
}
