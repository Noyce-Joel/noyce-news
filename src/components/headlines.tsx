"use client";

import { getHeadlines } from "@/app/lib/actions";
import { HeadlinesType } from "@/app/lib/types";
import React, { useEffect, useState } from "react";

export default function Headlines() {
  const [headlines, setHeadlines] = useState<HeadlinesType>();
  const [error, setError] = useState<string>();
  const [audioSrc, setAudioSrc] = useState<string>();

  useEffect(() => {
    const fetchHeadlinesAndAudio = async () => {
      console.log("Fetching headlines...");
      try {
        const headlinesData = await getHeadlines();
        console.log("Headlines fetched:", headlinesData);
        setHeadlines(headlinesData);

        if (headlinesData?.summary) {
          const ttsResponse = await fetch("/api/tts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: headlinesData.summary,
            }),
          });

          if (!ttsResponse.ok) {
            const ttsError = await ttsResponse.text();
            throw new Error(`TTS fetch failed: ${ttsError}`);
          }

          const ttsData = await ttsResponse.json();

          const binary = atob(ttsData.audioContent);
          const audioBuffer = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            audioBuffer[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);

          setAudioSrc(url);
        }
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
      {audioSrc && (
        <audio controls>
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
