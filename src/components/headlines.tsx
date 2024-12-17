"use client";

import { getHeadlines, getHeadlinesAudio } from "@/app/lib/actions";
import { HeadlinesType } from "@/app/lib/types";
import React, { useEffect, useState } from "react";

export default function Headlines() {
  const [headlines, setHeadlines] = useState<HeadlinesType>();
  const [error, setError] = useState<string>();
  const audioUrl = `https://news-freed.s3.eu-north-1.amazonaws.com/summaries/latest-summary.wav`;

  useEffect(() => {
    const fetchHeadlinesAndAudio = async () => {
      try {
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
      <div className="text-2xl font-bold">
        {headlines?.summary || "No headlines yet"}
      </div>

      <audio controls>
        <source src={audioUrl} type="audio/wav"  />
      </audio>
    </div>
  );
}
