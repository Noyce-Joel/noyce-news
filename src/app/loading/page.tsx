/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { NewsLoadingStates } from "@/components/loading/news-loading-states";
import NewsStories from "@/components/stories/news-stories";

import { useState } from "react";
import { useEffect } from "react";

interface ModelResponse {
  article: string;
  message: string;
}

export default function Home() {
  const [modelResponse, setModelResponse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getModelResponse = async () => {
      try {
        const response = await fetch("/api/llama", {
          method: "POST",
          body: JSON.stringify({ articleId: 100 }),
        });
        const data = await response.json();
        setModelResponse(data);
      } catch (error) {
        console.error("Error fetching model response:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getModelResponse();
  }, []);

  useEffect(() => {
    if (modelResponse) {
      console.log(modelResponse);
    }
  }, [modelResponse]);

  return (
    <div>
      {isLoading ? (
        <NewsLoadingStates />
      ) : (
        modelResponse?.summary
      )}
    </div>
  )
}
