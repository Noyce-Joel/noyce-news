"use client";

import {
  getHeadlines,
  getHeadlinesAudio,
  getLatestHeadlines,
} from "@/lib/actions";
import { HeadlinesType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";
import { HEADLINES_AUDIO } from "@/lib/constants";
import HeadlinesSourceUrls from "./headlines-sourceUrls";
import { PlayIcon } from "lucide-react";
import { Button } from "../ui/button";
import AudioVisualizer from "./audio-visualiser";

const prisma = new PrismaClient();

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
    <div>
      {error && (
        <div className="text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      <HeadlinesSourceUrls sourceUrls={headlines?.sourceUrls || []} />
      <AudioVisualizer />
    </div>
  );
}
